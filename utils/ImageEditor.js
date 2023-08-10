const https = require("https");

async function convertToWebP(blob, mimeType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      content: blob,
      mimeType: mimeType,
    });

    const options = {
      hostname: process.env.HOSTNAME,
      port: process.env.PORT,
      path: process.env.PATH,
      method: process.env.METHOD,
      headers: {
        "Content-Type": "application/json"
      },
    };

    console.log("Converting image ...");
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        // Handle the API response here
        let parsedObject = data;
        if (parsedObject === undefined || parsedObject.indexOf('error') > 0) {
          const response = JSON.parse(parsedObject);
          console.log("...Error converting image: ", response?.error?.message);
          reject(response?.error?.message);
        } else {
          console.log("...Done");
          resolve(parsedObject);
        }
      });
    });

    req.on("error", (error) => {
      // Handle any errors that occur during the API call
      console.error("Error calling API:", error.message);
      reject(error); // Reject the Promise with the error
    });
    req.write(postData);
    req.end();
  });
}

module.exports = {
  convertToWebP,
};
