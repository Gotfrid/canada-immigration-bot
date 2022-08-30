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

fetchAllData().then((data) => {
  console.log("Fetched the data: ", data.length);
  Round.insertMany(data, (error, docs) => {
    if (error) {
      error.insertedDocs = "REDACTED";
      console.error(
        "Tried to write data, but had the following error:\n",
        error
      );
      process.exit(1);
    } else {
      console.log(`Successfully wrote ${data.length} documents.`);
      process.exit(0);
    }
  });
});
