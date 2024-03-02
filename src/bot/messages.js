const AsciiTable = require("ascii-table");
const keyMapping = require("../database/distributionKeyMapping");

/**
 * Generate a message that user will see when interacting with the bot for the first time.
 * @param {string | undefined} userName - First name of the user, if they provided it. If the name is not provided, falls back to 'friend'.
 * @returns
 */
const welcomeMessage = (userName = undefined) => {
  const name = userName || "friend";

  return (
    `🇨🇦 <strong>Welcome, ${name}!</strong>` +
    "\n\n" +
    "This is a bot that can help you find necessary info about the immigration to Canada from the official website: canada.ca" +
    "\n\n" +
    "Check the commands in the menu to use the bot. " +
    "Type /subscribe to get notifications of upcoming rounds of invitations." +
    "\n\n" +
    "Also, there is a dashborad with latest draw charts! Check it out at <a href='https://canadian-express.vercel.app/'>Canadian Express</a>." +
    "\n\n" +
    "I wish you a fast and successful immigration process! 🍁" +
    "\n\n" +
    "Best,\nPavel"
  );
};

const newRoundTitle = () => "🎉 <strong>New round</strong>\n";

/**
 * Generate a message with the information on the latest round of invitations.
 *
 * This message is either sent on demand (when user types /last) or when a new round is added to the database.
 * In the latter case, a title is added to the message, to make it more clear that this message comes from a notification.
 * Currently, notification is sent to the Telegram Group chat, and to the subscribers.
 *
 * @param {RoundClean} round - Mongo document with the draw data
 * @param {boolean} includeTitle - Whether the message should start with "new round"
 * @returns
 */
const lastRoundMessage = (round, includeTitle = false) => {
  return (
    `${includeTitle ? newRoundTitle() : ""}` +
    `Draw: ${round.drawName}\n` +
    `Date of round: ${round.drawDateTime}\n` +
    `CRS score: <strong>${round.drawCRS}</strong>\n` +
    `Invitations: ${round.drawSizeStr}`
  );
};

/**
 * Reduce all variants of program names to a small set of unified names
 * @param {string} name - Draw name
 * @returns {string} Standarized program name
 */
const standardizeProgramName = (name) => {
  return name === "No Program Specified"
    ? "N/A"
    : name === "Provincial Nominee Program"
    ? "PNP"
    : name === "Canadian Experience Class"
    ? "CEC"
    : name === "Federal Skilled Worker"
    ? "FSW"
    : "OTHER";
};

/**
 * Generate a message with the information on the latest 50 rounds of invitations.
 *
 * In the current implementation, the message is formatted as a table with 3 columns: date, score, program.
 *
 * @param {RoundClean[]} documents
 * @returns
 */
const last50Message = (documents) => {
  const data = documents
    .sort((a, b) => b.drawNumber.localeCompare(a.drawNumber))
    .map((round) => {
      const program = standardizeProgramName(round.drawName);
      return [round.drawDate, round.drawCRS, program];
    });

  const table = new AsciiTable(undefined, undefined)
    .setHeading("Date", "Score", "Program")
    .addRowMatrix(data);

  const title = "<strong>Last 50 scores</strong>";
  const tableString = `<pre>${table.toString()}</pre>`;

  return [title, tableString].join("\n");
};

/**
 * Generate a message with the information on the latest CRS score distribution.
 *
 * In the current implementation, the message is formatted as a table with 2 columns: bracket, number of candidates.
 *
 * @param {DistributionClean} document
 * @returns
 */
const distributionMessage = (document) => {
  const doc = JSON.parse(JSON.stringify(document));
  const keys = /** @type {const} */ (["dd1", "dd2", "dd3", "dd9", "dd15", "dd16", "dd17"]);
  const data = keys.map((key) => [keyMapping[key], doc[key]]);
  const table = new AsciiTable(undefined, undefined)
    .setHeading("Range", "Candidates")
    .addRowMatrix(data);

  const title = "<strong>CRS score distribution</strong>";
  const subtitle = `<i>as of ${document.drawDistributionAsOn}</i>`;
  const footer = `<strong>Total</strong>: ${doc.dd18}`;
  const tableString = `<pre>${table.toString()}</pre>`;

  return [title, subtitle, tableString, footer].join("\n");
};

/**
 * Generate a message with the information about the bot.
 * @returns
 */
const aboutMessage = () => {
  const title = "Hey 👋\n";
  const body1 =
    "I'm happy that you decided to use this bot. I hope it will assist you in the immigration process!\n";
  const body2 =
    "In addition to this bot, I'm developing a <a href='https://canadian-express.vercel.app/'>Canadian Express</a> dashboard to help you better digest numbers ⭐\n";
  const body3 = "If you have any questions or suggestions, send me a message - @Gotf1d.\n";
  const signature = "Best,\nPavel 🇨🇦";

  return [title, body1, body2, body3, signature].join("\n");
};

/**
 * Generate a message with the link to the dashboard.
 * @returns
 */
const dashboardMessage = () => {
  return "You can explore the data on this dashboard:\n\nhttps://canadian-express.vercel.app";
};

/**
 * Generate a message that user will see when they subscribe to notifications.
 * @returns
 */
const subscribedMessage = () =>
  "You are now subscribed!\nIf you want to stop receiving notifications, you can /unsubscribe.";

/**
 * Generate a message that user will see when they unsubscribe from notifications.
 * @returns
 */
const unsubscribedMessage = () =>
  "You have unsubscribed.\nIf you want to receive notifications again, you can /subscribe.";

/**
 * Generate a message that user will see when they try to subscribe, but they are already subscribed.
 * @returns
 */
const alreadySubscribedMessage = () =>
  "You are already subscribed!\nIf you want, you can /unsubscribe.";

/**
 * Generate a message that user will see when they try to unsubscribe, but they are already unsubscribed.
 * @returns
 */
const alreadyUnsubscribedMessage = () =>
  "You are not subscribed!\nIf you want to receive notifications, you can /subscribe.";

module.exports = {
  welcomeMessage,
  newRoundTitle,
  lastRoundMessage,
  last50Message,
  distributionMessage,
  aboutMessage,
  dashboardMessage,
  subscribedMessage,
  unsubscribedMessage,
  alreadySubscribedMessage,
  alreadyUnsubscribedMessage,
  standardizeProgramName,
};
