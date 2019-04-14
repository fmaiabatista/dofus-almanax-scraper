const fs = require("fs");
const axios = require("axios");
const dayjs = require("dayjs");
const cheerio = require("cheerio");
const axiosRetry = require("axios-retry");

const almanax = { data: [] };
const path = "./Assets/scraped-almanax-TMP.json";

const startDate = dayjs().startOf("year");
const endDate = dayjs()
  .endOf("year")
  .add(1, "day");
const daysDiff = endDate.diff(startDate, "day");

let date = dayjs().startOf("year");
let index = 0;

function deleteFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`Deleting previous file...`);
    fs.unlinkSync(filePath);
    console.log("Done deleting previous file.");
  }
}

function writeToFile(filePath, data) {
  console.log("Writing file...");
  fs.appendFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Done writing file.");
}

console.log(
  `Will request data from dates ${startDate.format(
    "YYYY-MM-DD",
  )} to ${endDate
    .subtract(1, "day")
    .format("YYYY-MM-DD")} totalizing ${daysDiff} requests.`,
);

// Set request retry conditions
axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

// Remove file if it exists from previous run
deleteFileIfExists(path);

/* eslint-disable no-loop-func */
while (endDate.diff(date, "day") > 0) {
  const formattedDate = date.format("YYYY-MM-DD");

  console.log(`Requesting data for ${formattedDate}...`);
  axios
    .get(`http://www.krosmoz.com/pt/almanax/${formattedDate}`)
    .then(response => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        index = dayjs(formattedDate).diff(startDate, "day");

        // Get item and quantity
        const questInstructions = $(
          ".achievement.dofus:first-of-type .fleft",
        ).text();
        let regex = /.*\s(\d+)\s(.*)\sand.*/g;
        let arr = regex.exec(questInstructions);
        const itemQuantity = arr[1];
        const itemNameEng = arr[2];
        const itemImage = $(".achievement.dofus:first-of-type img").attr("src");

        // Get merida
        const questTitle = $(
          ".achievement.dofus:first-of-type .more-infos p:first-child",
        ).text();
        regex = /.*for\s(.*)/g;
        arr = regex.exec(questTitle);
        const merida = arr[1];

        // Get bonus title
        const questBonusTitle = $(".achievement.dofus:first-of-type .mid")
          .contents()
          .get(2)
          .nodeValue.trim();
        regex = /.*:\s(.*)/g;
        arr = regex.exec(questBonusTitle);
        const bonusTitleEng = arr[1];

        // Get bonus description
        const questBonusDescription = $(
          ".achievement.dofus:first-of-type .more",
        ).html();
        regex = /(.*)<div class="more-infos">/g;
        arr = regex.exec(questBonusDescription);
        regex = /<\/?b>/g;
        const bonusDescriptionEng = arr[1].replace(regex, "").trim();

        // Push data to array in corresponding index
        almanax.data[index] = {
          index,
          date: formattedDate,
          merida,
          item: {
            name: {
              eng: itemNameEng,
            },
            quantity: itemQuantity,
            image: itemImage,
          },
          bonus: {
            title: {
              eng: bonusTitleEng,
            },
            description: {
              eng: bonusDescriptionEng,
            },
          },
        };
        console.log(`Received data for ${formattedDate} (${index}).`);

        if (almanax.data.length === daysDiff) {
          console.log(`Finished receiving all ${daysDiff} requests.`);
          writeToFile(path, almanax);
          process.exit(0);
        }
      } else if (response.status !== 200) {
        console.log("Error:", response.status);
      }
    })
    .catch(error => {
      console.error(error);
      process.exit(-1);
    });

  date = date.add(1, "day");
}
