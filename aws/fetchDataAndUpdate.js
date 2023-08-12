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

const mongo_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Wrapper function to perform all fetching and updating.
 * NB: `await` keywords are actually necessary here :)
 * @returns { Object } - response object that will display in AWS log
 */
const fetchDataAndUpdate = async (mongo_uri) => {
  await mongoose.connect(mongo_uri, mongo_options, () =>
    console.log("Connected to MongoDB")
  );
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

  const logMessage = generateLogMessage(
    allRounds,
    existingRounds,
    existingDistributions,
    insertRoundResult,
    insertDistrResult
  );

  await mongoose.disconnect();

  return { status: 200, body: logMessage };
};

exports.fetchDataAndUpdate = fetchDataAndUpdate;
