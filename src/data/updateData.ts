import { compareData } from "./compareData.ts";
import { fetchData } from "./fetchData.ts";
import { loadData } from "./loadData.ts";
import { saveData } from "./saveData.ts";

const LOCAL_DATA_PATH = "data/data.csv"

export async function updateData() {
  const newData = await fetchData()
  const oldData = loadData(LOCAL_DATA_PATH)

  const isEqual = compareData(newData, oldData)

  if (isEqual) {
    console.log("No changes")
    return
  }

  console.log("Changes detected")
  saveData(newData, LOCAL_DATA_PATH)
}
