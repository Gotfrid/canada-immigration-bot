import { isCleanRoundData, isRawRoundData, type RoundClean } from "./types.ts";
import { extractRoundData } from "./utils.ts";

export async function fetchData(): Promise<RoundClean[]> {
  const url = Deno.env.get("DATA_URL");

  if (url === undefined) {
    throw new Error("DATA_URL is not provided");
  }

  const response = await fetch(url);
  const data: unknown = await response.json();

  if (!isRawRoundData(data)) {
    throw new Error("Invalid raw data shape");
  }

  const rounds = data.rounds.map(extractRoundData);

  if (!isCleanRoundData(rounds)) {
    throw new Error("Invalid parsed data shape");
  }

  return rounds;
}
