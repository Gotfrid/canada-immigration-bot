/**
 * This function is supposed to be run on AWS Lambda
 * with a fixed interval (5 mins).
 * AWS configuration is done manually in the web interface.
 */

const mongoose = require("mongoose");
const {
  fetchAllData,
  fetchExistingData,
  insertData,
  generateLogMessage,
} = require("./functions");
const { Round, Distribution } = require(`${__dirname}/./../mongo/schema`);

// Load env variables when testing locally. On AWS env vars are defined separately.
let MONGO_URI = "";
if (process.env.MODE === "stage") {
  require("dotenv").config({ path: `${__dirname}/./../config/.env` });
  MONGO_URI = process.env.STAGE_MONGO_URI;
} else {
  MONGO_URI = process.env.PROD_MONGO_URI;
}

const mongo_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_URI, mongo_options, () =>
  console.info("Successfully connected to MongoDB")
);

/**
 * Wrapper function to perform all fetching and updating.
 * NB: `await` keywords are actually necessary here :)
 * @returns { Object } - response object that will display in AWS log
 */
const fetchDataAndUpdate = async () => {
  const [allRounds, allDistributions] = await fetchAllData();
  const existingRounds = await fetchExistingData(Round);
  const existingDistributions = await fetchExistingData(Distribution);
  const newRounds = allRounds.filter(
    (e) => !existingRounds.includes(e.drawNumber)
  );
  const newDistributions = allDistributions.filter(
    (e) => !existingDistributions.includes(e.drawNumber)
  );
  const insertRoundResult = await insertData(Round, newRounds);
  const insertDistrResult = await insertData(Distribution, newDistributions);

  const logMessage = await generateLogMessage(
    allRounds,
    existingRounds,
    existingDistributions,
    insertRoundResult,
    insertDistrResult
  );

  return await { status: 200, body: logMessage };
};

exports.fetchDataAndUpdate = fetchDataAndUpdate;
