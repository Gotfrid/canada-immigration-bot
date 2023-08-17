/**
 * This function is supposed to run on AWS Lambda.
 */

const { fetchDataAndUpdate } = require("./src/aws/fetchDataAndUpdate");

if (process.env.MODE === "stage") {
  fetchDataAndUpdate()
    .then((response) => {
      console.log(response);
      process.exit(0);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}

exports.handler = async (event) => {
  const mongoUri =
    event.mode === "stage" ? process.env.STAGE_MONGO_URI : process.env.PROD_MONGO_URI;
  const response = await fetchDataAndUpdate(mongoUri);
  console.log(response);
  return response;
};
