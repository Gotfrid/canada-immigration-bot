// import packages
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

// read env variables
dotenv.config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const welcomeMessage = (userName) => {
  return (
    `🇨🇦 <strong>Welcome, ${userName}!</strong>` +
    "\n\n" +
    "This is a telegram bot to track Canadian Immigration Scores." +
    "\n\n" +
    "Click <strong>Subscribe to updates</strong> so that the bot can send you latest updates as soon as they are available." +
    "\n\n" +
    "We wish your immigration to succeed soon! 🍁"
  );
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, welcomeMessage(msg.from.first_name), {
    parse_mode: "HTML",
  });
});
