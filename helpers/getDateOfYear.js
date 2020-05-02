const eachDayOfInterval = require("date-fns/eachDayOfInterval");
const format = require("date-fns/format");
const c = require("./constants");

const start = c.CURRENT_YEAR_START;
const end = c.CURRENT_YEAR_END;

// Calendar array
const yearArr = eachDayOfInterval({ start, end }).map(date =>
  format(date, "yyyy-MM-dd")
);

// Given an index, return a date in format "2020-01-25"
module.exports = i => {
  return yearArr[i];
};

// TODO - this could be improved to check if the index is within the calendar range
