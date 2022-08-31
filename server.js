const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("console-stamp");
const TelegramBot = require("node-telegram-bot-api");
const { Round, Subscriber, User } = require("./mongo/schema");

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

const welcomeMessage = (userName) => {
  return (
    `🇨🇦 <strong>Welcome, ${userName}!</strong>` +
    "\n\n" +
    "This is a bot that can help you find necessary info about the immigration to Canada from the official website: canada.ca" +
    "\n\n" +
    "Check the commands in the menu to use the bot. " +
    "Type /subscribe to get notifications of upcoming rounds of invitations." +
    "\n\n" +
    "We wish you a fast and successful immigration process! 🍁"
  );
};

const lastRoundMessage = (round, includeTitle = false) => {
  return (
    `${includeTitle ? "🎉 <strong>New round</strong>\n" : ""}` +
    `Date of round: ${round.drawDateTime}\n` +
    `CRS score: <strong>${round.drawCRS}</strong>\n` +
    `Invitations: ${round.drawSizeStr}`
  );
};

const last50Message = (document) => {
  return document
    .sort((a, b) => (a.drawDate > b.drawDate ? 1 : -1))
    .reduce((prev, next) => {
      let program;
      switch (next.drawName) {
        case "No Program Specified":
          program = ".";
          break;
        case "Provincial Nominee Program":
          program = " (PNP).";
          break;
        case "Canadian Experience Class":
          program = " (CEC).";
          break;
        default:
          program = ` (${next.drawName}).`;
      }
      return (
        prev +
        `${next.drawNumber}. ${next.drawDateFull} - ${next.drawCRS}${program}\n`
      );
    }, "");
};

bot.onText(/\/start/, async (msg) => {
  // It makes sense to reset user in the DB when they `start`
  await User.findOneAndRemove({ chatID: msg.chat.id });
  await Subscriber.findOneAndRemove({ chatID: msg.chat.id });

  const newUser = new User({
    chatID: msg.chat.id,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    startedAt: new Date(msg.date * 1000),
  });
  await newUser.save();

  bot.sendMessage(msg.chat.id, welcomeMessage(msg.from.first_name), {
    parse_mode: "HTML",
  });
});

bot.onText(/^\/test$/, (msg) => {
  console.info("Received `test` command from", msg.chat.id);
  bot.sendMessage(msg.chat.id, "bot is working");
});

bot.onText(/^\/subscribe$/, async (msg) => {
  console.info("Received `subscribe` command from", msg.chat.id);
  const subscriber = await Subscriber.findOne({ chatID: msg.chat.id });
  if (subscriber === null) {
    const newSubscriber = new Subscriber({
      chatID: msg.chat.id,
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      subscribedAt: new Date(msg.date * 1000),
    });
    await newSubscriber.save();
    bot.sendMessage(
      msg.chat.id,
      "You are now subscribed!\nIf you want to stop receiving notifications, you can /unsubscribe."
    );
  } else {
    bot.sendMessage(
      msg.chat.id,
      "You are already subscribed!\nIf you want, you can /unsubscribe."
    );
  }
});

bot.onText(/^\/unsubscribe$/, async (msg) => {
  console.info("Received `unsubscribe` command from", msg.chat.id);
  const subscriber = await Subscriber.findOne({ chatId: msg.chat.id });
  if (subscriber === null) {
    bot.sendMessage(
      msg.chat.id,
      "You are not subscribed!\nIf you want to receive notifications, you can /subscribe."
    );
  } else {
    await Subscriber.findOneAndRemove({ chatID: msg.chat.id });
    bot.sendMessage(
      msg.chat.id,
      "You have unsubscribed.\nIf you want to receive notifications again, you can /subscribe."
    );
  }
});

bot.onText(/^\/last$/, async (msg) => {
  console.info("Received `last` command from", msg.chat.id);
  const crsDocument = await Round.find().sort({ drawDate: -1 }).limit(1).exec();
  const message = lastRoundMessage(crsDocument[0]);
  bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});

bot.onText(/^\/last50$/, async (msg) => {
  console.info("Received `last50` command from", msg.chat.id);
  const crsDocument = await Round.find()
    .sort({ drawDate: -1 })
    .limit(50)
    .exec();
  const message = last50Message(crsDocument);
  bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});

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
        await bot.sendMessage(subscriber.chatID, message, { parse_mode: "HTML" });
        console.info("Message has been sent.")
      } catch (error) {
        console.error("Message could not be sent.")
      }
    });
  });
}
