const ethers = require("ethers");
const evm = require("../src/evm");
const { updateAddrJson } = require("../src/util");

async function main() {
  const LinkToken = new ethers.ContractFactory(
    evm.LinkTokenArtifact.abi,
    evm.LinkTokenArtifact.bytecode,
    evm.getWallet()
  );
  const linkToken = await LinkToken.deploy();
  await linkToken.deployed();

  // save linkToken contract address
  updateAddrJson("linkToken", linkToken.address);
  console.log("deploy linkToken to:", linkToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
