const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

dotenv.config();

const BOT_TOKEN =
  process.env.MODE === "stage" ? process.env.STAGE_BOT_TOKEN : process.env.PROD_BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

module.exports = bot;
