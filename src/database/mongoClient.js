const { MongoClient } = require("mongodb");
const { MONGO_URI } = require("../config");

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  monitorCommands: true,
});

client.on("connectionReady", () => console.info("MongoDB connection: ready"));
client.on("connectionClosed", () => console.info("MongoDB connection: closed"));

module.exports = client;
