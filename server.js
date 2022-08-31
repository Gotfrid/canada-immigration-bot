const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("console-stamp");
const TelegramBot = require("node-telegram-bot-api");
const { Round, Subscriber, User } = require("./mongo/schema");
const {
  startHandler,
  testHandler,
  subscribeHandler,
  unsubscribeHandler,
  lastHandler,
  last50Handler,
} = require("./src/handlers");

logger(console, {
  format: ":date(yyyy-mm-dd HH:MM:ss) :label",
});

// read env variables
dotenv.config({ path: `${__dirname}/config/.env` });

const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI =
  process.env.MODE === "test"
    ? process.env.TEST_MONGO_URI
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

bot.onText(/\/start/, async (msg) => await startHandler(bot, msg));

bot.onText(/^\/test$/, (msg) => testHandler(bot, msg));

bot.onText(/^\/subscribe$/, async (msg) => subscribeHandler(bot, msg));

bot.onText(/^\/unsubscribe$/, async (msg) => unsubscribeHandler(bot, msg));

bot.onText(/^\/last$/, async (msg) => lastHandler(bot, msg));

bot.onText(/^\/last50$/, async (msg) => last50Handler(bot, msg));

// Watch for data changes - only in prod environment
if (process.env.MODE === "production") {
  const roundEventEmitter = Round.watch();
  roundEventEmitter.on("change", async (change) => {
    if (change.operationType !== "insert") return;
    const message = lastRoundMessage(change.fullDocument, true);
    const subscribers = await Subscriber.find().select("chatID");
    subscribers.forEach(async (subscriber) => {
      console.info("Sending notification to", subscriber.chatID);
      // Possible failures: user has stopped the bot
      // but the DB still conains their chatID
      try {
        await bot.sendMessage(subscriber.chatID, message, {
          parse_mode: "HTML",
        });
        console.info("Message has been sent.");
      } catch (error) {
        console.error("Message could not be sent.");
      }
    });
  });
}
