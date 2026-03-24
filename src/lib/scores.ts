import { SCORE_LIMIT } from "@/lib/constants";

export function addRollingScore(scores: number[], nextScore: number) {
  const updated = [nextScore, ...scores];
  return updated.slice(0, SCORE_LIMIT);
}

export function sortScoresLatestFirst(scores: { value: number; created_at: string }[]) {
  return [...scores].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
