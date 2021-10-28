import ws from "k6/ws";
import http from "k6/http";
import { check, sleep } from "k6";
import {
  errorRate,
  wsErrorRate,
  markreadErrorRate,
  chatMsgSent,
  chatMsgReceived,
  presenceEventSent,
  presenceEventReceived,
} from "./metrics.js";
import { isRandomPercent } from "./utils.js";
import * as devOptions from "./dev.js";

const CHAT_DURATION = __ENV.CHAT_DURATION || 60; // sec
const NEW_MESSAGE_INTERVAL = __ENV.NEW_MESSAGE_INTERVAL || 30; //

export default function () {
  const { token, topicId } = devOptions;
  const { SPACES_API, CHAT_WS } = __ENV;

  chat({
    token,
    topicId,
    clusterSocketUrl: CHAT_WS,
    clusterUrl: SPACES_API,
  });
}

const NEW_MESSAGE_CHANCE = __ENV.NEW_MESSAGE_CHANCE || 1;

const debug = (msg) => {
  if (__ENV.DEBUG) {
    console.log(msg);
  }
};


function chatConnection({token, user, topicId, clusterUrl, clusterSocketUrl, timeout}) {
  const url = `${clusterSocketUrl}/socket.io/?token=${token}&tokenType=jwt&EIO=3&transport=websocket&batchRoster=true`;
  let checkRes;
  let wsOpenTs;
  debug(`WS connecting to ${url}`);
  const response = ws.connect(url, {}, function (socket) {
    let subscribeTime;
    socket.on("open", function open() {
      wsOpenTs = Date.now();
      debug('WS open');
      socket.setInterval(function timeout() {
        socket.ping();
        socket.send('2'); // socket.io ping or something similar
        debug(`${__VU}: ping`);
      }, 1000 * 10);
    });


    const sendChatMessage = (msg) => {
      const typingMsg = {
        category: "party.typing",
        userId: user._id,
        topicId,
        sender: user,
        content: {
          subscribeTime,
          mediaSession: {},
        },
        version: "1.1",
      };
      socket.send(
        `42/chat,["SEND_PRESENCE_EVENT",${JSON.stringify(typingMsg)}]`
      );
      debug(`-->SEND_PRESENCE_EVENT: typing`);

      const sendChatMsg = () => {
        const chatMsg = `k6 ${msg}, vu=${__VU}, iter=${__ITER}, ${new Date().toLocaleTimeString()}`;
        socket.send(
          `42/chat,["SEND_MESSAGE",{ "category": "chat", "chatMessages": {}, "content": { "description": "", "bodyText": "<p>${chatMsg}</p>", "data": [] }, "topicId": "${topicId}" }]`
        );
        chatMsgSent.add(1);
        debug(`-->SEND_MESSAGE`);
      };
      socket.setTimeout(sendChatMsg, 3000);
    };

    const leaveChannel = () => {
      socket.send(
        `42/chat,["UNSUBSCRIBE_CHANNEL",{"channel":{"_id":"","type":"topic"}}]`
      );
      debug("-->UNSUBSCRIBE_CHANNEL");

      const data = {
        category: "app.event.presence.party.leaves",
        content: {
          offline: false,
          idle: false,
          mediaSession: {
            video: false,
            audio: false,
            connected: false,
            screenshare: false,
            selfMuted: false,
            phone: false,
            joinTime: null,
          },
          desktop: false,
          role: "guest",
        },
        topicId: "",
        receivers: [],
        sender: user,
      };

      socket.send(`42/chat,["SEND_PRESENCE_EVENT",${JSON.stringify(data)}]`);
      debug(`-->SEND_PRESENCE_EVENT, leaves`);

      // TODO: verify order
      socket.send(
        `42/chat,["SUBSCRIBE_CHANNEL",{"channel":{"connected":false}}]`
      );
      debug(`-->SUBSCRIBE_CHANNEL, connected=false`);
    };

    const broadcastPresence = () => {
      const data = {
        category: "app.event.presence.party.online",
        content: {
          offline: false,
          idle: false,
          mediaSession: {
            audio: false,
            video: false,
            connected: false,
            phone: false,
            selfMuted: false,
            screenshare: false,
          },
          desktop: false,
          role: "guest", // TODO: "admin" if it's meeting organizer
          subscribeTime,
        },
        topicId,
        receivers: [],
        sender: user,
      };
      socket.send(`42/chat,["SEND_PRESENCE_EVENT",${JSON.stringify(data)}]`);
      debug(`-->SEND_PRESENCE_EVENT, online`);
      presenceEventSent.add(1);
    };

    const presenceResponse = (payload) => {
      const data = {
        category: "app.event.presence.party.online",
        content: {
          offline: false,
          idle: false,
          mediaSession: {
            audio: false,
            video: false,
            connected: false,
            phone: false,
            selfMuted: false,
            screenshare: false,
            joinTime: null,
          },
          desktop: false,
          role: "guest",
          subscribeTime,
          joinedSessionIds: [],
        },
        topicId,
        receivers: [payload.sender],
        sender: user,
        version: "1.1",
      };
      socket.send(`42/chat,["SEND_PRESENCE_EVENT",${JSON.stringify(data)}]`);
      debug(`-->SEND_PRESENCE_EVENT, response to ${payload.sender.username}`);
      presenceEventSent.add(1);
    };



    socket.setInterval(function intervalMsg() {
      if (NEW_MESSAGE_CHANCE !== 1) {
        if (!isRandomPercent(NEW_MESSAGE_CHANCE)) {
          // no messages this time
          return;
        }
      }
      sendChatMessage("repeat");
    }, 1000 * NEW_MESSAGE_INTERVAL);

    socket.on("message", function incoming(msg) {
      // console.log(msg);
      if (msg === "40") {
        socket.send("40/chat?token=" + token + "&tokenType=jwt,");
        return;
      }

      if (msg === "40/chat") {
        socket.setTimeout(() => {
          socket.send(
            `42/chat,["SUBSCRIBE_CHANNEL",{"channel":{"_id":"${topicId}","type":"topic"}, "version": "1.1"}]`
          );
          debug(`-->SUBSCRIBE_CHANNEL, topicId=${topicId}`);
        }, 100)
        return;
      }
;

      if (msg && msg.startsWith("42/chat,")) {
        const data = JSON.parse(msg.substring("42/chat,".length));
        const [action, payload] = data;
        debug(`<--${action}`);

        if (action === "CHANNEL_SUBSCRIBED") {
          subscribeTime = new Date().toISOString();
          broadcastPresence();

          socket.setTimeout(() => {
            if (!__ENV.SKIP_JOIN_MESSAGE) {
              socket.setTimeout(() => sendChatMessage("hello"), 2000);
            }
          }, 1000);
        } else if (action === "PRESENCE_EVENT_RESPONSE") {
          // console.log(JSON.stringify(payload))
          presenceEventReceived.add(1);
          if (
            payload.category === "app.event.presence.party.online" &&
            (payload.receivers || []).length === 0
          ) {
            // only responding to events without receivers, that's how new members get list of online users
            presenceResponse(payload);
          }
        } else if (action === "MESSAGE_SENT") {
          debug(`message sent, category ${payload.category}`);
          if (payload.category === "chat" && payload.sender._id !== user._id) {
            chatMsgReceived.add(1);
            const resp = http.post(
              `${clusterUrl}/users/me/spaces/${topicId}/markread`,
              '{}',
              {
                headers: {
                  accept: "application/json",
                  authorization: `jwt ${token}`,
                  "content-type": "application/json",
                },
              }
            );
            checkRes = check(resp, {
              "markread status is 200": (r) => r && r.status === 200,
            });
            markreadErrorRate.add(!checkRes);
          }
        }
      }
    });

    socket.on("close", function close() {
      // console.log("disconnected");
      debug('WS close');
      const wsCloseTs = Date.now();
      const conTime = (wsCloseTs - wsOpenTs);
      console.log(`vu: ${__VU}: WS closed, was open for ${conTime/1000} sec`);
      if (conTime < timeout) {
        console.log(`vu: ${__VU}: connection dropped, reconnecting for ${(timeout - conTime)/1000}s`)
        chatConnection({token, user, topicId, timeout: timeout - conTime, clusterUrl, clusterSocketUrl});
      }
    });

    socket.on("error", function (e) {
      // note, that WS connection will close if VU does not send any messages for some time (~2mins)
      // not sure if it's k6 or spaces that's causing it, even though it's pinging every 10s
      console.log("ws error");
      if (e.error() != "websocket: close sent") {
        wsErrorRate.add(1);
        console.log(
          `vu: ${__VU}, username: ${user.username} error thrown in WS code: `,
          e.error()
        );
        check(
          {},
          {
            "chat websocket error": () => false,
          }
        );
      }
    });

    socket.setTimeout(function () {
      console.log(`vu: ${__VU}, username: ${user.username} WS connection timeout, closing`);
      leaveChannel();

      socket.close();
    }, timeout);
  });

  checkRes = check(response, {
    "chat status is 101": (r) => r && r.status === 101,
  });
  wsErrorRate.add(!checkRes);
}

export function chat({ token, topicId, clusterUrl, clusterSocketUrl }) {

  let checkRes;
  let meResp = http.get(`${clusterUrl}/users/me`, {
    headers: {
      accept: "application/json",
      authorization: `jwt ${token}`,
      "content-type": "application/json",
    },
  });
  checkRes = check(meResp, { "status is 200": (r) => r && r.status === 200 });
  errorRate.add(!checkRes);

  const me = meResp.json();

  const user = {
    _id: me._id,
    type: me.aType,
    username: me.username,
    displayname: me.displayname,
    picture_url: me.picture_url,
    phone_numbers: [],
  };

  // console.log(JSON.stringify({ user }))

  const timeout = 1000 * CHAT_DURATION;
  try {
    chatConnection({token, user, timeout, topicId, clusterUrl, clusterSocketUrl})
  } catch(e) {
    console.error(e);
  }
}
