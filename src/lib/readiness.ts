// Shared, pure readiness scoring used by Dashboard and Recruiter view.

export type ReadinessInputs = {
  atsScore: number | null; // 0-100
  avgInterviewScore: number | null; // 0-100
  solvedProblems: number;
  totalProblems: number;
  studyPlanCompletionPct: number; // 0-100
  communicationScore?: number | null; // 0-100
  consistencyDays: number; // current streak
};

export type ReadinessResult = {
  score: number; // 0-100
  band: "Beginner" | "Improving" | "Job-Ready" | "Recruiter-Ready";
  hiringProbability: number; // 0-100 (heuristic)
  breakdown: {
    resume: number;
    coding: number;
    interview: number;
    plan: number;
    consistency: number;
  };
  suggestions: string[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function computeReadiness(i: ReadinessInputs): ReadinessResult {
  const resume = clamp(i.atsScore ?? 0);
  const codingPct = i.totalProblems > 0 ? (i.solvedProblems / i.totalProblems) * 100 : 0;
  const coding = clamp(codingPct);
  const interview = clamp(i.avgInterviewScore ?? 0);
  const plan = clamp(i.studyPlanCompletionPct);
  const consistency = clamp(Math.min(i.consistencyDays, 14) * (100 / 14));

  // Weighted: Interview 30, Coding 30, Resume 25, Plan 15
  const weighted = interview * 0.3 + coding * 0.3 + resume * 0.25 + plan * 0.15;

  // Consistency bonus (up to +5)
  const score = clamp(weighted + consistency * 0.05);

  // Heuristic hiring probability — soft S-curve, capped 92%
  const hiringProbability = clamp(Math.round(100 / (1 + Math.exp(-(score - 55) / 10))) - 5);

  const band: ReadinessResult["band"] =
    score >= 85
      ? "Recruiter-Ready"
      : score >= 70
        ? "Job-Ready"
        : score >= 45
          ? "Improving"
          : "Beginner";

  const suggestions: string[] = [];
  if (resume < 70) suggestions.push("Re-analyze your resume — push your ATS score above 70.");
  if (coding < 50) suggestions.push("Solve more DSA problems from the curated roadmap.");
  if (interview < 60) suggestions.push("Run an AI mock interview to lift your interview score.");
  if (plan < 40) suggestions.push("Generate a study plan and complete weekly tasks.");
  if (i.consistencyDays < 5) suggestions.push("Build a daily habit — aim for a 7-day streak.");
  if (suggestions.length === 0)
    suggestions.push("You're recruiter-ready. Share your public profile.");

  return {
    score,
    band,
    hiringProbability,
    breakdown: { resume, coding, interview, plan, consistency },
    suggestions,
  };
}
