const axios = require("axios"); // Http requests
const cheerio = require("cheerio"); // Enable jquery for the request
const fs = require("fs"); // Filestream library
const { RateLimiter } = require("limiter"); // Rate limiting library
const axiosRetry = require("axios-retry"); // Axios-retry library

// DATA

const almanaxLinkBr = require("./Assets/4-almanax-link-br.json");
const almanaxNameBr1 = require("./Assets/5.1-almanax-name-br.json");

// PROGRAM

axiosRetry(axios, { retries: 10, retryDelay: retryCount => retryCount * 1000 });
const almanaxArr = { data: [] };
// This sets the time between requests in miliseconds
const limiter = new RateLimiter(1, 1000);

almanaxLinkBr.data.forEach((entry, index) => {
  if (almanaxNameBr1.data[index] === null) {
    console.log(`Index ${index} is null...`);
    if (entry.item.link.br.includes("dofus.com")) {
      limiter.removeTokens(1, () => {
        axios
          .get(`${entry.item.link.br}`)
          .then(
            response => {
              if (response.status === 200) {
                console.log(`Grabbing data for index ${index}...`);

                // Make the DOM of the requested page available with $
                const html = response.data;
                const $ = cheerio.load(html);

                // Get br item name
                const brItemName = $(".ak-return-link")
                  .text()
                  .trim();

                // Push data to object
                almanaxArr.data[index] = entry;
                almanaxArr.data[index].item.name.br = brItemName;

                // Write data to file
                fs.writeFile(
                  "./Assets/5-almanax-name-br.json",
                  JSON.stringify(almanaxArr, null, 2),
                  err =>
                    console.log(
                      err
                        ? `Error: ${err}`
                        : `Translated item name (${brItemName}) successfully \
written at index ${index}!`,
                    ),
                );
              } // End if response 200
            }, // End success callback of then
            error => {
              console.log(
                `Request error at index ${index}: "${error.response.status}: ${
                  error.response.statusText
                }"`,
              );
            }, // End error callback of then
          )
          .catch(err => {
            console.log(`Oops! We've got an error: ${err}`);
          }); // End then
      }); // End limiter
    } else {
      // If it doesn't include "dofus.com"
      console.log(`Item ${almanaxLinkBr.data[index].item.name.eng} is from \
the Wikia. We'll append a * to the English name to denote an observation.`);
      almanaxArr.data[index] = entry;
      almanaxArr.data[index].item.name.br = `${entry.item.name.eng}*`;
      // Write data to file
      fs.writeFile(
        "./Assets/5-almanax-name-br.json",
        JSON.stringify(almanaxArr, null, 2),
        err =>
          console.log(
            err
              ? `Error: ${err}`
              : `Item name (${almanaxArr.data[index].item.name.br}) will stay \
in English at index ${index}!`,
          ),
      );
    } // End if includes "dofus.com"
  } else {
    // If item already exists
    console.log(
      `Data at index ${index} already exists. \
Grabbing existent data and skipping...`,
    );
    almanaxArr.data[index] = almanaxNameBr1.data[index];
  } // End if item doesn't exist
}); // End forEach
