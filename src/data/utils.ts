import type { RoundClean, RoundRaw } from "./types.ts";

export const extractRoundData = (round: RoundRaw): RoundClean => {
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
