const axiosRetry = require("axios-retry");
const startOfYear = require("date-fns/startOfYear");
const endOfYear = require("date-fns/endOfYear");

const FILEPATH = `${__dirname}/../output/almanax.json`;
const LOGPATH = `${__dirname}/../output/log.txt`;
const IMGPATH = `${__dirname}/../output/img/`;
const B64PATH = `${__dirname}/../output/almanaxB64.json`;
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
  IMGPATH,
  B64PATH,
  ENUS,
  PTBR,
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
  AXIOS_RETRY
};
