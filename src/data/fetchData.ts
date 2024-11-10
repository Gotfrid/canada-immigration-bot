import type { RoundClean, RoundResponse } from "./types.ts";
import { extractRoundData } from "./utils.ts";

export async function fetchData(): Promise<RoundClean[]> {
  const url = Deno.env.get("DATA_URL");

  if (url === undefined) {
    throw new Error("DATA_URL is not provided");
  }

  const response = await fetch(url);
  const data: RoundResponse = await response.json();
  
  const rounds = data.rounds.map(extractRoundData);
  return rounds;
}
