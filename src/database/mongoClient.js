const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI =
  process.env.MODE === "stage" ? process.env.STAGE_MONGO_URI : process.env.PROD_MONGO_URI;

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  monitorCommands: true,
});

client.on("connectionReady", () => console.info("MongoDB connection: ready"));
client.on("connectionClosed", () => console.info("MongoDB connection: closed"));

// client
//   .db("test")
//   .collection("rounds")
//   .watch()
//   .on("change", (change) => {
//     console.log(change);
//   });

module.exports = client;
