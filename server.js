const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

const mongo = require("./src/database/mongoClient");
const { Round } = require("./src/database/schema");
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
const { debugHandler, statsHandler } = require("./src/bot/adminHandlers");
const { setupMongoCleanup } = require("./src/utils");

// read env variables
dotenv.config();

const BOT_TOKEN =
  process.env.MODE === "stage" ? process.env.STAGE_BOT_TOKEN : process.env.PROD_BOT_TOKEN;

const ADMINS = JSON.parse(process.env.ADMIN_CHAT_IDS);
const GROUPS = JSON.parse(process.env.GROUP_CHAT_IDS);

const MONGO_URI =
  process.env.MODE === "stage" ? process.env.STAGE_MONGO_URI : process.env.PROD_MONGO_URI;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

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
bot.onText(/^\/debug$/, (msg) => debugHandler(bot, msg, ADMINS, MONGO_URI));
bot.onText(/^\/stats$/, (msg) => statsHandler(bot, msg, ADMINS));

// Watch for data changes - but only in prod or stage
if (process.env.MODE !== "test") {
  const roundEventEmitter = Round.watch();
  roundEventEmitter.on("change", async (change) => changeHandler(bot, change, GROUPS));
}
