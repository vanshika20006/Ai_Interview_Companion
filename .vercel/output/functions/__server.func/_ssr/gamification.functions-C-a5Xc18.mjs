import { c as createServerFn } from "./esm-DQO0vKia.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-B5kp2HPD.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DddWSZj0.mjs";
import { dt as enumType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gamification.functions-C-a5Xc18.js
var getMyAchievements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5b767a28baaf1456a0753d0d6bb7de67bb602f1a10814fcb35de17e0049bee69"));
var getMyStreak = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6684dff4829cf309ebdf2e92f9054cf20165b8321c5209b082924b1a852b0a2e"));
var getLeaderboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	scope: enumType([
		"weekly",
		"monthly",
		"all_time"
	]).default("weekly"),
	metric: enumType([
		"problems",
		"interview",
		"activity"
	]).default("problems")
}).parse(input ?? {})).handler(createSsrRpc("4748fe7d33b1f01a10237d9299052d06151693f30021fa6b4aa2b2ce4f6e4247"));
//#endregion
export { getMyAchievements as n, getMyStreak as r, getLeaderboard as t };
