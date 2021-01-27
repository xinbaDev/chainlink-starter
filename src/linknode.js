const { throws } = require("assert");
const axios = require("axios");
const fs = require("fs");

const CREDENTIAL_PATH = "./credential/.api";
const linknode_url = "http://localhost:6688";

function parseCredential(src, options) {
  const credential = [];
  src
    .toString()
    .split("\n")
    .forEach(function (line, idx) {
      credential.push(line);
    });
  return credential;
}

function getCredential() {
  const credential = parseCredential(
    fs.readFileSync(CREDENTIAL_PATH, { encoding: "utf8" })
  );

  if (credential.length != 2) {
    throw new Error("Parse credential failed");
  }
  return credential;
}

async function loginLinkNode() {
  const credential = getCredential();
  r = await axios.post(linknode_url + "/sessions", {
    email: credential[0],
    password: credential[1],
  });
  const cookies = r.headers["set-cookie"];
  return cookies;
}

module.exports = {
  addJob: async function (job) {
    const cookie = await loginLinkNode();
    r = await axios.post(linknode_url + "/v2/specs", job, {
      headers: {
        Cookie: cookie,
        ContentType: "application/json",
      },
    });
    if (r.status != 200) {
      throw new Error("add job fails");
    }
    return r.data.data.id;
  },
  getConfig: async function () {
    const cookie = await loginLinkNode();
    r = await axios.get(linknode_url + "/v2/config", {
      headers: {
        Cookie: cookie,
      },
    });
    return r;
  },
};
