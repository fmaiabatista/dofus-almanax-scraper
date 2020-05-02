const fs = require("fs");
const axios = require("axios");
const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const getDayOfYear = require("date-fns/getDayOfYear");
const parseISO = require("date-fns/parseISO");
const format = require("date-fns/format");
const getItem = require("./helpers/getItem");
const getLinks = require("./helpers/getLinks");
const getNamePTBR = require("./helpers/getNamePTBR");
const handleErrors = require("./helpers/handleErrors");
const findIssues = require("./helpers/findIssues");
const c = require("./helpers/constants");

const getDateOfYear = require("./helpers/getDateOfYear");

console.clear();

// By default we'll scrape from 1st, Jan to 31st Dec of the current year
let start = c.CURRENT_YEAR_START;
let end = c.CURRENT_YEAR_END;

// If there are CLI arguments, we'll use those to define date range
// Expected 2 args with format "2020/01/25" (include quotes)
const args = process.argv.slice(2);
if (args.length === 2) {
  console.log(
    `💬 Received custom args for date range: ${args.join(" and ")}\n`
  );
  start = new Date(args[0]);
  end = new Date(args[1]);
}

// Calendar array to be used in the dynamic URL
const dates = eachDayOfInterval({ start, end }).map(date =>
  format(date, "yyyy-MM-dd")
);

// Get a copy from or create object that will hold the data
let almanax;
try {
  almanax = [...require(c.FILEPATH).almanax];
} catch (_) {
  almanax = Array.from(new Array(dates.length));
}

// Set request retry conditions
c.AXIOS_RETRY(axios);

// Async function to get the data from Krosmoz.com
const getAlmanax = async () => {
  console.log("🕵️‍♂️  Start scraping...");

  // Loop through calendar array
  for (const [_, date] of dates.entries()) {
    // Get index from day of the year ("2020-01-01" -> 1 -> 0)
    const i = getDayOfYear(parseISO(date)) - 1;

    if (almanax[i]) {
      // If almanax entry already exists (doesn't check content)
      console.log(`🤙 Item for ${date} already exists. Skipping.`);
    } else {
      try {
        console.log(`🔍 Grabbing item for ${date}`);

        const res = await axios.get(
          `http://www.krosmoz.com/en/almanax/${date}`
        );

        // Get original item info
        const [qty, name, search, img, merida, title, desc] = getItem(res);

        // Get Encyclopedia links to be able to find the item name in another language
        let linkENUS, linkPTBR;
        try {
          [linkENUS, linkPTBR] = await getLinks(date, name, search);
        } catch (err) {
          handleErrors(err, "getLinks");
        }

        // Get the item name in Portuguese
        let namePTBR;
        try {
          namePTBR = await getNamePTBR(date, linkPTBR, name);
        } catch (err) {
          handleErrors(err, "getNamePTBR");
        }

        // Mount the item object
        almanax[i] = {
          date,
          merida,
          bonus: {
            title: {
              [c.ENUS]: title
            },
            description: {
              [c.ENUS]: desc
            }
          },
          item: {
            img,
            link: {
              search,
              [c.ENUS]: linkENUS,
              [c.PTBR]: linkPTBR
            },
            name: {
              [c.ENUS]: name,
              [c.PTBR]: namePTBR
            },
            qty
          }
        };
      } catch (err) {
        handleErrors(err, "getAlmanax");
      }
    }
  }

  console.log(
    `✅ Done (total items: ${almanax.filter(v => v !== undefined).length})`
  );
};

// Write if new, overwrite if changed, skips if unchanged. Always returns file.
const writeFile = async () => {
  try {
    await getAlmanax();

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

// TODO - improve chaining... ideally this should be explicit:
// await getAlmanax... writeFile can by sync if given almanax arg... findIssues is also sync given a file arg
const run = async () => {
  try {
    const almanax = (await writeFile()).almanax;
    findIssues(almanax);
  } catch (err) {
    handleErrors(err, "run");
  }
};

run();
