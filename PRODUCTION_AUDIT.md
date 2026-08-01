# Production Readiness Audit

_Senior Staff review — AI Placement Companion_

## Executive summary

The stack (TanStack Start v1 on Cloudflare Workers + Supabase + Lovable AI Gateway) is sound. The app passes the Supabase linter and TypeScript strict build. The most material issues found in this audit were two **server-side authorization gaps** (achievement self-grant and study-group invite brute-force) and two **silent RLS-breakage bugs** in the leaderboard / group member screens. All are fixed in this pass.

---

## 1. Security — fixed

| #   | Severity   | Finding                                                                                                                                                                                   | Fix                                                                                                                                                                                                                                                |
| --- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | **High**   | `user_achievements` had a `WITH CHECK (auth.uid()=user_id)` INSERT policy. Any signed-in user could POST and award themselves any badge.                                                  | Dropped policy. Created `public.award_achievement(_code)` SECURITY DEFINER that re-validates the criteria against `resume_analyses`, `interviews`, `user_problem_progress`, `streaks` before inserting. `activity.server.ts` now calls it via RPC. |
| S2  | **Medium** | `study_group_members` allowed direct INSERT as self. Combined with the short 8-hex invite code, an attacker could brute-force `group_id` (RLS hides the group but the join still landed). | Dropped policy. Created `public.join_group_by_invite(_code)` SECURITY DEFINER which is the only path to membership. `studyGroups.functions.ts` updated; `client.server` import removed from the join handler.                                      |
| S3  | Info       | `profiles` is owner-only, which broke cross-user display names. Risk would have been widening the SELECT policy.                                                                          | Added `public.get_display_names(_ids[])` SECURITY DEFINER returning only `display_name` + opt-in `username`. Leaderboard + group members switched to it. PII (email) is never crossed.                                                             |

### Still-open items (not blocking)

- **Realtime channel auth** — currently only `community_posts`/`comments`/`post_likes` are realtime, all of which are intentionally public-feed. If group chat / DMs are added, add `realtime.messages` topic-scoping.
- **Leaked-password check (HIBP)** — enable via Cloud → Users → Auth Settings.
- **Email confirmation** — verify it's on; do not enable auto-confirm.

---

## 2. Architecture

- ✅ `createServerFn` is used for all app-internal RPC; no Edge Functions misuse.
- ✅ `requireSupabaseAuth` enforces JWT on every user-scoped fn; `attachSupabaseAuth` is wired in `src/start.ts`.
- ✅ Service-role client (`client.server.ts`) is loaded lazily inside handlers only — no client-bundle leak. The only remaining caller was the group-join lookup, which has been removed in favor of a definer fn.
- ✅ Public routes (`/`, `/u/$username`) are SSR with no protected loaders → safe for prerender.
- ⚠️ `src/start.ts` declares `functionMiddleware` before `requestMiddleware` — TanStack accepts both orders, but the project convention (per docs) is `requestMiddleware` first. Cosmetic.

## 3. Database & RLS

- All `public` tables have RLS enabled and a GRANT block.
- Critical hot-path indexes added in this migration: `user_problem_progress(user_id,status)`, `interviews(user_id,status)`, `resume_analyses(user_id,created_at)`, `bookmarks(user_id,created_at)`, `community_posts(created_at)`, `comments(post_id,created_at)`.
- `streaks` has `SELECT to authenticated USING (true)` — intentional for leaderboards (no PII).
- `has_role`, `is_group_member`, and the three new helpers use `SECURITY DEFINER ... SET search_path = public` (correct hardening).

## 4. Performance

- AI calls are length-capped (18 k chars) — good.
- Recharts memoization in analytics.
- Dashboard summary fetched in a single round-trip via `getDashboardSummary`.
- Leaderboard avoids N+1 by using `get_display_names` array RPC.
- `defaultPreloadStaleTime: 0` ensures hover-preload data stays fresh.
- Consider adding pagination to `community_posts` realtime feed when row count grows.

## 5. TypeScript / build hygiene

- Strict mode passes. The only `any` outside generated files is in `src/hooks/use-speech-recognition.ts`, where the Web Speech API has no DOM types in lib.dom — acceptable, scoped to one file.
- `routeTree.gen.ts` is auto-generated — left untouched.

## 6. UI / UX consistency

- All colors flow through semantic tokens in `src/styles.css`; no hard-coded hex in components.
- Dark theme works across new pages (bookmarks, groups, command palette, notifications, user menu).
- Single H1 on landing page. Meta tags + OG tags present per route.

## 7. Scalability notes

- Stateless server functions — fits Cloudflare Workers model.
- No in-memory globals.
- Daily challenge is deterministic by UTC date index — horizontally safe.
- Achievement awarding now performs a few extra SELECTs per call; the catalog is small (8 codes) so this is fine. If the catalog grows past ~30, batch into a single RPC.

---

## Deployment checklist

### Pre-deploy

- [ ] Run `bun run build` locally — must succeed.
- [ ] Confirm Supabase linter is clean (`supabase--linter`).
- [ ] Re-run security scan (`security--run_security_scan`).
- [ ] Verify all secrets present: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`.
- [ ] Smoke-test critical flows while signed in: resume upload, interview round, leetcode mark solved, daily challenge, bookmark, create+join group via invite code, leaderboard, public profile page.
- [ ] Try to POST directly to `user_achievements` with a fake code — must 401/403.

### Auth & email

- [ ] Email confirmation = **on**, auto-confirm = **off**.
- [ ] Google OAuth provider configured.
- [ ] HIBP leaked-password check enabled.
- [ ] Reset-password redirect URL whitelisted in Cloud.

### Frontend / SEO

- [ ] Favicon + manifest icons load (`/icon-192.png`, `/icon-512.png`).
- [ ] OG tags render on `/` and `/u/$username` (verify with a crawler/share-card preview).
- [ ] Lighthouse pass on `/` (Performance ≥ 90, A11y ≥ 95).

### Observability

- [ ] Lovable error reporter in `__root.tsx` confirmed firing.
- [ ] Try a forced 500 in a server fn → server error page renders.

### Post-deploy

- [ ] Watch first 24h of error reports.
- [ ] Spot-check Postgres slow-query report after first real traffic.

---

## Memory

Key invariants the team must preserve going forward:

- **Never restore the direct INSERT policy on `user_achievements`.** Awards go through `award_achievement`.
- **Never restore the direct INSERT policy on `study_group_members`.** Joins go through `join_group_by_invite`.
- **Never widen the `profiles` SELECT policy.** Cross-user lookups use `get_display_names`.
- `client.server` / `supabaseAdmin` is for verified webhooks and true privileged ops only — not Data API reads.
