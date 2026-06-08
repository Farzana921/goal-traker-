export function xpForLevel(level: number): number {
  return Math.round(200 * Math.pow(level, 1.4));
}

export function levelFromXP(xp: number): { level: number; into: number; next: number; pct: number } {
  let level = 1;
  let acc = 0;
  while (xp >= acc + xpForLevel(level)) {
    acc += xpForLevel(level);
    level++;
    if (level > 999) break;
  }
  const into = xp - acc;
  const next = xpForLevel(level);
  return { level, into, next, pct: Math.min(100, Math.round((into / next) * 100)) };
}