import { sleep, group, check } from "k6";
import http from "k6/http";

export default function () {
  login({
    username: "user4@ericloadtest.com",
    password: "PIZiysFxB1",
  });
}

const ACCOUNTS_URL = "https://onesnastaging.esna.com";
const { SPACES_URL } = __ENV;

export const login = ({ username, password }) => {
  let response;
  const dashboardUrl = `${SPACES_URL}/spaces/dashboard`;
  const dashboardUrlEncoded = encodeURIComponent(dashboardUrl);
  const LOGIN_URL =
    `${ACCOUNTS_URL}/account/login/?next=${dashboardUrlEncoded}&product_name=zangspaces`;

  response = http.get(LOGIN_URL, {
    headers: {
      "upgrade-insecure-requests": "1",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
    },
  });

  const loginPageOk = check(response, {
    "status is 200": (r) => r && r.status === 200,
    "has `csrftoken` cookie": (r) => r && !!r.cookies.csrftoken,
    "has `sessionid` cookie": (r) => r && !!r.cookies.sessionid,
  });

  if (!loginPageOk) {
    return {}
  }

  // console.log(JSON.stringify(response.cookies))

  const csrftoken = response.cookies.csrftoken[0].value;

  sleep(0.1);

  response = http.post(
    LOGIN_URL,
    {
      csrfmiddlewaretoken: csrftoken,
      previous_state: "login",
      next: dashboardUrlEncoded,
      require_phone: "",
      loginstate: "login",
      username: username,
      password: password,
      password2: "",
      remember: "1",
    },
    {
      redirects: 0,
      headers: {
        "upgrade-insecure-requests": "1",
        origin: ACCOUNTS_URL,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        referer: ACCOUNTS_URL,
        "accept-language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  check(response, {
    // "status is 302": (r) => r && r.status === 302,
    "has cookie 'AUTH_TOKEN'": (r) =>
      r && r.cookies.AUTH_TOKEN && r.cookies.AUTH_TOKEN.length > 0,
    "no invalid password msg": (r) =>
      !r.body || !r.body.includes("Invalid Username or Password!"),
    "no `signed in already` msg": (r) =>
      !r.body || !r.body.includes("You signed in with another tab or window"),
    "not a `sign in page`": (r) =>
      !r.body || !r.body.includes("Sign In to continue"),
    "no `invalid email`": (r) =>
      !r.body || !r.body.includes("Invalid Email or Phone Format"),
  });
  if (!response.cookies.AUTH_TOKEN) {
    return {};
  }
  const token = response.cookies.AUTH_TOKEN[0].value;

  // console.log(response.body);

  response = http.get(dashboardUrl, {
    headers: {
      referer: ACCOUNTS_URL,
      cookie: `AUTH_TOKEN=${token}`,
    },
  });
  check(response, { "status is 200": (r) => r && r.status === 200 });

  return { token };
};
