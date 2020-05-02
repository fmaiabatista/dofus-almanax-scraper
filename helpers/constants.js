const axiosRetry = require("axios-retry");
const startOfYear = require("date-fns/startOfYear");
const endOfYear = require("date-fns/endOfYear");

const FILEPATH = "./assets/almanax.json";
const LOGPATH = "./assets/log.txt";
const ENUS = "en-us";
const PTBR = "pt-br";
const CURRENT_YEAR_START = startOfYear(new Date());
const CURRENT_YEAR_END = endOfYear(new Date());

const AXIOS_RETRY = axios => {
  axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });
};

module.exports = {
  FILEPATH,
  LOGPATH,
  ENUS,
  PTBR,
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
  AXIOS_RETRY
};
