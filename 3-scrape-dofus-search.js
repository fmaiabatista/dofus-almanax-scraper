const axios = require("axios"); // Http requests
const cheerio = require("cheerio"); // Enable jquery for the request
const fs = require("fs"); // Filestream library
const { RateLimiter } = require("limiter"); // Rate limiting library
const axiosRetry = require("axios-retry"); // Axios-retry library

// DATA

const almanaxLinkSearch = require("./Assets/2-almanax-link-search.json");
/*
 * The following is needed in case we need to rerun to check for missed items
 * This is because when we write files everything is overwritten
 */
const almanaxLinkEng1 = require("./Assets/3.1-almanax-link-eng.json");

// PROGRAM

axiosRetry(axios, { retries: 10, retryDelay: retryCount => retryCount * 1000 });
const almanax = { data: [] };
// This sets the time between requests in miliseconds
const limiter = new RateLimiter(1, 1000);

almanaxLinkSearch.data.forEach((entry, index) => {
  if (almanaxLinkEng1.data[index] === null) {
    limiter.removeTokens(1, () => {
      axios
        .get(`${entry.item.link.search}`)
        .then(
          response => {
            if (response.status === 200) {
              // Make the DOM of the requested page available with $
              const html = response.data;
              const $ = cheerio.load(html);

              // Get english item link
              const regexItemName = entry.item.name.eng
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/'s/g, "");

              // Need the extra \ to get (.*\d+-VALUE)$
              const regexString = `(.*\\d+-${regexItemName})$`;

              // This will create a RegExp object
              const actualRegex = new RegExp(regexString);
              console.log(
                `Grabbing data for index ${index}... \
                looking for "${regexItemName}"`,
              );
              /*
               * I look for a DOM element that contains an href attribute
               * such that it ends with a specific pattern
               * This is the solution that works with cheerio
               */
              const filteredLinks = $(".ak-image a").filter(() => {
                if ($(this)["0"].attribs.href !== undefined) {
                  return $(this)["0"].attribs.href.match(actualRegex);
                }
                return 0;
              });
              const itemLinkEng = filteredLinks[0].attribs.href;

              // Push data to object
              almanax.data[index] = entry;
              almanax.data[
                index
              ].item.link.eng = `https://www.dofus.com${itemLinkEng}`;

              // Write data to file
              fs.writeFile(
                "./Assets/almanax-with-link-eng.json",
                JSON.stringify(almanax, null, 2),
                err =>
                  console.log(
                    err
                      ? `Item link successfully written at index ${index}!`
                      : `Error: ${err}`,
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
    console.log(
      `Data at index ${index} already exists. \
      Grabbing existent data and skipping...`,
    );
    almanax.data[index] = almanaxLinkEng1.data[index];
  } // End if index not null
}); // End forEach

/*
 * Because some items could not be found, the next file (4-check-data.js)
 * checks for those indexes and after manual searching we've got the
 * values needed
 * 
 * HARDCODED ITEMS
 * 
 * Index 005 - Error because: without 'wo'
 *   https://www.dofus.com/en/mmorpg/encyclopedia/resources/649-wabbit-hair
 * Index 020 - Error because: secret item
 *   http://dofuswiki.wikia.com/wiki/Bottle_of_Greedoburg
 * Index 095 - Error because: 400 Bad request 
 *   Possivelmente acento que foi convertido na requisição
 *   https://www.dofus.com/en/mmorpg/encyclopedia/resources/291-boowonoke-hairs
 * Index 100 - Error because: without 'of'
 *   https://www.dofus.com/en/mmorpg/encyclopedia/resources/1770-piece-coco-blop
 * Index 153 - Error because: without 'of'
 *   https://www.dofus.com/en/mmorpg/encyclopedia/resources/13730-seed-contention
 * Index 244 - Error because: without 'of'
 *   https://www.dofus.com/en/mmorpg/encyclopedia/resources/17060-potion-old-age
 * Index 263 - Error because: without 'vor''
 *   https://www.dofus.com/en/mmorpg/encyclopedia/weapons/2590-om-axe
 * Index 349 - Error because: Couldn't find seasonal items
 *   http://dofuswiki.wikia.com/wiki/Scarlet_Kwismas_Wrapping_Paper
 * Index 358 - Error because: Couldn't find seasonal items
 *   http://dofuswiki.wikia.com/wiki/Kwismas_Gift
 * Index 361 - Error because: Couldn't find seasonal items
 *   http://dofuswiki.wikia.com/wiki/Kwismas_Gift
 */
