const getAlmanax = require("./helpers/getAlmanax");
const writeFile = require("./helpers/writeFile");
const findIssues = require("./helpers/findIssues");
const handleErrors = require("./helpers/handleErrors");

const run = async () => {
  try {
    const almanax = await getAlmanax();
    writeFile(almanax);
    findIssues(almanax);
  } catch (err) {
    handleErrors(err, "run");
  }
};

console.clear();
run();
