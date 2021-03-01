import { sleep, check } from "k6";
import http from "k6/http";
import { errorRate } from './metrics.js';


export default function() {
  const { token } = loginAnonymous('K6 test');
  console.log(`token=${token}`);
}

export const loginAnonymous = (displayname) => {
  const { SPACES_API } = __ENV;

  let response;
  let checkRes;

  response = http.post(
    `${SPACES_API}/anonymous/auth`,
    JSON.stringify({ displayname, username: "", picturefile: "" }),
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  checkRes = check(response, {
    "status is 200": (r) => r && r.status === 200,
    // "has token": (r) => r && !!r.json("token"),
  });
  sleep(0.1);
  errorRate.add(!checkRes);
  if (!checkRes) {
    return {};
  }

  const token = response.json("token");


  return { token };
};

