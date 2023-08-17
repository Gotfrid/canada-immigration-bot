const { DATA_URL, MONGO_DB } = require("../config");

const { extractRoundData, extractDistributionData } = require("./helpers");

const fetchLatestDrawData = async () => {
  const { default: fetch } = await import("node-fetch");

  const rawData = await fetch(DATA_URL);
  const rawJson = await rawData.json();

  const roundData = rawJson.rounds.map(extractRoundData);
  const distData = rawJson.rounds.map(extractDistributionData);

  return { roundData, distData };
};

const findData = async (db, collection) => {
  const cursor = db.collection(collection).find().project({ _id: 0, drawNumber: 1 });

  const result = [];

  for await (const doc of cursor) {
    result.push(doc.drawNumber);
  }

  return result;
};

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
