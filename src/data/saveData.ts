import type { RoundClean } from "./types.ts";

export function saveData(data: RoundClean[], basePath: string) {
  if (basePath.endsWith("/")) {
    throw new Error("basePath should not end with a slash");
  }

  const dataSorted = data.toSorted((a, b) =>
    a.drawNumber.localeCompare(b.drawNumber, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  const allData = JSON.stringify(dataSorted, null, 4);
  const allDataPath = basePath + "/data_all.json";
  Deno.writeTextFileSync(allDataPath, allData);

  const lastData = JSON.stringify(dataSorted.slice(-1), null, 4);
  const lastDataPath = basePath + "/data_last.json";
  Deno.writeTextFileSync(lastDataPath, lastData);

  const last50Data = JSON.stringify(dataSorted.slice(-50), null, 4);
  const last50DataPath = basePath + "/data_last50.json";
  Deno.writeTextFileSync(last50DataPath, last50Data);
}
