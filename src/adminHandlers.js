/**
 * These handlers are created only for admin use
 * and are not "visible" to the public.
 */

/**
 * Send a message with the MongoDB connection URL that is in use
 * @param {TelegramBot} bot Instance of telegram bot
 * @param {TelegramBot.Message} msg Object with message data
 * @param {Array[int]} adminList List of chat_id with admin access
 * @param {String} mongoConnection Connection URL to currently used mongo instance
 * @returns {undefined}
 */
const debugHandler = (bot, msg, adminList, mongoConnection) => {
  if (!adminList.includes(msg.chat.id)) {
    bot.sendMessage(msg.chat.id, "Only admin can execute this command.");
    return;
  }
  // Logic to fetch necessary data
  const message = `Bot is connected to mongo instance at ${mongoConnection}`;
  bot.sendMessage(msg.chat.id, message);
};

exports.debugHandler = debugHandler;
