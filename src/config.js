const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = String(
  process.env.MODE === "stage" ? process.env.STAGE_MONGO_URI : process.env.PROD_MONGO_URI,
);

const MONGO_DB = process.env.MONGO_DB ?? "test";

const BOT_TOKEN =
  process.env.MODE === "stage" ? process.env.STAGE_BOT_TOKEN : process.env.PROD_BOT_TOKEN;

const ADMIN_CHAT_IDS = JSON.parse(process.env.ADMIN_CHAT_IDS ?? "[]");

const GROUP_CHAT_IDS = process.env.MODE ? [] : JSON.parse(process.env.GROUP_CHAT_IDS ?? "[]");

const DATA_URL = process.env.DATA_URL ?? "";

const DASHBOARD_URL = "https://canadian-express.vercel.app";
const SCREENSHOT_PATH = "canadian-express-puppeteer.png";

module.exports = {
  ADMIN_CHAT_IDS,
  BOT_TOKEN,
  GROUP_CHAT_IDS,
  MONGO_URI,
  MONGO_DB,
  DATA_URL,
  DASHBOARD_URL,
  SCREENSHOT_PATH,
};
