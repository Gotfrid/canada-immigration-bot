import type { RoundClean } from "./types.ts";

export function compareData(data1:RoundClean[], data2: RoundClean[]): boolean {
    if (data1.length !== data2.length) {
        return false
    }

    const s1 = new Set(data1.map((round) => round.drawNumber));
    const s2 = new Set(data2.map((round) => round.drawNumber));
    const diff = s1.difference(s2);

    if (diff.size !== 0) {
        return false;
    }

    return true;
}
