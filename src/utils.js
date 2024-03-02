const { DASHBOARD_URL, SCREENSHOT_PATH } = require("./config");

/**
 *
 * @param {import("mongodb").MongoClient} mongo
 */
const setupMongoCleanup = (mongo) => {
  process.on("exit", async () => {
    await mongo.close();
  });

  process.on("SIGINT", async () => {
    await mongo.close();
    process.exit();
  });

  // process.on("uncaughtException", async () => {
  //   await mongo.close();
  //   process.exit();
  // });
};

module.exports = { setupMongoCleanup };
