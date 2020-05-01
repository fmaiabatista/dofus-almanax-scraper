const axios = require("axios");
const cheerio = require("cheerio");
const c = require("./constants");
const handleErrors = require("./handleErrors");

// Set request retry conditions
c.AXIOS_RETRY(axios);

// Dictionary for converting English labels into Portuguese
const translate = {
  itemType: {
    classes: "classes",
    professions: "profissoes",
    monsters: "monstros",
    weapons: "armas",
    equipment: "equipamentos",
    sets: "conjuntos",
    pets: "mascotes",
    mounts: "montarias",
    consumables: "itens-consumiveis",
    resources: "recursos",
    "ceremonial-item": "item-de-aparencia",
    sidekicks: "companheiros",
    idols: "idolos",
    "haven-bags": "sacos-de-viagem",
    harnessess: "arreios"
  }
};

// Async function to get the item link from Dofus.com
module.exports = async (date, itemName, search) => {
  console.log(`🔗 Grabbing links for ${date}: ${itemName}`);
  let enus, ptbr;

  // Get EN-US link
  try {
    const res = await axios.get(search);
    const html = res.data;
    const $ = cheerio.load(html);

    // Create regexp for the item
    let name = itemName
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/'s/g, "");

    let regexp = new RegExp(`(.*\\d+-${name})$`);

    // Look through all links and find the one that matches the item
    let suffix = Array.from($(".ak-image a"))
      .map(a => a.attribs.href)
      .find(str => regexp.test(str));

    // There are special cases where the URL strips some parts of the original name
    // Such as "Seed of Contention" -> "seed-contention" and "Vor'Om Axe" -> "om-axe"
    // Here we treat that. Also it's a separate block of code because I can't be sure
    // if it happens to all the names that contain "of". So only after our first try
    // returns undefined suffix that we try the alternatives to get a valid suffix.
    // TODO - This could be improved
    if (!suffix) {
      name = name
        .replace("of-", "")
        .replace("vor-", "")
        .replace("wo-", "");
      regexp = new RegExp(`(.*\\d+-${name})$`);
      suffix = Array.from($(".ak-image a"))
        .map(a => a.attribs.href)
        .find(str => regexp.test(str));
    }

    enus = `https://www.dofus.com${suffix}`;
  } catch (err) {
    handleErrors(err, "EN-US link");
  }

  // Get PT-BR link
  if (enus && enus.includes("dofus.com")) {
    const regex = /.*dia\/(.*)\/.*/g;
    const itemType = regex.exec(enus)[1];

    ptbr = `${enus
      .replace("en", "pt")
      .replace("encyclopedia", "enciclopedia")
      .replace(itemType, translate.itemType[itemType])}`;
  } else {
    ptbr = enus;
  }

  return [enus, ptbr];
};
