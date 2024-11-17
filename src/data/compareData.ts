import type { RoundClean } from "./types.ts";

export function compareData(
  oldData: RoundClean[],
  newData: RoundClean[],
): boolean {
  if (oldData.length !== newData.length) {
    return false;
  }

  const s1 = new Set(oldData.map((round) => round.drawNumber));
  const s2 = new Set(newData.map((round) => round.drawNumber));
  const diff = s1.difference(s2);

  if (diff.size !== 0) {
    return false;
  }

  return true;
}
