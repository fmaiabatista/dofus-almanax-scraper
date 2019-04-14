// DATA

const almanaxNameBr = require("./Assets/5-almanax-name-br.json");

// PROGRAM

const holdNullIndices = [];

almanaxNameBr.data.filter((elem, index) => {
  if (elem === null) {
    holdNullIndices.push(index);
  }
  return elem === null;
});

console.log(`Counted ${holdNullIndices.length} null values in AlmanaxNameBR.`);
console.log(`Null values array: [${holdNullIndices}]`);
console.log(
  holdNullIndices.length
    ? `
  Please try scraping them again or fill manually.`
    : `
  No items are missing! You are done! :)`,
);
