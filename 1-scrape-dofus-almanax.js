const fs = require("fs");
const axios = require("axios");
const axiosRetry = require("axios-retry");
const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const startOfYear = require("date-fns/startOfYear");
const endOfYear = require("date-fns/endOfYear");
const getInfo = require("./helpers/getInfo");
const handleErrors = require("./helpers/handleErrors");

const FILEPATH = "./assets/almanax.json";

// Async function to get the data from Krosmoz.com
const getAlmanax = async () => {
  console.log("🕵️‍♂️  Starting scrape...");

  // Set request retry conditions
  axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

  // Calendar array to be used in the dynamic URL
  const dates = eachDayOfInterval({
    start: startOfYear(new Date()),
    // end: endOfYear(new Date())
    end: new Date(2020, 0, 4)
  }).map(date => date.toISOString().split("T")[0]);

  // Get a copy from or create object that will hold the data
  let almanax;
  try {
    almanax = [...require(FILEPATH).almanax];
  } catch (_) {
    almanax = Array.from(new Array(dates.length));
  }

  // Loop through calendar array
  for (const [i, date] of dates.entries()) {
    if (almanax[i]) {
      // If almanax entry already exists (doesn't check content)
      console.log(`🤙 Item for ${date} already exists. Skipping.`);
    } else {
      try {
        const res = await axios.get(
          `http://www.krosmoz.com/en/almanax/${date}`
        );

        const [qty, name, search, img, merida, title, desc] = getInfo(res);

        console.log(`🔍 Grabbing item for ${date}: ${qty}x ${name}`);

        almanax[i] = {
          date,
          merida,
          bonus: {
            title: {
              "en-us": title
            },
            description: {
              "en-us": desc
            }
          },
          item: {
            img,
            link: {
              search
            },
            name: {
              "en-us": name
            },
            qty
          }
        };
      } catch (err) {
        handleErrors(err);
      }
    }
  }

  console.log(
    `✅ Done (total: ${almanax.filter(v => v !== undefined).length})`
  );

  return almanax;
};

const writeFile = async () => {
  try {
    const almanax = await getAlmanax();

    // Check if file exists
    if (fs.existsSync(FILEPATH)) {
      const prevAlmanax = require(FILEPATH).almanax;

      // Check if content did not change
      if (JSON.stringify(prevAlmanax) === JSON.stringify(almanax)) {
        console.log("\n📁 Content did not change. Skipping.");
        console.log(`✅ File is ready, unchanged at "${FILEPATH}"`);
        return;
      }
    }

    // If there are changes, rewrite file
    console.log("\n📁 Writing file...");
    fs.writeFileSync(FILEPATH, JSON.stringify({ almanax }, null, 2));
    console.log(`✅ File is ready at "${FILEPATH}"`);
  } catch (err) {
    handleErrors(err);
  }
};

console.clear();
writeFile();
