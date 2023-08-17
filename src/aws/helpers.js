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

const extractDistributionData = (round) => {
  return {
    drawNumber: round.drawNumber,
    drawDate: round.drawDate,
    drawDistributionAsOn: round.drawDistributionAsOn,
    dd1: round.dd1,
    dd2: round.dd2,
    dd3: round.dd3,
    dd4: round.dd4,
    dd5: round.dd5,
    dd6: round.dd6,
    dd7: round.dd7,
    dd8: round.dd8,
    dd9: round.dd9,
    dd10: round.dd10,
    dd11: round.dd11,
    dd12: round.dd12,
    dd13: round.dd13,
    dd14: round.dd14,
    dd15: round.dd15,
    dd16: round.dd16,
    dd17: round.dd17,
    dd18: round.dd18,
  };
};

const filterNewData = (newData, oldData) => {
  return newData.filter((e) => !oldData.includes(e.drawNumber));
};

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
