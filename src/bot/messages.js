const AsciiTable = require("ascii-table");
const keyMapping = require("../database/distributionKeyMapping");

const welcomeMessage = (userName) => {
  return (
    `🇨🇦 <strong>Welcome, ${userName}!</strong>` +
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

const lastRoundMessage = (round, includeTitle = false) => {
  return (
    `${includeTitle ? "🎉 <strong>New round</strong>\n" : ""}` +
    `Draw: ${round.drawName}\n` +
    `Date of round: ${round.drawDateTime}\n` +
    `CRS score: <strong>${round.drawCRS}</strong>\n` +
    `Invitations: ${round.drawSizeStr}`
  );
};

const last50Message = (document) => {
  const data = document
    .sort((a, b) => b.drawNumber.localeCompare(a.drawNumber))
    .map((round) => {
      const program =
        round.drawName === "No Program Specified"
          ? "N/A"
          : round.drawName === "Provincial Nominee Program"
          ? "PNP"
          : round.drawName === "Canadian Experience Class"
          ? "CEC"
          : round.drawName === "Federal Skilled Worker"
          ? "FSW"
          : "OTHER";
      return [round.drawDate, round.drawCRS, program];
    });

  const table = new AsciiTable().setHeading("Date", "Score", "Program").addRowMatrix(data);

  const title = "<strong>Last 50 scores</strong>";
  const tableString = `<pre>${table.toString()}</pre>`;

  return [title, tableString].join("\n");
};

const distributionMessage = (document) => {
  const doc = JSON.parse(JSON.stringify(document));
  const keys = ["dd1", "dd2", "dd3", "dd9", "dd15", "dd16", "dd17"];
  const data = keys.map((key) => [keyMapping[key], doc[key]]);
  const table = new AsciiTable().setHeading("Range", "Candidates").addRowMatrix(data);

  const title = "<strong>CRS score distribution</strong>";
  const subtitle = `<i>as of ${document.drawDistributionAsOn}</i>`;
  const footer = `<strong>Total</strong>: ${doc.dd18}`;
  const tableString = `<pre>${table.toString()}</pre>`;

  return [title, subtitle, tableString, footer].join("\n");
};

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

const dashboardMessage = () => {
  return "You can explore the data on this dashboard:\n\nhttps://canadian-express.vercel.app";
};

const subscribedMessage = () =>
  "You are now subscribed!\nIf you want to stop receiving notifications, you can /unsubscribe.";

const unsubscribedMessage = () =>
  "You have unsubscribed.\nIf you want to receive notifications again, you can /subscribe.";

const alreadySubscribedMessage = () =>
  "You are already subscribed!\nIf you want, you can /unsubscribe.";

const alreadyUnsubscribedMessage = () =>
  "You are not subscribed!\nIf you want to receive notifications, you can /subscribe.";

module.exports = {
  welcomeMessage,
  lastRoundMessage,
  last50Message,
  distributionMessage,
  aboutMessage,
  dashboardMessage,
  subscribedMessage,
  unsubscribedMessage,
  alreadySubscribedMessage,
  alreadyUnsubscribedMessage,
};
