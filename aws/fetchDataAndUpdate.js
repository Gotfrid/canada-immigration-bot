/**
 * This function is supposed to be run on AWS Lambda
 * with a fixed interval (5 mins).
 * AWS configuration is done manually in the web interface.
 */

const mongoose = require("mongoose");
const { fetchAllData, fetchExistingData, insertData } = require("./functions");

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
  console.info("Successfully connected to MongoDB", MONGO_URI)
);

/**
 * Wrapper function to perform all fetching and updating.
 * NB: `await` keywords are actually necessary here :)
 * @returns { Object } - response object that will display in AWS log
 */
const fetchDataAndUpdate = async () => {
  // This message will be sent to the admin of bot via telegram
  let logMessage = "";

  const allRounds = await fetchAllData();
  logMessage += `\nDownloaded a total of ${allRounds.length} entries.`;

  const existingRounds = await fetchExistingData();
  logMessage += `\nFetched ${existingRounds.length} entries from the DB.`;

  const newRounds = allRounds.filter(
    (e) => !existingRounds.includes(e.drawNumber)
  );
  logMessage += `\nWriting ${newRounds.length} new entries to the DB.`;

  if (newRounds.length === 0) {
    return logMessage;
  }

  const insertResult = insertData(newRounds);
  logMessage +=
    insertResult > 0
      ? `\nTried to write data, but had the following error:\n${error}`
      : "\nNew data is saved successfully.";

  // TODO: async works not correctly: message is returned before data is acrtually written
  return { status: 200, body: logMessage };
};

exports.fetchDataAndUpdate = fetchDataAndUpdate;
