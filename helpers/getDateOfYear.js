const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const startOfYear = require("date-fns/startOfYear");
const endOfYear = require("date-fns/endOfYear");

// Calendar array
const yearArr = eachDayOfInterval({
  start: startOfYear(new Date()),
  end: endOfYear(new Date())
}).map(date => date.toISOString().split("T")[0]);

module.exports = i => {
  return yearArr[i];
};
