const fs = require("fs");
const almanax = require("./assets/almanax.json").almanax;
const getDateOfYear = require("./helpers/getDateOfYear");
const c = require("./helpers/constants");

console.clear();
console.log("🐞 Finding issues in Almanax...");

const log = [];

almanax.forEach((entry, i) => {
  // Check if entry is null
  let msg;

  if (!entry) {
    msg = `❗️👎 Entry for ${getDateOfYear(i)} is null`;
  } else if (!entry.item.link[c.ENUS]) {
    msg = `❗️🔗 ${entry.item.name[c.ENUS]} is missing link.en-us`;
  } else if (!entry.item.link[c.PTBR]) {
    msg = `❗️🇧🇷 ${entry.item.name[c.ENUS]} is missing link.pt-br`;
  } else if (!entry.item.name[c.PTBR]) {
    msg = `❗️🇧🇷 ${entry.item.name[c.ENUS]} is missing name.pt-br`;
  }

  if (msg) {
    console.log(msg);
    log.push(msg);
  }
});

console.log("\n📄 Writing logfile...");
fs.writeFileSync(c.LOGPATH, log.join("\n"));
console.log(`✅ Logfile is ready at "${c.LOGPATH}"`);
