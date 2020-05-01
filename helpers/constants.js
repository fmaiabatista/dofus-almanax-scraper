const axiosRetry = require("axios-retry");

const FILEPATH = "./assets/almanax.json";
const ENUS = "en-us";
const PTBR = "pt-br";

const AXIOS_RETRY = axios => {
  axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });
};

module.exports = {
  FILEPATH,
  ENUS,
  PTBR,
  AXIOS_RETRY
};
