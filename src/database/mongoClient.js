const { MongoClient } = require("mongodb");
const { MONGO_URI } = require("../config");

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  monitorCommands: true,
});

client.on("connectionCreated", () => console.info("MongoDB connection: created"));
client.on("connectionClosed", () => console.info("MongoDB connection: closed"));

module.exports = client;
