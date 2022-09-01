const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("console-stamp");
const TelegramBot = require("node-telegram-bot-api");
const { Round } = require("./mongo/schema");
const {
  startHandler,
  testHandler,
  subscribeHandler,
  unsubscribeHandler,
  lastHandler,
  last50Handler,
  changeHandler,
} = require("./src/handlers");
const { debugHandler, statsHandler } = require("./src/adminHandlers");

logger(console, {
  format: ":date(yyyy-mm-dd HH:MM:ss) :label",
});

// read env variables
dotenv.config({ path: `${__dirname}/config/.env` });

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMINS = JSON.parse(process.env.ADMIN_CHAT_IDS);

let MONGO_URI = "";
switch (process.env.MODE) {
  case "test":
    MONGO_URI = process.env.TEST_MONGO_URI;
    break;
  case "stage":
    MONGO_URI = process.env.STAGE_MONGO_URI;
    break;
  default:
    MONGO_URI = process.env.PROD_MONGO_URI;
}

// Connect to MongoDB
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.info(`Successfully connected to ${process.env.MODE} MongoDB`)
);

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Public commands
bot.onText(/\/start/, (msg) => startHandler(bot, msg));
bot.onText(/^\/subscribe$/, (msg) => subscribeHandler(bot, msg));
bot.onText(/^\/unsubscribe$/, (msg) => unsubscribeHandler(bot, msg));
bot.onText(/^\/last$/, (msg) => lastHandler(bot, msg));
bot.onText(/^\/last50$/, (msg) => last50Handler(bot, msg));

// Admin commands
bot.onText(/^\/test$/, (msg) => testHandler(bot, msg));
bot.onText(/^\/debug$/, (msg) => debugHandler(bot, msg, ADMINS, MONGO_URI));
bot.onText(/^\/stats$/, (msg) => statsHandler(bot, msg, ADMINS));

// Watch for data changes - but only in prod or stage
if (process.env.MODE !== "test") {
  const roundEventEmitter = Round.watch();
  roundEventEmitter.on("change", async (change) => changeHandler(bot, change));
}
