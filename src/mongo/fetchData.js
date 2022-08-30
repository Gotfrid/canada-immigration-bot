const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

const { Round } = require("./schema.js");

// Load env variables
dotenv.config();

const MONGO_URI =
  process.env.MODE === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.PROD_MONGO_URI;

// Connect to MongoDB
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log(`Successfully connected to ${process.env.MODE} MongoDB`)
);

// Download ALL express entry data
const fetchAllData = async () => {
  const rawData = await fetch(
    "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json",
    { method: "GET" }
  );
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
  console.log("Downloaded a total of", allRounds.length, "entries.");

  const existingRounds = await fetchExistingData();
  console.log("Fetched", existingRounds.length, "entries from the DB.");

  const newRounds = allRounds.filter(
    (e) => !existingRounds.includes(e.drawNumber)
  );
  console.log("Writing", newRounds.length, "new entries to the DB");

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
      console.log("New data is saved successfully.");
      mongoose.disconnect();
      process.exit(0);
    }
  });
};

main();
