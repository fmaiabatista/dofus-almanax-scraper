const fs = require("fs"); // Filestream library

// DATA

const almanaxLinkEng = require("./Assets/3-almanax-link-eng.json");
const translate = require("./Assets/dictionary.json");

// PROGRAM

const almanaxLinkBr = { data: [] };

almanaxLinkEng.data.forEach((entry, index) => {
  almanaxLinkBr.data.push(entry);
  const engLink = entry.item.link.eng;
  let brLink = "";
  if (engLink.includes("dofus.com")) {
    const regex = /.*dia\/(.*)\/.*/g;
    const engItemType = regex.exec(engLink)[1];
    brLink = `${entry.item.link.eng
      .replace("en", "pt")
      .replace("encyclopedia", "enciclopedia")
      .replace(engItemType, translate.itemType[engItemType])}`;
  } else {
    brLink = engLink;
  }
  almanaxLinkBr.data[index].item.link.br = brLink;
});

fs.writeFile(
  "./Assets/4-almanax-link-br.json",
  JSON.stringify(almanaxLinkBr, null, 2),
  err =>
    console.log(
      err
        ? `Error: ${err}`
        : `File successfully written! Almanax size: ${
            almanaxLinkBr.data.length
          }.`,
    ),
);
