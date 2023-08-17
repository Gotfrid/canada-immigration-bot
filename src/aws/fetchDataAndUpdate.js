/**
 * This function is supposed to be run on AWS Lambda
 * with a fixed interval (5 mins).
 * AWS configuration is done manually in the web interface.
 */

const { MONGO_URI, MONGO_DB } = require("../config");
const { clientFactory } = require("../database/mongoClient");
const { fetchLatestDrawData, findData, insertData } = require("./functions");
const { filterNewData, generateLogMessage } = require("./helpers");

const fetchDataAndUpdate = async (mongoUri = MONGO_URI) => {
  const mongoClient = clientFactory(mongoUri);
  const db = mongoClient.db(MONGO_DB);

  const fetchingPromises = [
    fetchLatestDrawData(),
    findData(db, "rounds"),
    findData(db, "distributions"),
  ];

  const [latestData, existingRounds, existingDistributions] = (
    await Promise.allSettled(fetchingPromises)
  ).map((result) => result.value);

  const newRounds = filterNewData(latestData.roundData, existingRounds);
  const newDistributions = filterNewData(latestData.distData, existingDistributions);

  const insertingPromises = [
    insertData(db, "rounds", newRounds),
    insertData(db, "distributions", newDistributions),
  ];

  const [insertRoundResult, insertDistrResult] = (await Promise.allSettled(insertingPromises)).map(
    (result) => result.value,
  );

  await mongoClient.close();

  const logMessage = generateLogMessage(
    latestData.roundData,
    existingRounds,
    existingDistributions,
    insertRoundResult,
    insertDistrResult,
  );

  return { status: 200, body: logMessage };
};

exports.fetchDataAndUpdate = fetchDataAndUpdate;
