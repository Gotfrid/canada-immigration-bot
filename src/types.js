/**
 * @typedef {object} Round
 * @property {string} drawNumber - Number of the sample draw, e.g. "261"
 * @property {string} drawDate - Date of the sample draw, e.g. "2023-08-03"
 * @property {string} drawDateFull - Date of the sample draw, e.g. "August 3, 2023"
 * @property {string} drawDateTime - Exact time of the sample draw, e.g. "August 03, 2023 at 13:24:52 UTC"
 * @property {string} drawName - Name of the sample draw, e.g. "Trade occupations (2023-1)""
 * @property {string} drawSizeStr - Size (raw) of the sample draw, e.g. "1,500"
 * @property {number} drawSizeNum - Size (parsed) of the sample draw, e.g. 1500
 * @property {number} drawCRS - CRS of the sample draw (passing score), e.g. 388
 */

/**
 * @typedef {object} User
 * @property {number} chatID - Telegram chat ID of the user
 * @property {string} firstName - First name of the user
 * @property {string} lastName - Last name of the user
 * @property {Date} startedAt - Date when the user started using the bot
 */

/**
 * @typedef {object} Subscriber
 * @property {number} chatID - Telegram chat ID of the subscriber
 * @property {string} firstName - First name of the subscriber
 * @property {string} lastName - Last name of the subscriber
 * @property {Date} subscribedAt - Date when the subscriber subscribed
 */

/**
 * @typedef {object} Distribution
 * @property {string} drawNumber - Number of the sample draw, e.g. "261"
 * @property {string} drawDate - Date of the sample draw, e.g. "2023-08-03"
 * @property {string} drawDistributionAsOn - Date of the sample draw, e.g. "August 3, 2023"
 * @property {string} dd1 - Amount of applicants in a certain bracket of the sample draw, for "601-1200" score, e.g. 2401
 * @property {string} dd2 - Amount of applicants in a certain bracket of the sample draw, for "501-600" score, e.g. 2401
 * @property {string} dd3 - Amount of applicants in a certain bracket of the sample draw, for "451-500" score, e.g. 2401
 * @property {string} dd4 - Amount of applicants in a certain bracket of the sample draw, for "491-500" score, e.g. 2401
 * @property {string} dd5 - Amount of applicants in a certain bracket of the sample draw, for "481-490" score, e.g. 2401
 * @property {string} dd6 - Amount of applicants in a certain bracket of the sample draw, for "471-480" score, e.g. 2401
 * @property {string} dd7 - Amount of applicants in a certain bracket of the sample draw, for "461-470" score, e.g. 2401
 * @property {string} dd8 - Amount of applicants in a certain bracket of the sample draw, for "451-460" score, e.g. 2401
 * @property {string} dd9 - Amount of applicants in a certain bracket of the sample draw, for "401-450" score, e.g. 2401
 * @property {string} dd10 - Amount of applicants in a certain bracket of the sample draw, for "441-450" score, e.g. 2401
 * @property {string} dd11 - Amount of applicants in a certain bracket of the sample draw, for "431-440" score, e.g. 2401
 * @property {string} dd12 - Amount of applicants in a certain bracket of the sample draw, for "421-430" score, e.g. 2401
 * @property {string} dd13 - Amount of applicants in a certain bracket of the sample draw, for "411-420" score, e.g. 2401
 * @property {string} dd14 - Amount of applicants in a certain bracket of the sample draw, for "401-410" score, e.g. 2401
 * @property {string} dd15 - Amount of applicants in a certain bracket of the sample draw, for "351-400" score, e.g. 2401
 * @property {string} dd16 - Amount of applicants in a certain bracket of the sample draw, for "301-350" score, e.g. 2401
 * @property {string} dd17 - Amount of applicants in a certain bracket of the sample draw, for "0-300" score, e.g. 2401
 * @property {string} dd18 - Amount of applicants in a certain bracket of the sample draw, for "Total" score, e.g. 2401
 */
