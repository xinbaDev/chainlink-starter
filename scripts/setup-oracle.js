const ethers = require("ethers");
const evm = require("../src/evm");
const { updateAddrJson, readFromAddrJson } = require("../src/util");

async function main() {
  const linkToken_Addr = readFromAddrJson("linkToken");

  // deploy oracle contract
  const Oracle = new ethers.ContractFactory(
    evm.OracleArtifact.abi,
    evm.OracleArtifact.bytecode,
    evm.getWallet()
  );
  console.log("deploying oracle...");
  const oracle = await Oracle.deploy(linkToken_Addr);
  await oracle.deployed();
  updateAddrJson("oracle", oracle.address);
  console.log("deploy oracle to:", oracle.address);

  const linkNodeAddr = readFromAddrJson("linkNodeAddr");

  // setFulfillmentPermission
  console.log("set fulfillment permission for linknode...");
  r = await oracle.setFulfillmentPermission(linkNodeAddr, true);
  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
