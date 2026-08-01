# API Documentation

All app-internal server logic is exposed as **typed RPC** via `createServerFn`. The client imports each function from `src/lib/*.functions.ts` and calls it with `useServerFn`. There is no public REST/GraphQL surface for internal data.

> Convention: every protected fn declares `.middleware([requireSupabaseAuth])` — the request bearer token is attached automatically by the global `attachSupabaseAuth` function middleware.

## Conventions

- Inputs validated with **Zod** in `.inputValidator`.
- Returns plain DTOs (objects, arrays, primitives).
- Throws `Error` for unrecoverable cases — handled by route `errorComponent`s.
- AI failures map `429` to "rate limit reached" and `402` to "credits exhausted".

---

## Profile · `src/lib/profile.functions.ts`

| Function        | Method | Input           | Returns           |
| --------------- | ------ | --------------- | ----------------- |
| `getProfile`    | GET    | –               | `Profile \| null` |
| `upsertProfile` | POST   | partial profile | `Profile`         |

## Resume · `src/lib/resume.functions.ts`

| Function             | Method | Input                                    | Returns                                                                      |
| -------------------- | ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| `analyzeResume`      | POST   | `{ file_name, raw_text, target_roles? }` | `ResumeAnalysis` (ATS score, strengths, weaknesses, role-match, suggestions) |
| `getLatestAnalysis`  | GET    | –                                        | `ResumeAnalysis \| null`                                                     |
| `getAnalysisHistory` | GET    | –                                        | `ResumeAnalysis[]` (last 10)                                                 |

## LeetCode · `src/lib/leetcode.functions.ts`

| Function                | Method | Input                                                             | Returns             |
| ----------------------- | ------ | ----------------------------------------------------------------- | ------------------- |
| `getProblemProgress`    | GET    | –                                                                 | `ProblemProgress[]` |
| `upsertProblemProgress` | POST   | `{ problem_slug, status?, revision_count?, bookmarked?, notes? }` | `ProblemProgress`   |

## Interview · `src/lib/interview.functions.ts`

| Function                | Method | Input                                                 | Returns                                |
| ----------------------- | ------ | ----------------------------------------------------- | -------------------------------------- |
| `createInterview`       | POST   | `{ role, interview_type, difficulty, num_questions }` | `Interview` (with generated questions) |
| `submitInterviewAnswer` | POST   | `{ interview_id, question_index, answer_text }`       | `InterviewFeedback`                    |
| `completeInterview`     | POST   | `{ interview_id }`                                    | `Interview` (aggregated scores)        |
| `getInterview`          | GET    | `{ interview_id }`                                    | `Interview` + answers + feedback       |
| `listInterviews`        | GET    | –                                                     | `Interview[]`                          |

## Study Planner · `src/lib/planner.functions.ts`

| Function        | Method | Input                             | Returns                         |
| --------------- | ------ | --------------------------------- | ------------------------------- |
| `generatePlan`  | POST   | `{ focus_topics?, target_role? }` | `StudyPlan` with 7 days × tasks |
| `getActivePlan` | GET    | –                                 | `StudyPlan \| null`             |
| `toggleTask`    | POST   | `{ task_id, done }`               | `StudyTask`                     |

## Jobs · `src/lib/jobs.functions.ts`

| Function        | Method | Input                          | Returns                         |
| --------------- | ------ | ------------------------------ | ------------------------------- |
| `recommendJobs` | POST   | `{ role?, location?, level? }` | `SavedJob[]` with match_percent |
| `listSavedJobs` | GET    | –                              | `SavedJob[]`                    |
| `toggleSaveJob` | POST   | `{ job_id, saved }`            | `SavedJob`                      |

## Community · `src/lib/community.functions.ts`

| Function         | Method | Input                    | Returns            |
| ---------------- | ------ | ------------------------ | ------------------ |
| `listPosts`      | GET    | `{ room?, cursor? }`     | `Post[]`           |
| `createPost`     | POST   | `{ room, body, title? }` | `Post`             |
| `togglePostLike` | POST   | `{ post_id }`            | `{ liked, count }` |
| `addComment`     | POST   | `{ post_id, body }`      | `Comment`          |

## Analytics · `src/lib/analytics.functions.ts`

| Function       | Method | Returns                                                                        |
| -------------- | ------ | ------------------------------------------------------------------------------ |
| `getAnalytics` | GET    | `{ resumeTrend, leetcodeTrend, interviewTrend, productivity, streak, totals }` |

## Dashboard · `src/lib/dashboard.functions.ts`

| Function              | Method | Returns                                                                                                   |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `getDashboardSummary` | GET    | Aggregated snapshot for **Placement Readiness Score**: resume, interview averages, problems, plan, streak |

## Gamification · `src/lib/gamification.functions.ts`

| Function            | Returns                      |
| ------------------- | ---------------------------- |
| `getMyAchievements` | `UserAchievement[]`          |
| `getLeaderboard`    | top users by composite score |

## Public Profile · `src/lib/publicProfile.functions.ts`

| Function                     | Method | Auth   | Input          | Returns                       |
| ---------------------------- | ------ | ------ | -------------- | ----------------------------- |
| `getMyPublicProfile`         | GET    | yes    | –              | `PublicProfile \| null`       |
| `upsertPublicProfile`        | POST   | yes    | settings       | `PublicProfile`               |
| `getPublicProfileByUsername` | GET    | **no** | `{ username }` | profile + safe stats + badges |

## Recruiter · `src/lib/recruiter.functions.ts`

Gated by `has_role(auth.uid(), 'recruiter')`.

| Function           | Input                                                    | Returns                                       |
| ------------------ | -------------------------------------------------------- | --------------------------------------------- |
| `searchCandidates` | `{ q?, min_ats?, min_solved?, min_interview?, skills? }` | `Candidate[]`                                 |
| `getCandidate`     | `{ user_id }`                                            | candidate detail (only public-visible fields) |
| `toggleShortlist`  | `{ candidate_id, notes? }`                               | `Shortlist`                                   |
| `listShortlist`    | –                                                        | `Shortlist[]`                                 |

---

## Error Surfaces

```ts
// Typical client wrapper
import { useServerFn } from "@tanstack/react-start";
import { toUserMessage } from "@/lib/errors";

const fn = useServerFn(analyzeResume);
try {
  const result = await fn({ data: input });
} catch (e) {
  toast.error(toUserMessage(e));
}
```
