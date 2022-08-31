/**
 * This function is supposed to be run on AWS Lambda
 * with a fixed interval (5 mins).
 * AWS configuration is done manually in the web interface.
 */

const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { Round } = require("../mongo/schema.js");

// Load env variables when testing locally. On AWS env vars are defined separately.
if (process.env.MODE === "test") {
  require("dotenv").config({ path: `${__dirname}/./../config/.env` });
}

const mongo_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.PROD_MONGO_URI, mongo_options, () =>
  console.info(`Successfully connected to MongoDB`)
);

// Download ALL express entry data
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

const fetchExistingData = async () => {
  return (await Round.find().select({ drawNumber: 1, _id: 0 })).map(
    (e) => e.drawNumber
  );
};

const main = async () => {
  const allRounds = await fetchAllData();
  console.info("Downloaded a total of", allRounds.length, "entries.");

  const existingRounds = await fetchExistingData();
  console.info("Fetched", existingRounds.length, "entries from the DB.");

  const newRounds = allRounds.filter(
    (e) => !existingRounds.includes(e.drawNumber)
  );
  console.info("Writing", newRounds.length, "new entries to the DB");

  if (newRounds.length === 0) {
    mongoose.disconnect();
    process.exit(0);
  }

  Round.insertMany(newRounds, (error) => {
    if (error) {
      error.insertedDocs = "REDACTED";
      console.error(
        "Tried to write data, but had the following error:\n",
        error
      );
      mongoose.disconnect();
      process.exit(1);
    } else {
      console.info("New data is saved successfully.");
      mongoose.disconnect();
      process.exit(0);
    }
  });
};

exports.fetchData = main;
