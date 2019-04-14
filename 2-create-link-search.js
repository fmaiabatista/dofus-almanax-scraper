const fs = require("fs"); // Filestream library

// DATA

const almanaxBasic = require("./Assets/1-almanax-basic.json");

// PROGRAM

const almanaxLinkSearch = { data: [] };

almanaxBasic.data.forEach((entry, index) => {
  almanaxLinkSearch.data.push(entry);
  almanaxLinkSearch.data[index].item.link = { search: "" };
  const searchLink = `https://www.dofus.com/en/search?q=${entry.item.name.eng
    .replace(/\s/g, "+")
    .replace("'", "%27")}`;
  almanaxLinkSearch.data[index].item.link.search = searchLink;
});

fs.writeFile(
  "./Assets/2-almanax-link-search.json",
  JSON.stringify(almanaxLinkSearch, null, 2),
  err =>
    console.log(
      err
        ? `Error: ${err}`
        : `File successfully written! Almanax size: ${
            almanaxLinkSearch.data.length
          }.`,
    ),
);
