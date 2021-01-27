const ethers = require("ethers");
const evm = require("../src/evm");
const Web3 = require("web3");

async function main() {
  accounts = await evm.getProvider().listAccounts();
  const web3 = new Web3(
    new Web3.providers.HttpProvider(evm.getProvider().address)
  );
  const wallet = evm.getWallet();
  r = await web3.eth.sendTransaction({
    from: accounts[0],
    to: wallet.address,
    value: 10 ** 19,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
