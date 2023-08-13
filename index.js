/**
 * This function is supposed to run on AWS Lambda.
 */

const { fetchDataAndUpdate } = require("./src/aws/fetchDataAndUpdate");

if (process.env.MODE === "stage") {
  require("dotenv").config({ path: `${__dirname}/.env` });
  (async () => {
    fetchDataAndUpdate(process.env.STAGE_MONGO_URI).then((response) => {
      console.log(response);
      process.exit(0);
    });
  })();
}

const bot = new TelegramBot(process.env.BOT_TOKEN);

exports.handler = async (event) => {
  const response = await fetchDataAndUpdate();
  await bot.sendMessage(process.env.CHAT_ID, response);
  return event;
};
