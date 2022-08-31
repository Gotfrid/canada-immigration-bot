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
  const data = await rawJson.rounds.map((round) => {
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
  return data;
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
