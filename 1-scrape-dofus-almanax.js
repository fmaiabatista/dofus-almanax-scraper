const fs = require("fs");
const axios = require("axios");
const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const startOfYear = require("date-fns/startOfYear");
const endOfYear = require("date-fns/endOfYear");
const getItem = require("./helpers/getItem");
const getLinks = require("./helpers/getLinks");
const getNamePTBR = require("./helpers/getNamePTBR");
const handleErrors = require("./helpers/handleErrors");
const c = require("./helpers/constants");

// Calendar array to be used in the dynamic URL
const dates = eachDayOfInterval({
  start: startOfYear(new Date()),
  end: endOfYear(new Date())
  // start: new Date(2020, 5, 3), // For testing
  // end: new Date(2020, 5, 3) // For testing
}).map(date => date.toISOString().split("T")[0]);

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
  for (const [i, date] of dates.entries()) {
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
        return;
      }
    }

    // If there are changes, rewrite file
    console.log("\n📁 Writing file...");
    fs.writeFileSync(c.FILEPATH, JSON.stringify({ almanax }, null, 2));
    console.log(`✅ File is ready at "${c.FILEPATH}"`);
  } catch (err) {
    handleErrors(err, "writeFile");
  }
};

console.clear();
writeFile();
