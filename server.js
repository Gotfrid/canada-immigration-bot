const dotenv = require("dotenv");

const mongo = require("./src/database/mongoClient");
const bot = require("./src/bot/botClient");

const {
  startHandler,
  testHandler,
  subscribeHandler,
  unsubscribeHandler,
  lastHandler,
  last50Handler,
  distributionHandler,
  changeHandler,
  aboutHandler,
  dashboardHandler,
} = require("./src/bot/publicHandlers");
const { statsHandler } = require("./src/bot/adminHandlers");
const { setupMongoCleanup } = require("./src/utils");

// read env variables
dotenv.config();

const ADMINS = JSON.parse(process.env.ADMIN_CHAT_IDS);
const GROUPS = JSON.parse(process.env.GROUP_CHAT_IDS);

mongo.connect();
setupMongoCleanup(mongo);

// Public commands
bot.onText(/\/start/, (msg) => startHandler(bot, msg));
bot.onText(/^\/subscribe$/, (msg) => subscribeHandler(bot, msg));
bot.onText(/^\/unsubscribe$/, (msg) => unsubscribeHandler(bot, msg));
bot.onText(/^\/last$/, (msg) => lastHandler(bot, msg));
bot.onText(/^\/last50$/, (msg) => last50Handler(bot, msg));
bot.onText(/^\/distribution$/, (msg) => distributionHandler(bot, msg));
bot.onText(/^\/about$/, (msg) => aboutHandler(bot, msg));
bot.onText(/^\/dashboard$/, (msg) => dashboardHandler(bot, msg));

// Admin commands
bot.onText(/^\/test$/, (msg) => testHandler(bot, msg));
bot.onText(/^\/stats$/, (msg) => statsHandler(bot, msg, ADMINS));

// Watch for data changes - but only in prod or stage
mongo
  .db(process.env.MONGO_DB ?? "test")
  .collection("rounds")
  .watch()
  .on("change", async (change) => changeHandler(bot, change, GROUPS));
