/**
 * This function is supposed to be run on AWS Lambda
 * with a fixed interval (5 mins).
 * AWS configuration is done manually in the web interface.
 */

const mongoose = require("mongoose");
const { fetchAllData, fetchExistingData, insertData } = require("./functions");
const { Round, Distribution } = require(`${__dirname}/./../mongo/schema`);

// Load env variables when testing locally. On AWS env vars are defined separately.
let MONGO_URI = "";
if (process.env.MODE === "test") {
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
  // This message will be sent to the admin of bot via telegram
  let logMessage = "";

  const [allRounds, allDistributions] = await fetchAllData();
  logMessage += `\nDownloaded a total of ${allRounds.length} entries.`;

  const existingRounds = await fetchExistingData(Round);
  logMessage += `\nFetched ${existingRounds.length} round entries from the DB.`;

  const existingDistributions = await fetchExistingData(Distribution);
  logMessage += `\nFetched ${existingDistributions.length} distr entries from the DB.`;

  const newRounds = allRounds.filter(
    (e) => !existingRounds.includes(e.drawNumber)
  );

  const newDistributions = allDistributions.filter(
    (e) => !existingDistributions.includes(e.drawNumber)
  );

  if (newRounds.length > 0) {
    logMessage += `\nWriting ${newRounds.length} new round entries to the DB.`;
    const insertRoundResult = insertData(Round, newRounds);
    logMessage +=
      insertRoundResult > 0
        ? `\nTried to write rounds data, but had the following error:\n${error}`
        : "\nNew rounds data is saved successfully.";
  }

  if (newDistributions.length > 0) {
    logMessage += `\nWriting ${newDistributions.length} new distribution entries to the DB.`;
    const insertDistrResult = insertData(Distribution, newDistributions);
    logMessage +=
      insertDistrResult > 0
        ? `\nTried to write rounds data, but had the following error:\n${error}`
        : "\nNew rounds data is saved successfully.";
  }

  return { status: 200, body: logMessage };
};

exports.fetchDataAndUpdate = fetchDataAndUpdate;
