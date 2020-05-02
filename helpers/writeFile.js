const fs = require("fs");
const handleErrors = require("./handleErrors");
const c = require("./constants");

// Write if new, overwrite if changed, skips if unchanged. Always returns file.
module.exports = almanax => {
  try {
    // Check if file exists
    if (fs.existsSync(c.FILEPATH)) {
      const prevAlmanax = require(c.FILEPATH).almanax;

      // Check if content did not change
      if (JSON.stringify(prevAlmanax) === JSON.stringify(almanax)) {
        console.log("\n📁 Content did not change. Skipping.");
        console.log(`✅ File is ready, unchanged at "${c.FILEPATH}"`);

        return JSON.parse(fs.readFileSync(c.FILEPATH, "UTF-8"));
      }
    }

    // If there are changes, rewrite file
    console.log("\n📁 Writing file...");
    fs.writeFileSync(c.FILEPATH, JSON.stringify({ almanax }, null, 2));
    console.log(`✅ File is ready at "${c.FILEPATH}"`);

    return JSON.parse(fs.readFileSync(c.FILEPATH, "UTF-8"));
  } catch (err) {
    handleErrors(err, "writeFile");
  }
};
