const { readFromAddrJson, updateJobJson } = require("../src/util");
const { addJob } = require("../src/linknode");

var example_job = {
  name: "Get > Bytes32",
  initiators: [
    {
      type: "runlog",
      params: {
        address: "",
      },
    },
  ],
  tasks: [
    {
      type: "httpget",
    },
    {
      type: "jsonparse",
    },
    {
      type: "ethbytes32",
    },
    {
      type: "ethtx",
    },
  ],
};

async function main() {
  // fill in the oracle address in job spec
  const oracle = readFromAddrJson("oracle");
  example_job["initiators"][0]["params"]["address"] = oracle;

  // // login in as admin
  // await dockerCommand('exec chainlink-localtest2021 chainlink admin login -f /chainlink/.api', { echo: false });

  // // add job
  // await dockerCommand('exec chainlink-localtest2021 chainlink jobs create '
  //                       + "'" + JSON.stringify(example_job) + "'", { echo: true });

  id = await addJob(JSON.stringify(example_job));
  updateJobJson("id", id);
  console.log("job id:" + id);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
