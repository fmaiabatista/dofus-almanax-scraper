// DATA

const almanaxWithLinkEng = require("./Assets/3-almanax-link-eng.json");

// PROGRAM

const holdNullIndices = [];

almanaxWithLinkEng.data.filter((elem, index) => {
  if (elem === null) {
    holdNullIndices.push(index);
  }
  return elem === null;
});

console.log(`Counted ${holdNullIndices.length} null values in AlmanaxLinkENG.`);
console.log(`Null values array: [${holdNullIndices}]`);
console.log(
  holdNullIndices.length
    ? `
  Please fill these manually by copying the item data from 
  AlmanaxSearch (previous step) and adding the links from
  the comments at the bottom of this file.`
    : `
  No items are missing! Proceed to 5-create-br-links.`,
);

/*
 * Because some items could not be found, this file (4-check-data.js)
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
