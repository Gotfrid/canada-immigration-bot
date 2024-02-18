/**
 * Get round meta information from the complete raw round data
 * @param {RoundRaw} round
 * @returns {RoundClean}
 */
const extractRoundData = (round) => {
  return {
    drawNumber: round.drawNumber,
    drawDate: round.drawDate,
    drawDateFull: round.drawDateFull,
    drawDateTime: round.drawDateTime,
    drawName: round.drawName,
    drawSizeStr: round.drawSize,
    drawSizeNum: Number(round.drawSize.replace(",", "")),
    drawCRS: Number(round.drawCRS),
  };
};

/**
 * Get distribution information from the complete raw round data
 * @param {RoundRaw} round
 * @returns {DistributionClean}
 */
const extractDistributionData = (round) => {
  return {
    drawNumber: round.drawNumber,
    drawDate: round.drawDate,
    drawDistributionAsOn: round.drawDistributionAsOn,
    dd1: Number(round.dd1),
    dd2: Number(round.dd2),
    dd3: Number(round.dd3),
    dd4: Number(round.dd4),
    dd5: Number(round.dd5),
    dd6: Number(round.dd6),
    dd7: Number(round.dd7),
    dd8: Number(round.dd8),
    dd9: Number(round.dd9),
    dd10: Number(round.dd10),
    dd11: Number(round.dd11),
    dd12: Number(round.dd12),
    dd13: Number(round.dd13),
    dd14: Number(round.dd14),
    dd15: Number(round.dd15),
    dd16: Number(round.dd16),
    dd17: Number(round.dd17),
    dd18: Number(round.dd18),
  };
};

/**
 * Given an array of fetched round data,
 * filter out those rounds that are already stored in the database.
 * @param {RoundClean[]} newData
 * @param {string[]} oldData
 * @returns
 */
const filterNewData = (newData, oldData) => {
  return newData.filter((e) => !oldData.includes(e.drawNumber));
};

/**
 *
 * @param {*} allRounds
 * @param {*} existingRounds
 * @param {*} existingDistributions
 * @param {*} insertRoundResult
 * @param {*} insertDistrResult
 * @returns
 */
const generateLogMessage = (
  allRounds,
  existingRounds,
  existingDistributions,
  insertRoundResult,
  insertDistrResult,
) => {
  const message = `
    Downloaded a total of ${allRounds.length} entries.
    Fetched ${existingRounds.length} round entries from the DB.
    Fetched ${existingDistributions.length} distr entries from the DB.
    Saving rounds data: ${insertRoundResult}.
    Saving distribution data: ${insertDistrResult}.
  `;

  return message;
};

module.exports = {
  extractRoundData,
  extractDistributionData,
  filterNewData,
  generateLogMessage,
};
