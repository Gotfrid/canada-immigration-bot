import { isCleanRoundData, type RoundClean } from "./types.ts";

export function loadData(basePath: string): RoundClean[] {
  const path = basePath + "/data_all.json";

  // check if file exists
  try {
    Deno.lstatSync(path);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
    return [];
  }

  const json = Deno.readTextFileSync(path);
  const data = JSON.parse(json);

  if (!isCleanRoundData(data)) {
    throw new Error("Invalid data");
  }

  return data;
}
