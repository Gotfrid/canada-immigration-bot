const mongo = require("./src/database/mongoClient");
const bot = require("./src/bot/botClient");

const {
  startHandler,
  subscribeHandler,
  unsubscribeHandler,
  lastHandler,
  last50Handler,
  distributionHandler,
  changeHandler,
  aboutHandler,
  dashboardHandler,
} = require("./src/bot/publicHandlers");
const { statsHandler, testHandler } = require("./src/bot/adminHandlers");
const { setupMongoCleanup } = require("./src/utils");

mongo.connect();
setupMongoCleanup(mongo);

// Public commands
bot.onText(/\/start/, startHandler);
bot.onText(/^\/subscribe$/, subscribeHandler);
bot.onText(/^\/unsubscribe$/, unsubscribeHandler);
bot.onText(/^\/last$/, lastHandler);
bot.onText(/^\/last50$/, last50Handler);
bot.onText(/^\/distribution$/, distributionHandler);
bot.onText(/^\/about$/, aboutHandler);
bot.onText(/^\/dashboard$/, dashboardHandler);

// Admin commands
bot.onText(/^\/test$/, testHandler);
bot.onText(/^\/stats$/, statsHandler);

// Watch for data changes - but only in prod or stage
mongo
  .db(process.env.MONGO_DB ?? "test")
  .collection("rounds")
  .watch()
  .on("change", changeHandler);
