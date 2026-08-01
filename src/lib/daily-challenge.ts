import { LEETCODE_PROBLEMS, type LeetCodeProblem } from "@/data/leetcode-problems";

// Deterministic daily problem based on the date (UTC day index)
export function getDailyChallenge(date = new Date()): LeetCodeProblem {
  const dayIdx = Math.floor(date.getTime() / 86_400_000);
  const idx =
    ((dayIdx % LEETCODE_PROBLEMS.length) + LEETCODE_PROBLEMS.length) % LEETCODE_PROBLEMS.length;
  return LEETCODE_PROBLEMS[idx];
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
