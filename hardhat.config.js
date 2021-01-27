require("@nomiclabs/hardhat-ethers");

const local_testnet = "http://localhost:8545";

extendEnvironment((hre) => {
  const Web3 = require("web3");
  hre.Web3 = Web3;

  hre.web3 = new Web3(new Web3.providers.HttpProvider(local_testnet));
});

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.16",
      },
      {
        version: "0.4.24",
        settings: {},
      },
    ],
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: local_testnet,
      gasPrice: 400000000,
      gasLimit: 6000000000,
    },
  },
};
