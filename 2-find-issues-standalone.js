const findIssues = require("./helpers/findIssues");
const almanax = require("./output/almanax.json").almanax;

console.clear();
findIssues(almanax);
