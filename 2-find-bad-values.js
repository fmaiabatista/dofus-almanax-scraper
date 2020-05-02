const fs = require("fs");
const almanax = require("./assets/almanax.json").almanax;
const getDateOfYear = require("./helpers/getDateOfYear");
const c = require("./helpers/constants");

almanax.forEach((entry, i) => {
  // Check if entry is null

  if (!entry) {
    console.log(`❗️👎 Entry for ${getDateOfYear(i)} is null`);
  } else if (!entry.item.link[c.ENUS]) {
    console.log(`❗️🔗 ${entry.item.name[c.ENUS]} is missing link.en-us`);
  } else if (!entry.item.link[c.PTBR]) {
    console.log(`❗️🇧🇷 ${entry.item.name[c.ENUS]} is missing link.pt-br`);
  } else if (!entry.item.name[c.PTBR]) {
    console.log(`❗️🇧🇷 ${entry.item.name[c.ENUS]} is missing name.pt-br`);
  }
});

// console.log(`Entry for ${getDateOfYear(0)} is null`);

/*
 * Because some items could not be found, the next fil≈e (4-check-data.js)
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
