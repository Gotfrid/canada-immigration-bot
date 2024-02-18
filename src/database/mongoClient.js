const { MongoClient } = require("mongodb");
const { MONGO_URI } = require("../config");

/**
 *
 * @param {string} uri
 * @returns {MongoClient}
 */
const clientFactory = (uri) => {
  const client = new MongoClient(uri, { monitorCommands: true });

  client.on("connectionCreated", () => console.info("MongoDB connection: created"));
  client.on("connectionClosed", () => console.info("MongoDB connection: closed"));

  return client;
};

const client = clientFactory(MONGO_URI ?? "");

module.exports = client;
exports = module.exports;
exports.clientFactory = clientFactory;
