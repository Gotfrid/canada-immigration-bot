import { parse } from "jsr:@std/csv";
import { testCleanRound, type RoundClean } from "./types.ts";

export function loadData(path: string): RoundClean[] {
  // check if file exists
  try {
    Deno.lstatSync(path)
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
    return []
  }

  const csv = Deno.readTextFileSync(path);
  const columns = csv.split("\r\n")[0].split(",");
  const data = parse(csv, {
    columns,
    skipFirstRow: true,
  });

  if (!testCleanRound(data)) {
    throw new Error("Invalid data");
  }
  
  return data;
}
