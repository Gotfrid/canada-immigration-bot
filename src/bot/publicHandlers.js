const TelegramBot = require("node-telegram-bot-api");

const {
  welcomeMessage,
  lastRoundMessage,
  last50Message,
  distributionMessage,
  aboutMessage,
  dashboardMessage,
  subscribedMessage,
  alreadySubscribedMessage,
  unsubscribedMessage,
  alreadyUnsubscribedMessage,
  newRoundTitle,
} = require("./messages");
const bot = require("./botClient");
const {
  createUser,
  createSubscriber,
  removeSubscriber,
  getLastDraw,
  getLastNDraws,
  getLastDistribution,
  getAllSubscriberIds,
} = require("../database/mongoFunctions");
const { GROUP_CHAT_IDS, ADMIN_CHAT_IDS, SCREENSHOT_PATH } = require("../config");
const { downloadDashboardScreenshot } = require("../utils");

/**
 * Handles `/start` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const startHandler = async (msg) => {
  console.info("Received `start` command from", msg.chat.id);
  await createUser(
    msg.chat.id,
    msg.from?.first_name,
    msg.from?.last_name,
    new Date(msg.date * 1000),
  );
  await bot.sendMessage(msg.chat.id, welcomeMessage(msg.from?.first_name), { parse_mode: "HTML" });
};

/**
 * Handles `/subscribe` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const subscribeHandler = async (msg) => {
  console.info("Received `subscribe` command from", msg.chat.id);
  const isSubscribed = await createSubscriber(
    msg.chat.id,
    msg.from?.first_name,
    msg.from?.last_name,
    new Date(msg.date * 1000),
  );

  if (isSubscribed) {
    await bot.sendMessage(msg.chat.id, subscribedMessage());
  } else {
    await bot.sendMessage(msg.chat.id, alreadySubscribedMessage());
  }
};

/**
 * Handles `/unsubscribe` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const unsubscribeHandler = async (msg) => {
  console.info("Received `unsubscribe` command from", msg.chat.id);
  const isUnsubscribed = await removeSubscriber(msg.chat.id);
  if (isUnsubscribed) {
    await bot.sendMessage(msg.chat.id, unsubscribedMessage());
  } else {
    await bot.sendMessage(msg.chat.id, alreadyUnsubscribedMessage());
  }
};

/**
 * Handles `/last` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const lastHandler = async (msg) => {
  console.info("Received `last` command from", msg.chat.id);
  const draw = await getLastDraw();
  if (draw === null) {
    return;
  }
  const message = lastRoundMessage(draw);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

/**
 * Handles `/last50` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const last50Handler = async (msg) => {
  console.info("Received `last50` command from", msg.chat.id);
  const data = await getLastNDraws(50);
  const message = last50Message(data);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

/**
 * Handles `/distribution` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const distributionHandler = async (msg) => {
  console.info("Received `distribution` command from", msg.chat.id);
  const distribution = await getLastDistribution();
  if (distribution === null) {
    return;
  }
  const message = distributionMessage(distribution);
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

/**
 * Handles `/about` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const aboutHandler = async (msg) => {
  console.info("Received `about` command from", msg.chat.id);
  const message = aboutMessage();
  await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
};

/**
 * Handles `/dashboard` command
 * @param {TelegramBot.Message} msg - The message object containing information about the user and the message.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const dashboardHandler = async (msg) => {
  console.info("Received `dashboard` command from", msg.chat.id);
  await bot.sendChatAction(msg.chat.id, "upload_photo");
  await downloadDashboardScreenshot();
  const message = dashboardMessage();
  await bot.sendPhoto(msg.chat.id, SCREENSHOT_PATH, { caption: message, parse_mode: "HTML" });
};

/**
 * Handles change event in the MongoDB
 * @param {import("mongodb").ChangeStreamDocument} change - Newly added document to the MongoDB
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent to the user.
 */
const changeHandler = async (change) => {
  if (process.env.MODE === "test") return;
  if (change.operationType !== "insert") return;

  await downloadDashboardScreenshot();
  const round = /** @type {RoundClean} */ (change.fullDocument);

  const groupMessage = newRoundTitle();
  const simpleMessage = lastRoundMessage(round, true);
  const subscriberIds = await getAllSubscriberIds();

  // First, send message to the group(s) - they are the priority
  // message is special - with a screenshot
  for (const chatID of [...GROUP_CHAT_IDS, ...ADMIN_CHAT_IDS]) {
    console.info("Sending notification to", chatID);
    try {
      await bot.sendPhoto(chatID, SCREENSHOT_PATH, { caption: groupMessage, parse_mode: "HTML" });
      console.info("Message has been sent.");
    } catch (error) {
      console.error("Message could not be sent.");
    }

    // https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this
    await new Promise((r) => setTimeout(r, 60));
  }

  // Now send a simple message to all the subscibers
  for (const chatID of subscriberIds) {
    console.info("Sending notification to", chatID);
    // Possible failures: user has stopped the bot
    // but the DB still conains their chatID
    try {
      await bot.sendMessage(chatID, simpleMessage, { parse_mode: "HTML" });
      console.info("Message has been sent.");
    } catch (error) {
      console.error("Message could not be sent.");
    }
    await new Promise((r) => setTimeout(r, 60));
  }
};

exports.startHandler = startHandler;
exports.subscribeHandler = subscribeHandler;
exports.unsubscribeHandler = unsubscribeHandler;
exports.lastHandler = lastHandler;
exports.last50Handler = last50Handler;
exports.changeHandler = changeHandler;
exports.distributionHandler = distributionHandler;
exports.aboutHandler = aboutHandler;
exports.dashboardHandler = dashboardHandler;
