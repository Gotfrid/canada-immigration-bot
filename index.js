/**
 * This function is supposed to run on AWS Lambda.
 */

const { fetchDataAndUpdate } = require("./aws/fetchDataAndUpdate");

if (process.env.MODE === "stage") {
  require("dotenv").config({ path: `${__dirname}/config/.env` });
  (async () => {
    const response = await fetchDataAndUpdate();
    console.log(response);
    process.exit(0);
  })();
}

exports.handler = async (event) => {
  const response = await fetchDataAndUpdate();
  console.log(response);
  return await response;
};
