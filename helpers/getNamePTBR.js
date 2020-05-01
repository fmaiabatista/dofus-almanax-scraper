const axios = require("axios");
const cheerio = require("cheerio");
const handleErrors = require("./handleErrors");
const c = require("./constants");

// Set request retry conditions
c.AXIOS_RETRY(axios);

module.exports = async (date, linkPTBR, nameENUS) => {
  console.log(`🇧🇷 Grabbing Portuguese name for ${date}: ${nameENUS}`);

  if (linkPTBR.includes("dofus.com")) {
    try {
      const res = await axios.get(linkPTBR);
      const html = res.data;
      const $ = cheerio.load(html);

      return $(".ak-return-link")
        .text()
        .trim();
    } catch (err) {
      handleErrors(err, "PT-BR name");
    }
  }

  // If the item cannot be found in the Encyclopedia,
  // its link will be from elsewhere (wikia) and
  // it becomes difficult to get its translation,
  // so we'll just leave an asterisk next to the original name
  return nameENUS + "*";
};
