if (process.env.NODE_ENV == "local") {
  require("dotenv").config({ path: "./env/.env.local.template" });
} else {
  require("dotenv").config({ path: "./env/.env.rinkeby.template" });
}

require("dotenv").config({ path: ".env.provider" });

const { readFromAddrJson } = require("../src/util");
const fs = require("fs");

async function main() {
  const linkToken_Addr = readFromAddrJson("linkToken");

  const env = {
    ROOT: process.env.ROOT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    ETH_CHAIN_ID: process.env.ETH_CHAIN_ID,
    MIN_OUTGOING_CONFIRMATIONS: process.env.MIN_OUTGOING_CONFIRMATIONS,
    CHAINLINK_TLS_PORT: process.env.CHAINLINK_TLS_PORT,
    SECURE_COOKIES: process.env.SECURE_COOKIES,
    GAS_UPDATER_ENABLED: process.env.GAS_UPDATER_ENABLED,
    ALLOW_ORIGINS: process.env.ALLOW_ORIGINS,
    ETH_URL: process.env.PROVIDER_WS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    LINK_CONTRACT_ADDRESS: linkToken_Addr,
  };

  let envtext = "";
  for (let key in env) {
    envtext += key + "=" + env[key] + "\n";
  }

  if (process.env.NODE_ENV == "rinkeby") {
    fs.writeFileSync("./.env.rinkeby", envtext);
  } else {
    fs.writeFileSync("./.env.local", envtext);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
