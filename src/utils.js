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

exports.welcomeMessage = welcomeMessage;
exports.lastRoundMessage = lastRoundMessage;
exports.last50Message = last50Message;
