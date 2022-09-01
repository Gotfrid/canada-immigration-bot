/**
 * This function is supposed to run on AWS Lambda.
 */

const { fetchDataAndUpdate } = require("./aws/fetchDataAndUpdate");

if (process.env.MODE === "stage") {
  (async () => {
    fetchDataAndUpdate().then((response) => {
      console.log(response);
      process.exit(0);
    });
  })();
}

exports.handler = async (event) => {
  const response = await fetchDataAndUpdate();
  console.log(response);
  return await response;
};
