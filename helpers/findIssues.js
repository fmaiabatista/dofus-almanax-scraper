const fs = require("fs");
const getDateOfYear = require("./getDateOfYear");
const c = require("./constants");

module.exports = almanax => {
  console.log("\n🐞 Looking for issues in the Almanax...");

  const log = [];

  almanax.forEach((entry, i) => {
    // Check if entry is null
    let msg;

    if (!entry) {
      msg = `🔦 Entry for ${getDateOfYear(i)} is null`;
    } else if (!entry.item.link[c.ENUS]) {
      msg = `🔗 ${entry.item.name[c.ENUS]} is missing link.en-us`;
    } else if (!entry.item.name[c.PTBR]) {
      msg = `🇧🇷 ${entry.item.name[c.ENUS]} is missing name.pt-br`;
    }

    if (msg) {
      console.log(msg);
      log.push(msg);
    }
  });

  if (log.length) {
    console.log("\n📄 Writing logfile...");
    fs.writeFileSync(c.LOGPATH, log.join("\n"));
    console.log(`✅ Logfile is ready at "${c.LOGPATH}"`);
  } else {
    console.log(`\n✨ Whoa! Almanax is clean! You're good to go!`);
  }
};
