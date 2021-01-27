const ethers = require("ethers");
const evm = require("../src/evm");
const { updateAddrJson, readFromAddrJson } = require("../src/util");

async function main() {
  const linkToken_Addr = readFromAddrJson("linkToken");
  const linkToken = new ethers.Contract(
    linkToken_Addr,
    evm.LinkTokenArtifact.abi,
    evm.getWallet()
  );

  // deploy test consumer contract
  const ATestnetConsumer = new ethers.ContractFactory(
    evm.TestConsumerArtifact.abi,
    evm.TestConsumerArtifact.bytecode,
    evm.getWallet()
  );

  console.log("deploying test consumer...");
  const aTestnetConsumer = await ATestnetConsumer.deploy();
  await aTestnetConsumer.deployed();
  updateAddrJson("aTestnetConsumer", aTestnetConsumer.address);
  console.log("deploy testconsumer to:", aTestnetConsumer.address);

  console.log("set lintoken addr in test consumer...");
  // set linktoken address (I add this method for the ease of deployment)
  await aTestnetConsumer.mySetChainlinkToken(linkToken_Addr);
  console.log("done");

  console.log("sending 100 links to testconsumer contract...");
  // send some links to the consumer contract
  r = await linkToken.transfer(aTestnetConsumer.address, BigInt(10 ** 20));
  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
