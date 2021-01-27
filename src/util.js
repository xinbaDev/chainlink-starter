const fs = require("fs");

function readJson(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return {};
}

module.exports = {
  updateAddrJson: function (name, value) {
    const filePath = "./records/contract-addr.json";
    const logJson = readJson(filePath);
    logJson[name] = value;
    fs.writeFileSync(filePath, JSON.stringify(logJson, null, 4));
  },
  readFromAddrJson: function (name) {
    const filePath = "./records/contract-addr.json";
    return readJson(filePath)[name];
  },
  updateJobJson: function (name, value) {
    const filePath = "./records/job.json";
    const logJson = readJson(filePath);
    logJson[name] = value;
    fs.writeFileSync(filePath, JSON.stringify(logJson, null, 4));
  },
  readFromJobJson: function (name) {
    const filePath = "./records/job.json";
    return readJson(filePath)[name];
  },
};
