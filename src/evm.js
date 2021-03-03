require("dotenv").config({ path: "./env/.env.wallet" });
require("dotenv").config({ path: "./env/.env.provider" });
const ethers = require("ethers");

if (!process.env.PROVIDER_HTTP_URL) {
  throw new Error("Missing provider URL");
}

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_HTTP_URL
);

module.exports = {
  getProvider: function () {
    return provider;
  },
  LinkTokenArtifact: require("../artifacts/contracts/LinkToken.sol/LinkToken.json"),
  OracleArtifact: require("../artifacts/contracts/Oracle.sol/Oracle.json"),
  TestConsumerArtifact: require("../artifacts/contracts/TestConsumer.sol/ATestnetConsumer.json"),
  getWallet: function () {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    return wallet.connect(provider);
  },
};
