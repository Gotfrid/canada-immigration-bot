const AsciiTable = require("ascii-table");
const keyMapping = require("../config/distributionKeyMapping");

const welcomeMessage = (userName) => {
  return (
    `🇨🇦 <strong>Welcome, ${userName}!</strong>` +
    "\n\n" +
    "This is a bot that can help you find necessary info about the immigration to Canada from the official website: canada.ca" +
    "\n\n" +
    "Check the commands in the menu to use the bot. " +
    "Type /subscribe to get notifications of upcoming rounds of invitations." +
    "\n\n" +
    "We wish you a fast and successful immigration process! 🍁"
  );
};

const lastRoundMessage = (round, includeTitle = false) => {
  return (
    `${includeTitle ? "🎉 <strong>New round</strong>\n" : ""}` +
    `Date of round: ${round.drawDateTime}\n` +
    `CRS score: <strong>${round.drawCRS}</strong>\n` +
    `Invitations: ${round.drawSizeStr}`
  );
};

const last50Message = (document) => {
  return document
    .sort((a, b) => (a.drawDate > b.drawDate ? 1 : -1))
    .reduce((prev, next) => {
      let program;
      switch (next.drawName) {
        case "No Program Specified":
          program = ".";
          break;
        case "Provincial Nominee Program":
          program = " (PNP).";
          break;
        case "Canadian Experience Class":
          program = " (CEC).";
          break;
        default:
          program = ` (${next.drawName}).`;
      }
      return (
        prev +
        `${next.drawNumber}. ${next.drawDateFull} - ${next.drawCRS}${program}\n`
      );
    }, "");
};

const distributionMessage = (document) => {
  const doc = JSON.parse(JSON.stringify(document));
  const keys = Object.keys(doc).filter(
    (key) => key.startsWith("dd") && key !== "dd18"
  );
  const data = keys.map((key) => [keyMapping[key], doc[key]]);
  const table = new AsciiTable()
    .setHeading("Range", "Candidates")
    .addRowMatrix(data);

  const title = "<strong>CRS score distribution</strong>";
  const subtitle = `<i>as of ${document.drawDistributionAsOn}</i>`;
  const footer = `<strong>Total</strong>: ${doc.dd18}`;
  const tableString = `<pre>${table.toString()}</pre>`;

  return [title, subtitle, tableString, footer].join("\n");
};

exports.welcomeMessage = welcomeMessage;
exports.lastRoundMessage = lastRoundMessage;
exports.last50Message = last50Message;
exports.distributionMessage = distributionMessage;
