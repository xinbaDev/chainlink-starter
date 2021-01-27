const axios = require("axios");
const ethers = require("ethers");
const evm = require("../src/evm");
const { getConfig } = require("../src/linknode");
const { updateAddrJson } = require("../src/util");

async function main() {
  // get account address through web api
  r = await getConfig();
  linkNodeAddr = r.data["data"]["attributes"]["accountAddress"];
  updateAddrJson("linkNodeAddr", linkNodeAddr);
  console.log("chainlink node address:" + linkNodeAddr);

  // send 0.1 ethers to the account of chainlink node to pay for gas
  console.log("sending 0.1 ethers to linknode...");
  const amount = "0.1";
  await evm.getWallet().sendTransaction({
    to: linkNodeAddr,
    value: ethers.utils.parseEther(amount),
  });
  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
