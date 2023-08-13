const mongo = require("./src/database/mongoClient");
const bot = require("./src/bot/botClient");

const publicHandlers = require("./src/bot/publicHandlers");
const adminHandlers = require("./src/bot/adminHandlers");
const { setupMongoCleanup } = require("./src/utils");
const { MONGO_DB } = require("./src/config");

setupMongoCleanup(mongo);

// Public commands
bot.onText(/\/start/, publicHandlers.startHandler);
bot.onText(/^\/subscribe$/, publicHandlers.subscribeHandler);
bot.onText(/^\/unsubscribe$/, publicHandlers.unsubscribeHandler);
bot.onText(/^\/last$/, publicHandlers.lastHandler);
bot.onText(/^\/last50$/, publicHandlers.last50Handler);
bot.onText(/^\/distribution$/, publicHandlers.distributionHandler);
bot.onText(/^\/about$/, publicHandlers.aboutHandler);
bot.onText(/^\/dashboard$/, publicHandlers.dashboardHandler);

// Admin commands
bot.onText(/^\/test$/, adminHandlers.testHandler);
bot.onText(/^\/stats$/, adminHandlers.statsHandler);

// Watch for data changes - but only in prod or stage
mongo.db(MONGO_DB).collection("rounds").watch().on("change", publicHandlers.changeHandler);
