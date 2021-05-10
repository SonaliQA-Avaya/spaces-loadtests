import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { fail, sleep } from "k6";

import { chat } from "./chat.js";
import { join } from "./join.js";
import { login } from "./login.js";
import { loginAnonymous } from "./login-anonymous.js";
import { connectMpaas } from "./mpaas.js";
import { pad, makeStages, isRandomPercent } from "./utils.js";
import { errorRate, wsErrorRate, joinCounter } from "./metrics.js";

const USERS_PER_FILE = 100;

let dataFilePath = __ENV.DATA_PATH || "../data/user-pwd-sample.csv";

// export let options = {
//   stages: [
//     { duration: '2m', target: 100 },
//     { duration: '1m', target: 200 },
//     { duration: '1m', target: 600 },
//     { duration: '2m', target: 1000 },
//     { duration: '5m', target: 2000 },
//   ],
// };

const vusOptions = {
  vus: parseInt(__ENV.VUS) || 350,
  holdMinutes: __ENV.HOLD_MINUTES || 30,
  vusPerMinute: __ENV.VUS_PER_MINUTE || 7,
};

const DATA_FILE_START_INDEX = parseInt(__ENV.DATA_FILE_START_INDEX || 0);
const POD_INDEX = parseInt(__ENV.POD_INDEX || 0);
const INDEX_SHIFT = POD_INDEX * vusOptions.vus + DATA_FILE_START_INDEX;

export const options = {
  stages: makeStages(vusOptions),
  thresholds: {
    errors: ["rate<0.01"], // threshold on a custom metric
    ws_errors: ["rate<0.01"],
    http_req_duration: [
      {
        threshold: "p(95)<1000",
        // abortOnFail: true,
        // delayAbortEval: "2m",
      },
    ],
  },
};

const isDataInSplitFiles = !!__ENV.DATA_FILE_PREFIX;

// split large file into multiple smaller file to save memory
if (isDataInSplitFiles) {
  const vu = (__VU || 1) + INDEX_SHIFT; // ignore `cloud` VU for now
  const fileNum = Math.floor(vu / USERS_PER_FILE);
  const suffix = pad(fileNum, 4);
  const fileName = `${__ENV.DATA_FILE_PREFIX}${suffix}.csv`;
  dataFilePath = `${__ENV.DATA_PATH}${fileName}`;
}

const csvData = papaparse.parse(open(dataFilePath), { header: false }).data;

const jwtTokens = {};

const MEETING_SIZE = parseFloat(__ENV.MEETING_SIZE) || 10; // 10 attendies per meeting
const ANONYMOUS_RATE = parseFloat(__ENV.ANONYMOUS_RATE) || 0.1; // 10% are anonymous

// will affect anonymous rate, since iteration won't use anonymous if load dashboard is set to true
const DASHBOARD_VISIT_RATE = parseFloat(__ENV.DASHBOARD_VISIT_RATE) || 0.15;

// if defined all users will join the same topic
const JOIN_TOPIC_ID = __ENV.JOIN_TOPIC_ID;

function run() {
  const dataLength = csvData.length - 1; // last line is empty
  const fileShift = INDEX_SHIFT % USERS_PER_FILE;
  const row = csvData[(__VU - 1 + fileShift) % dataLength];

  const [username, password] = row;
  if (!username || !password) {
    sleep(1);
    fail(
      `vu: ${__VU}, incomplete credentials, ${username}/${password}, dataLength=${dataLength}`
    );
  }

  const isOrganizer = !JOIN_TOPIC_ID && (__VU - 1) % MEETING_SIZE === 0;

  let organizer = username;

  if (!isOrganizer) {
    const orgIndex = Math.floor((__VU - 1) / MEETING_SIZE) * MEETING_SIZE;
    const orgRow = csvData[orgIndex % dataLength];
    organizer = orgRow[0];
    const meetingDesc = JOIN_TOPIC_ID ? JOIN_TOPIC_ID : `hosted by ${organizer}`
    console.log(
      `vu: ${__VU}, ${username} will join meeting ${meetingDesc}`
    );
    if (!organizer) {
      sleep(1);
      fail(
        `vu: ${__VU}, no organizer, index=${orgIndex}, dataFilePath=${dataFilePath}, dataLength=${dataLength}`
      );
    }
  } else {
    console.log(`vu: ${__VU}, ${username} will host a meeting`);
  }

  let isGuest = false;
  const loadDashboard = isRandomPercent(DASHBOARD_VISIT_RATE);

  if (!isOrganizer && !loadDashboard) {
    const usersRate = 1 - ANONYMOUS_RATE;
    const groupNum = __VU % MEETING_SIZE;
    if (groupNum / MEETING_SIZE >= usersRate) {
      isGuest = true;
    }
  }

  // delay before and after starting test
  // will use rand nuber to sleep befor end after, that will randomize different VUS
  // to ensure that they are not hitting api server at the same time
  const CYCLE_DELAY_MAX = 30;

  let token = jwtTokens[username];
  if (!isGuest && !token) {
    // should reduce on /join api
    const loginDelay = Math.floor(Math.random() * CYCLE_DELAY_MAX);
    sleep(loginDelay);
    token = login({ username, password }).token;
    if (!token) {
      console.log(`cannot login with ${username}`);
      isGuest = true;
    } else {
      jwtTokens[username] = token;
    }
  }

  if (isGuest) {
    console.log(`vu=${__VU}: ${username} will join as Anonymous`);
    token = loginAnonymous(`Guest ${username}`).token;
  }
  // console.log(`VU=${__VU}, iter=${__ITER}, isOrganizer=${isOrganizer}, token=${token}`);

  if (!token) {
    sleep(1);
    console.error(`vu=${__VU}: no token for ${usernmae}`);
    return;
  }

  // randomly for 6% of vus, visit dashboard first


  const params = {
    token,
    isGuest,
    organizer,
    loadDashboard,
    joinTopicId: JOIN_TOPIC_ID
  };
  const { topicId } = join(params);
  joinCounter.add(1);
  if (!topicId) {
    sleep(1);
    fail(`cannot get topicId for personal room of ${organizer}`);
  }

  if (__ENV.ENABLE_MPAAS) {
    connectMpaas({ token, topicId });
  }

  chat(Object.assign({}, params, { topicId }));

  const endDelay = Math.floor(Math.random() * CYCLE_DELAY_MAX);
  sleep(endDelay);
}

export default function () {
  try {
    run();
    wsErrorRate.add(0);
    errorRate.add(0);
  } catch (e) {
    console.error(`vu=${__VU}, error=${e.message}`);
    if (e && e.message && /websocket/.test(e.message.toString())) {
      wsErrorRate.add(1);
    } else {
      errorRate.add(1);
    }
    sleep(30);
  }
}


