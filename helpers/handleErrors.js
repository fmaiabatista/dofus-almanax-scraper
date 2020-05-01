module.exports = (error, context = null) => {
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log("\n🚫 BAD STATUS");
    console.log(`❗️ ${error.response.status}`);
    console.log(`❗️ ${error.response.data}`);
    console.log(`❗️ ${error.response.headers}`);
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log("\n🚫 BAD REQUEST");
    console.log(`❗️ ${error.request}`);
  } else {
    // Something happened in setting up the request and triggered an Error
    // Also used for handling other errors throughout the app
    console.log(context ? `\n🚫 ERROR: ${context}` : "\n🚫 ERROR");
    console.log(`❗️ ${error}`);
  }

  console.log("\n");
};
