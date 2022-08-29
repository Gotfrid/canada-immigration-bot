import fs from "fs";

// read raw data
const rawData = fs.readFileSync("./data/rounds.json");
const rounds = JSON.parse(rawData);

const result = rounds.rounds.map((round) => {
  return {
    id: round.drawNumber,
    round_date: round.drawDate,
    immigration_program: round.drawName,
    invitations_issued: round.drawSize,
    crs_score: round.drawCRS,
  };
});

fs.writeFileSync("./data/roundsProcessed.json", JSON.stringify(result));
