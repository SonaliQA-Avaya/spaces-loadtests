import http from "k6/http";
import { check } from "k6";

export function createTopic({ token }) {
  let response;
  const authorization = `jwt ${token}`;
  const { SPACES_API } = __ENV;

  const topicName = `k6 topic - ${__VU} - ${__ITER} - ${Date.now().toString()}`;
  response = http.post(
    `${SPACES_API}/spaces/invite`,
    `{"topic":{"title":"${topicName}","type":"group","id":null},"invitees":[]}`,
    {
      headers: {
        authorization,
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  check(response, {
    "create meeting status 200": (r) => r && r.status === 200,
  });

  const resJson = response.json();
  check(
    {},
    {
      "response has topicId": () => resJson.data[0].topicId,
    }
  );

  const { topicId } = resJson.data[0];
  return { topicId };
}
