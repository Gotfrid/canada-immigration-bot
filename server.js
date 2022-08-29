// import packages
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

// read env variables
dotenv.config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

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

bot.onText(/^\/last$/, (msg) => {
  bot.sendMessage(msg.chat.id, "/last placeholder");
});

bot.onText(/^\/last50$/, (msg) => {
  bot.sendMessage(msg.chat.id, "/last50 placeholder");
});
