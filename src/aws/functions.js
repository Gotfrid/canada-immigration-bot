const { Db } = require("mongodb");
const { DATA_URL } = require("../config");

const { extractRoundData, extractDistributionData } = require("./helpers");

/**
 *
 * @returns {Promise<{roundData: RoundClean[], distData: DistributionClean[]}>}
 */
const fetchLatestDrawData = async () => {
  const { default: fetch } = await import("node-fetch");

  const rawData = await fetch(DATA_URL);
  const rawJson = /** @type {RoundResponse} */ (await rawData.json());

  const roundData = rawJson.rounds.map(extractRoundData);
  const distData = rawJson.rounds.map(extractDistributionData);

  return { roundData, distData };
};

/**
 *
 * @param {Db} db
 * @param {string} collection
 * @returns {Promise<string[]>}
 */
const findData = async (db, collection) => {
  const cursor = db.collection(collection).find().project({ _id: 0, drawNumber: 1 });

  const result = [];

  for await (const doc of cursor) {
    result.push(doc.drawNumber);
  }

  return result;
};

/**
 *
 * @param {Db} db
 * @param {string} collection
 * @param {RoundClean[]} data
 * @returns {Promise<string>}
 */
const insertData = async (db, collection, data) => {
  if (data.length === 0) return "Skip";

  try {
    await db.collection(collection).insertMany(data);
    return "Success";
  } catch (e) {
    return "Fail";
  }
};

module.exports = {
  fetchLatestDrawData,
  findData,
  insertData,
};
