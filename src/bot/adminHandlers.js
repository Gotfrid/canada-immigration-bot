/**
 * These handlers are created only for admin use
 * and are not "visible" to the public.
 */
const { getInternalStats } = require("../database/mongoFunctions");

/**
 * Send a message with DB stats
 * @param {TelegramBot} bot
 * @param {TelegramBot.Message} msg
 * @param {Array<Number>} adminList
 * @returns {undefined}
 */
const statsHandler = async (bot, msg, adminList) => {
  if (!adminList.includes(msg.chat.id)) {
    await bot.sendMessage(msg.chat.id, "Only admin can execute this command.");
    return;
  }

  const { totalRounds, totalUsers, totalSubscribers } = getInternalStats();

  const message = `
    Total rounds: ${totalRounds.length} \
    \nTotal users: ${totalUsers.length} \
    \nTotal subscribers: ${totalSubscribers.length} \
  `;

  bot.sendMessage(msg.chat.id, message);
};

exports.statsHandler = statsHandler;
