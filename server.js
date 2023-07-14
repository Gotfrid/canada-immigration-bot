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
  distributionHandler,
  changeHandler,
  aboutHandler,
} = require("./src/publicHandlers");
const { debugHandler, statsHandler } = require("./src/adminHandlers");

logger(console, {
  format: ":date(yyyy-mm-dd HH:MM:ss) :label",
});

// read env variables
dotenv.config({ path: `${__dirname}/config/.env` });

const BOT_TOKEN =
  process.env.MODE === "stage"
    ? process.env.STAGE_BOT_TOKEN
    : process.env.PROD_BOT_TOKEN;

const ADMINS = JSON.parse(process.env.ADMIN_CHAT_IDS);
const GROUPS = JSON.parse(process.env.GROUP_CHAT_IDS);

const MONGO_URI =
  process.env.MODE === "stage"
    ? process.env.STAGE_MONGO_URI
    : process.env.PROD_MONGO_URI;

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
bot.onText(/^\/distribution$/, (msg) => distributionHandler(bot, msg));
bot.onText(/^\/about$/, (msg) => aboutHandler(bot, msg));

// Admin commands
bot.onText(/^\/test$/, (msg) => testHandler(bot, msg));
bot.onText(/^\/debug$/, (msg) => debugHandler(bot, msg, ADMINS, MONGO_URI));
bot.onText(/^\/stats$/, (msg) => statsHandler(bot, msg, ADMINS));

// Watch for data changes - but only in prod or stage
if (process.env.MODE !== "test") {
  const roundEventEmitter = Round.watch();
  roundEventEmitter.on("change", async (change) =>
    changeHandler(bot, change, GROUPS)
  );
}
