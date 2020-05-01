const cheerio = require("cheerio");
const c = require("./constants");

module.exports = (response, itemName, lang) => {
  const html = response.data;
  const $ = cheerio.load(html);

  let suffix;

  if (lang === c.ENUS) {
    // Create regexp for the item
    const name = itemName
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/'s/g, "");

    const regexp = new RegExp(`(.*\\d+-${name})$`);

    // Look through all links and find the one that matches the item
    suffix = Array.from($(".ak-image a"))
      .map(a => a.attribs.href)
      .find(str => regexp.test(str));
  }

  if (lang === c.PTBR) {
    //..
  }

  return `https://www.dofus.com${suffix}`;
};
