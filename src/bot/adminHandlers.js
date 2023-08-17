/**
 * These handlers are created only for admin use
 * and are not "visible" to the public.
 */
const bot = require("./botClient");
const { getInternalStats } = require("../database/mongoFunctions");
const { ADMIN_CHAT_IDS } = require("../config");

/**
 * Send a message with DB stats
 * @param {TelegramBot.Message} msg
 * @returns {void}
 */
const statsHandler = async (msg) => {
  if (!ADMIN_CHAT_IDS.includes(msg.chat.id)) {
    await bot.sendMessage(msg.chat.id, "Only admin can execute this command.");
  }

  const { totalRounds, totalUsers, totalSubscribers } = await getInternalStats();

  const message = `
    Total rounds: ${totalRounds} \
    \nTotal users: ${totalUsers} \
    \nTotal subscribers: ${totalSubscribers} \
  `;

  await bot.sendMessage(msg.chat.id, message);
};

const testHandler = async (msg) => {
  console.info("Received `test` command from", msg.chat.id);
  await bot.sendMessage(msg.chat.id, "IT'S ALIVE!");
};

module.exports = {
  testHandler,
  statsHandler,
};
