// Creator: k6 Browser Recorder 0.3.2

import { sleep, group, check } from "k6";
import http from "k6/http";
import { errorRate } from './metrics.js';

export const options = { vus: 10, duration: "5m" };

export default function () {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkX3NpZyI6Ik93SF9XaUVQTGMyQjQ0OWlMNzR4RjY2MGRuYkpqeldZMmZ3Y2xOYVoyMGciLCJwcm9kdWN0X3R5cGUiOiJhY2NvdW50cyIsImxhc3R1cGRhdGV0aW1lIjoiMjAyMC0wNy0zMFQxNToxODoxMy40OTkiLCJpc3MiOiJlc25hLmNvbSIsInB1YmxpY2tleWlkIjoiYWc5emZtOXVaWE51WVhOMFlXZHBibWR5R2dzU0RVZEtkM1JRZFdKc2FXTkxaWGtZZ0lDQXB0Q2Eyd2dNIiwiZXhwIjoxNTk5MzQwMDU0LCJ1c2VyX2lkIjoiYWc5emZtOXVaWE51WVhOMFlXZHBibWR5RVFzU0JGVnpaWElZZ0lDQXhvUHRpZ2tNIiwidmVyIjoiMi4wIn0.d7dFKvNVvt8QWOv3bYHwxKm44YmBkudksTl_xQnSmGxeIZFLMgJ7kHR5-uQ-QXviqPJ6YJ6nGR3cKYXiF--cpx_XmMuIYHFHMVtPS6EErSlC54xde-oTsIRsJfjXbrEbjJwRbKa7M96eGPgwv1nOPg2Qpv9vFFf-Cx6qIAv6VbbepLpEBfkKDCrWBjRpt7pia6ZE1fzpK486B_sXjSn-7yGvMvuYodir8jMj7twaVUeXs7XO5-P_eRa4xP-FzwqY0P2uUDKRaSDbblRRu3NYaAMl2F95rY4lyTwju_6ELMpyhnybb-IXg9Ic8lL6905-mA0ZjuH-nuGMu8xmkTvtpA";
  const organizer = "user1@ericloadtest.com";
  const isGuest = false;
  const loadDashboard = true;
  const joinTopicId = "5fca9bf4a507404a1865ff1c"
  const { topicId } = join({ token, isGuest, organizer, loadDashboard, joinTopicId });
  console.log(`topicId = ${topicId}`);
  // Automatically added sleep
  sleep(1);
}

export function join({ token, isGuest, organizer, loadDashboard, joinTopicId }) {

  if (joinTopicId && __ENV.SKIP_JOIN_API_CALLS) {
    return {
      topicId: joinTopicId,
    };

  }
  const { SPACES_API } = __ENV;
  const authorization = `jwt ${token}`;
  let response;
  let checkRes;

  response = http.get(`${SPACES_API}/service-configurations`);
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  // /me call is made in chat.js to create user object

  // response = http.get(`${SPACES_API}/users/me`, {
  //   headers: {
  //     accept: "application/json",
  //     authorization,
  //     "content-type": "application/json",
  //   },
  // });
  // check(response, { "status is 200": (r) => r && r.status === 200});

  response = http.get(`${SPACES_API}/users/me/settings`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  if (!isGuest) {
    response = http.get(`${SPACES_API}/users/me/featuresrollout`, {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    });
    checkRes = check(response, {
      "status is 200": (r) => r && r.status === 200,
    });
    errorRate.add(!checkRes);
  }

  if (loadDashboard && !isGuest) {
    goToDashboard({ token });
  }

  response = http.get(
    `${SPACES_API}/users/me/spaces?topictype=group&size=20&topicstatus=0&filtertype=&filtertype`,
    {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    }
  );
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(
    `${SPACES_API}/users/me/spaces?topictype=group&size=20&topicstatus=0&filtertype=pinned`,
    {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    }
  );
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  let topicId;
  if (joinTopicId) {
    topicId = joinTopicId;
  } else {
    response = http.get(`${SPACES_API}/users/meetingroom/${organizer}?`, {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    });

    const isMeetingGood = check(response, {
      "status is 200": (r) => r && r.status === 200,
      "json response": (r) =>
        r && (r.headers["Content-Type"] || "").includes("application/json"),
    });

    errorRate.add(!isMeetingGood);

    if (!isMeetingGood) {
      return {};
    }

    topicId = response.json("data._id");
    checkRes = check(topicId, {
      "topicId is defined": (id) => !!id,
    });
    errorRate.add(!checkRes);

  }
  // console.log(`vu: ${__VU}, topicId = ${topicId}`)

  response = http.get(
    `${SPACES_API}/users/me/spaces?topictype=direct&size=20`,
    {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    }
  );
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(`${SPACES_API}/topics/${topicId}/ideas?size=500`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(`${SPACES_API}/topics/${topicId}/tasks?size=500`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(`${SPACES_API}/topics/${topicId}/meetings?size=200`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(`${SPACES_API}/spaces/${topicId}/join/`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(
    `${SPACES_API}/topics/${topicId}/messages/byref?size=30`,
    {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    }
  );
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  response = http.get(`${SPACES_API}/spaces/${topicId}/activemeeting`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  // this is what I currently get
  checkRes = check(response, {
    "active meeting - not error": (r) => r && [200, 404].includes(r.status),
  });
  errorRate.add(!checkRes);

  return {
    topicId,
  };
}

const goToDashboard = ({ token }) => {
  const { SPACES_API } = __ENV;
  const authorization = `jwt ${token}`;
  let response;
  let checkRes;

  response = http.get(`${SPACES_API}/users/me`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  const user = response.json();
  console.log(`${__VU}: ${user.username || user.displayname} visits dashboard`);

  response = http.get(`${SPACES_API}/users/${user._id}/statistics`, {
    headers: {
      accept: "application/json",
      authorization,
      "content-type": "application/json",
    },
  });
  checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  const urls = [
    'users/me/spaces?topictype=group%2Cpersonal&size=10',
    'users/me/attachments/natives?size=10',
    'users/me/ideas?size=10',
    'users/me/tasks?size=10&status=pending',
    'users/me/tasks?size=10&status=completed'
  ];
  for(const url of urls) {
    response = http.get(`${SPACES_API}/${url}`, {
      headers: {
        accept: "application/json",
        authorization,
        "content-type": "application/json",
      },
    });
    checkRes = check(response, { "status is 200": (r) => r && r.status === 200 });
    errorRate.add(!checkRes);
  }
}
