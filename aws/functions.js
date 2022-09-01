const fetch = require("node-fetch");
const { Round } = require(`${__dirname}/./../mongo/schema`);

/**
 * Helper function to download all rounds data
 * and only return necessary data.
 * @returns { Object[] }
 */
const fetchAllData = async () => {
  const rawData = await fetch(process.env.DATA_URL, { method: "GET" });
  const rawJson = await rawData.json();
  const roundData = await rawJson.rounds.map((round) => {
    return {
      drawNumber: round.drawNumber,
      drawDate: round.drawDate,
      drawDateFull: round.drawDateFull,
      drawDateTime: round.drawDateTime,
      drawName: round.drawName,
      drawSizeStr: round.drawSize,
      drawSizeNum: Number(round.drawSize.replace(",", "")),
      drawCRS: Number(round.drawCRS),
    };
  });
  const distributionData = await rawJson.rounds.map((round) => {
    return {
      drawNumber: round.drawNumber,
      drawDistributionAsOn: round.drawDistributionAsOn,
      dd1: round.dd1,
      dd2: round.dd2,
      dd3: round.dd3,
      dd4: round.dd4,
      dd5: round.dd5,
      dd6: round.dd6,
      dd7: round.dd7,
      dd8: round.dd8,
      dd9: round.dd9,
      dd10: round.dd10,
      dd11: round.dd11,
      dd12: round.dd12,
      dd13: round.dd13,
      dd14: round.dd14,
      dd15: round.dd15,
      dd16: round.dd16,
      dd17: round.dd17,
      dd18: round.dd18,
    };
  });
  return [roundData, distributionData];
};

/**
 * Helper function to fetch all draw numbers
 * that are already present in the DB.
 * @returns { String[] }
 */
const fetchExistingData = async () => {
  return (await Round.find().select({ drawNumber: 1 })).map(
    (e) => e.drawNumber
  );
};

/**
 * Helper function to insert new data into the MongoDB
 * @param { Object[] } data
 */
const insertData = (data) => {
  Round.insertMany(data, (error) => {
    if (error) {
      error.insertedDocs = "REDACTED";
      console.error(
        "Tried to write data, but had the following error:\n",
        error
      );
      return 1;
    }
    return 0;
  });
};

module.exports = { fetchAllData, fetchExistingData, insertData };
