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

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

async function resize(blob, width, height, mimeType) {
  return new Promise((resolve, reject) => {
    const base64data = bufferToBase64(blob);

    const postData = JSON.stringify({
      blob: base64data,
      width: width,
      height: height,
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

    console.log("Resizing image ...");
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
    
          // Check if the response indicates success
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Process successful response
            console.log("...Done");
            resolve(response.data.blob); // Resolve with the entire response or a specific part of it
          } else {
            // Handle API errors
            console.log("...Error converting image: ", response?.error?.message);
            reject(response?.error?.message);
          }
        } catch (error) {
          // Handle JSON parsing errors
          console.error("Error parsing response:", error);
          reject("Error parsing response");
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

async function rembg(blob, mimeType) {
  return new Promise((resolve, reject) => {
    const base64data = bufferToBase64(blob);

    const postData = JSON.stringify({
      blob: base64data,
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

    console.log("Upscaling image ...");
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
    
          // Check if the response indicates success
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Process successful response
            console.log("...Done");
            resolve(response.data.blob); // Resolve with the entire response or a specific part of it
          } else {
            // Handle API errors
            console.log("...Error converting image: ", response?.error?.message);
            reject(response?.error?.message);
          }
        } catch (error) {
          // Handle JSON parsing errors
          console.error("Error parsing response:", error);
          reject("Error parsing response");
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
  resize,
  rembg
};
