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
const getData = async () => {
  console.log("🕵️‍♂️  Starting scrape...");

  // Set request retry conditions
  axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

  // Calendar array to be used in the dynamic URL
  const dates = eachDayOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date())
  }).map(date => date.toISOString().split("T")[0]);

  // Create object that will hold the data
  const almanax = { data: Array.from(new Array(365)) };

  for (const [i, date] of dates.entries()) {
    try {
      const response = await axios.get(
        `http://www.krosmoz.com/en/almanax/${date}`
      );

      const [qty, name, image, merida, title, description] = getInfo(response);

      console.log(`🔍 Grabbing item for ${date}: ${qty}x ${name}`);

      almanax.data[i] = {
        date,
        merida,
        bonus: {
          title,
          description
        },
        item: {
          image,
          name,
          qty
        }
      };
    } catch (err) {
      handleErrors(err);
    }
  }

  console.log(
    `✅ Done (total: ${almanax.data.filter(v => v !== undefined).length})`
  );
  return almanax;
};

const writeFile = async () => {
  try {
    const data = await getData();

    console.log("\n📁 Writing file...");
    fs.writeFileSync(FILEPATH, JSON.stringify(data, null, 2));
    console.log(`✅ File is ready at "${FILEPATH}"`);
  } catch (err) {
    handleErrors(err);
  }
};

console.clear();
writeFile();
