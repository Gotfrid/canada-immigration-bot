/**
 * This function is supposed to run on AWS Lambda.
 */

const TelegramBot = require("node-telegram-bot-api");
const { fetchDataAndUpdate } = require("./aws/fetchDataAndUpdate");

if (process.env.MODE === "test") {
  require("dotenv").config({ path: `${__dirname}/config/.env` });
}

const bot = new TelegramBot(process.env.BOT_TOKEN);

exports.handler = async (event) => {
  const response = await fetchDataAndUpdate();
  console.log(response);
  return response;
};
