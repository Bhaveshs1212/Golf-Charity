import { SCORE_MAX, SCORE_MIN, SCORE_LIMIT } from "@/lib/constants";

export function generateRandomDraw() {
  const values = new Set<number>();
  while (values.size < SCORE_LIMIT) {
    const value = Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN + 1)) + SCORE_MIN;
    values.add(value);
  }
  return Array.from(values).sort((a, b) => a - b);
}

export function countMatches(userScores: number[], drawNumbers: number[]) {
  const drawSet = new Set(drawNumbers);
  return userScores.filter((value) => drawSet.has(value)).length;
}
