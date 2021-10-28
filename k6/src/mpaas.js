import http from "k6/http";
import { check } from "k6";
import { errorRate } from "./metrics.js";

import * as devOptions from "./dev.js";

export default function () {
  const { token, topicId } = devOptions;

  connectMpaas({
    token,
    topicId,
  });
}

export function connectMpaas({ token, topicId, clusterUrl }) {
  let response;
  let checkRes;
  const authorization = `jwt ${token}`;

  response = http.get(
    `${clusterUrl}/mediasessions/mpaas/token/${topicId}?isCollab=false`,
    {
      headers: {
        authorization,
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  checkRes = check(response, {
    "mpaas token status 200": (r) => r && r.status === 200,
    "mpaas token resp not empty": (r) => {
      const data = r.json();
      return data.sessionId && data.token && data.confId;
    },
  });
  errorRate.add(!checkRes);
}
