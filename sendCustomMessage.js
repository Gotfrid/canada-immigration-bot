const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config({ path: "./config/.env" });

const BOT_TOKEN = process.env.PROD_BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

const recepients = [
  // ...JSON.parse(process.env.GROUP_CHAT_IDS),
  ...JSON.parse(process.env.ADMIN_CHAT_IDS),
];

const message =
  "Привет!\n" +
  "Это бот, в котором можно узнать результаты последних выборок, " +
  "посмотреть текущее распределение по баллам, " +
  "а также подписаться на уведомления об очередном раунде!\n\n" +
  "Подписывайтесь, пользуйтесь, оставляйте пожелания и предложения по улучшению.\n" +
  "Всем добра и удачи.";
const options = { parse_mode: "HTML" };

recepients.forEach((chatID) => {
  bot
    .sendMessage(chatID, message, options)
    .then((result) => console.log(`message to ${chatID} was sent`))
    .catch((error) => console.error(`message to ${chatID} WAS NOT sent`));
});
