const cheerio = require("cheerio");

module.exports = response => {
  const html = response.data;
  const $ = cheerio.load(html);

  // Quantity and Name
  const questInstructions = $(".achievement.dofus:first-of-type .fleft").text();
  let regex = /.*\s(\d+)\s(.*)\sand.*/g;
  let arr = regex.exec(questInstructions);
  const quantity = arr[1];
  const name = arr[2];

  // Search link
  let search;
  if (name) {
    const term = name.replace(/\s/g, "+").replace("'", "%27");
    search = `https://www.dofus.com/en/search?q=${term}`;
  }

  // Image
  const image = $(".achievement.dofus:first-of-type img").attr("src");

  // Merida
  const questTitle = $(
    ".achievement.dofus:first-of-type .more-infos p:first-child"
  ).text();
  regex = /.*for\s(.*)/g;
  arr = regex.exec(questTitle);
  const merida = arr[1];

  // Bonus title
  const questBonusTitle = $(".achievement.dofus:first-of-type .mid")
    .contents()
    .get(2)
    .nodeValue.trim();
  regex = /.*:\s(.*)/g;
  arr = regex.exec(questBonusTitle);
  const bonusTitle = arr[1];

  // Bonus description
  const questBonusDescription = $(
    ".achievement.dofus:first-of-type .more"
  ).html();
  regex = /(.*)<div class="more-infos">/g;
  arr = regex.exec(questBonusDescription);
  regex = /<\/?b>/g;
  const bonusDescription = arr[1].replace(regex, "").trim();

  return [quantity, name, search, image, merida, bonusTitle, bonusDescription];
};
