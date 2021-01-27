const evm = require("../src/evm");

async function main() {
  const wallet = evm.getWallet();
  console.log(`${wallet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
