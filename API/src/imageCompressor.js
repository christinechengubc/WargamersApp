var imageCompressor = {};
var jwt = require('jsonwebtoken');
var path = require('path');
var sharp = require('sharp');
var fs = require('fs');
var https = require('https');
var http = require('http');
var secret;
try {
  secret = require('./secret');
} catch (err) {
  secret = process.env.SECRET_KEY;
}
try {
  key = './src/routes/WargamersApp.json'
} catch (err) {
  key = process.env.GOOGLE_APPLICATION_CREDENTIALS
}
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  keyFilename: key
});
const wargamersApp = storage.bucket('wargamers-app');
const options = {
  entity: 'allUsers',
  role: storage.acl.READER_ROLE
};
// Make all images uploaded to Google Cloud public by default.
wargamersApp.acl.default.add(options, function(err, aclObject) {});

// Returns a promise with the new URL of the compressed image
imageCompressor.compress = async function(url) {
  // To-do:
  // Handle uploading local files from phone
  let filename = path.parse(url).base;
  if (filename.substr(0, 13) === "WGAppCompress") {
    return url; // already compressed, don't do anything
  }

  filename = filename.replace(/%20/g, ""); // handle cases where spaces are encoded as %20 in URLs
  filename = "WGAppCompress-" + filename;
  filename = filename.replace(/(\r\n|\n|\r)/gm,"");
  let remotePath = 'https://storage.googleapis.com/wargamers-app/';

  let resize = new Promise((resolve, reject) => {
    let protocol = url.substring(0, url.search(":"));
    if (protocol === "http") {
      protocol = http;
    } else if (protocol === "https") {
      protocol = https;
    } else {
      reject("Unsupported protocol.");
    }

    protocol.get(url, response => {
      const resizer = sharp();
        resizer
          .resize(500, 500)
          .max()
          .toFile(filename)
          .then(() => {
            wargamersApp
              .upload(filename, {
                gzip: true,
                metadata: {
                  cacheControl: 'public, max-age=31536000',
                }
              })
              .then(() => {
                fs.unlink(filename, (err) => {
                  if (err) console.error('ERROR: ', err);
                });
                remotePath = remotePath + filename;
                resolve(remotePath);
              })
              .catch((err) => {
                fs.unlink(filename, (err) => {
                  if (err) console.error('ERROR: ', err);
                });
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });

      response.pipe(resizer);
      });
    });

  return resize;
};

// Returns a promise to delete a compressed image from Google Cloud.
imageCompressor.deleteCompressed = function(url) {
  let filename = path.parse(url).base;
  let remove = new Promise((resolve, reject) => {
    if (filename.substr(0, 13) !== "WGAppCompress") {
      resolve(); // not uploaded on Google Cloud so do nothing
    }
    wargamersApp
      .file(filename)
      .delete()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
  });
};

module.exports = imageCompressor;
