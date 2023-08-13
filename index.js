/**
 * This function is supposed to run on AWS Lambda.
 */

const { fetchDataAndUpdate } = require("./src/aws/fetchDataAndUpdate");

if (process.env.MODE === "stage") {
  require("dotenv").config({ path: `${__dirname}/.env` });
  (async () => {
    fetchDataAndUpdate(process.env.STAGE_MONGO_URI).then((response) => {
      console.log(response);
      process.exit(0);
    });
  })();
}

exports.handler = async (event) => {
  const mongo_uri =
    event.mode === "stage"
      ? process.env.STAGE_MONGO_URI
      : process.env.PROD_MONGO_URI;
  const response = await fetchDataAndUpdate(mongo_uri);
  console.log(response);
  return await response;
};
