const ethers = require("ethers");
const evm = require("../src/evm");
const { readFromAddrJson, readFromJobJson } = require("../src/util");
const web3 = require("web3");
const BN = require("bn.js");

const COMFIRMATION_COUNT = 4;

async function main() {
  const wallet = evm.getWallet();
  const aTestnetConsumer = new ethers.Contract(
    readFromAddrJson("aTestnetConsumer"),
    evm.TestConsumerArtifact.abi,
    wallet
  );

  async function makeRequest() {
    const r = await aTestnetConsumer.requestEthereumPrice(
      readFromAddrJson("oracle"),
      readFromJobJson("id")
    );
    return new Promise((resolve) =>
      wallet.provider.once(r.hash, (tx) => {
        const parsedLog = aTestnetConsumer.interface.parseLog(tx.logs[0]);
        if (process.env.NODE_ENV == "rinkeby") {
          console.log(
            `The make request transaction: https://rinkeby.etherscan.io/tx/${tx.transactionHash}`
          );
        }
        resolve(parsedLog.args.id);
      })
    );
  }

  console.log("Making the request...");
  const requestId = await makeRequest();
  console.log(
    `Made the request with ID ${requestId}.\nWaiting for it to be fulfilled...`
  );

  function fulfilled(requestId) {
    return new Promise(async (resolve) => {
      wallet.provider.once(
        aTestnetConsumer.filters.RequestEthereumPriceFulfilled(requestId, null),
        resolve
      );
      if (process.env.NODE_ENV == "local") {
        // Send some dummy transactions to get more confirmations.
        // Only for local testnet.
        for (let i = 0; i < COMFIRMATION_COUNT; i++) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          r = await wallet.sendTransaction({
            to: wallet.address,
            value: 0,
          });
          //console.log(r)
        }
      }
    });
  }

  r = await fulfilled(requestId);
  console.log("Request fulfilled");

  price = await aTestnetConsumer.currentPrice();
  price_hex = "0x" + new BN(price.toString(), 10).toString(16);
  const bytes = web3.utils.hexToBytes(price_hex);
  price = String.fromCharCode(...bytes);
  console.log(`eth price is ${price} USD`);
  if (process.env.NODE_ENV == "rinkeby") {
    console.log(
      `The filfilled request transaction: https://rinkeby.etherscan.io/tx/${r.transactionHash}`
    );
  } else {
    // send an another transaction so that the linknode can finish the whole comfirmation process
    await wallet.sendTransaction({
      to: wallet.address,
      value: 0,
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
