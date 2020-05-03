const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const handleErrors = require("./handleErrors");
const c = require("./constants");

module.exports = async almanax => {
  console.log("👨‍🎨 Start getting images...");

  // Set request retry conditions
  c.AXIOS_RETRY(axios);

  let almanaxB64;
  try {
    almanaxB64 = [...require(c.B64PATH).almanaxB64];
  } catch (_) {
    almanaxB64 = Array.from(new Array(almanax.length));
  }

  for (const [i, entry] of almanax.entries()) {
    try {
      const {
        date,
        item: {
          link: { img: imgURL },
          name: { [c.ENUS]: name }
        }
      } = entry;

      console.log(`\n🖼 Grabbing image for ${date}: ${name}`);

      const imgPath = `${c.IMGPATH}${date}_${name}.png`; // 2020-01-01_Clay Dreggon Egg.png
      const existsB64Entry = almanaxB64[i] && almanaxB64[i][date];
      const existsImageFile = fs.existsSync(imgPath);

      if (existsB64Entry && existsImageFile) {
        console.log(`🤙 B64 and Image for ${date} already exists. Skipping.`);
      }

      if (!existsB64Entry || !existsImageFile) {
        const res = await axios.get(imgURL, {
          responseType: "arraybuffer"
        });

        // Save B64 code in array
        if (existsB64Entry) {
          console.log(`🤙 B64 for ${date} already exists. Skipping.`);
        } else {
          const b64 = Buffer.from(res.data, "binary").toString("base64");
          almanaxB64[i] = { [date]: b64 };
        }

        // Create PNG file for image
        if (existsImageFile) {
          console.log(`🤙 Image for ${date} already exists. Skipping.`);
        } else {
          console.log("🎨 Writing image file...");
          fs.writeFileSync(imgPath, Buffer.from(res.data, "base64"));
          console.log(`✅ Image file is ready at "${imgPath}"`);
        }
      }
    } catch (err) {
      handleErrors(err, "getImages");
    }
  }

  // Check if file exists
  if (fs.existsSync(c.B64PATH)) {
    const prevAlmanaxB64 = require(c.B64PATH).almanaxB64;

    // Check if content did not change
    if (JSON.stringify(prevAlmanaxB64) === JSON.stringify(almanaxB64)) {
      console.log("\n📁 B64 file content did not change. Skipping.");
      console.log(`✅ B64 file is ready, unchanged at "${c.B64PATH}"`);
      return;
    }
  }

  // Write B64 JSON to file
  console.log("\n📁 Writing B64 file...");
  fs.writeFileSync(c.B64PATH, JSON.stringify({ almanaxB64 }, null, 2));
  console.log(`✅ B64 file is ready at "${c.B64PATH}"`);
};
