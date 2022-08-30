const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const AsciiTable = require("ascii-table");
const { Round } = require("./src/mongo/schema");

// read env variables
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const TEST_MODE = process.env.TEST_MODE || false;
const MONGO_URI = TEST_MODE
  ? process.env.TEST_MONGO_URI
  : process.env.PROD_MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, welcomeMessage(msg.from.first_name), {
    parse_mode: "HTML",
  });
});

bot.onText(/^\/subscribe$/, (msg) => {
  bot.sendMessage(msg.chat.id, "/subscribe placeholder", {
    parse_mode: "HTML",
  });
});

bot.onText(/^\/unsubscribe$/, (msg) => {
  bot.sendMessage(msg.chat.id, "/unsubscribe placeholder", {
    parse_mode: "HTML",
  });
});

bot.onText(/^\/last$/, async (msg) => {
  const crsDocument = await Round.find().sort({ drawDate: -1 }).limit(1).exec();
  const crsValue = crsDocument[0].drawCRS;
  const message = `<strong>Last CRS score:</strong>\n${crsValue}`;
  bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});

bot.onText(/^\/last50$/, async (msg) => {
  const crsDocument = await Round.find()
    .sort({ drawDate: -1 })
    .limit(50)
    .exec();
  const table = new AsciiTable()
    .setHeading("Date", "CRS")
    .addRowMatrix(crsDocument.map((doc) => [doc.drawDate, doc.drawCRS]));
  const message = `<strong>Last 50 CRS scores:</strong>\n<pre>${table.toString()}</pre>`;
  bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});
