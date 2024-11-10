import { stringify } from "jsr:@std/csv";
import type { RoundClean } from "./types.ts";

export function saveData(data: RoundClean[], path: string) {
  const csv = stringify(data, {
    headers: true,
    columns: Object.keys(data[0]),
  })
  Deno.writeTextFileSync(path, csv);
}
