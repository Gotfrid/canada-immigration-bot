import fetch from "node-fetch";
import fs from "fs";

const url =
  "https://www.canada.ca/" +
  "content/dam/ircc/documents/json/" +
  "ee_rounds_123_en.json";

fetch(url, { method: "GET" })
  .then((res) => res.json())
  .then((json) => fs.writeFileSync("./data/rounds.json", JSON.stringify(json)));
