const fs = require("fs");
const path = require("path");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../private_key.pem"),
  "utf8"
);

function generateSignedUrl(s3Key) {
  const url = `${process.env.CLOUDFRONT_URL}/${s3Key}`;

  return getSignedUrl({
    url,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 15),
  });
}

module.exports = { generateSignedUrl };