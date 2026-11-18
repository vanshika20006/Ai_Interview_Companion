import { t as wrapper_default } from "../_libs/ws.mjs";
//#region node_modules/.nitro/vite/services/ssr/index.js
var capturedLogs = [];
function recordLog(prefix, ...args) {
	try {
		const text = args.map((a) => {
			if (a instanceof Error) return `${a.name}: ${a.message}\n${a.stack}`;
			if (typeof a === "object" && a !== null) try {
				return JSON.stringify(a);
			} catch {
				return String(a);
			}
			return String(a);
		}).join(" ");
		capturedLogs.push(`[${(/* @__PURE__ */ new Date()).toISOString()}] [${prefix}] ${text}`);
		if (capturedLogs.length > 50) capturedLogs.shift();
	} catch {}
}
var originalConsoleError = console.error;
console.error = (...args) => {
	recordLog("console.error", ...args);
	originalConsoleError(...args);
};
var originalConsoleWarn = console.warn;
console.warn = (...args) => {
	recordLog("console.warn", ...args);
	originalConsoleWarn(...args);
};
if (typeof process !== "undefined" && process.on) {
	process.on("uncaughtException", (err) => recordLog("uncaughtException", err));
	process.on("unhandledRejection", (reason) => recordLog("unhandledRejection", reason));
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => recordLog("window.error", event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => recordLog("window.unhandledrejection", event.reason));
}
function getCapturedLogs() {
	return capturedLogs.join("\n");
}
if (typeof globalThis.WebSocket === "undefined") globalThis.WebSocket = wrapper_default;
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-D2eSJ-Vm.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response, request) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	const logs = getCapturedLogs();
	const reqInfo = `${request.method} ${request.url} | Headers: ${JSON.stringify(Object.fromEntries(request.headers.entries()))}`;
	console.error(`h3 swallowed SSR error on ${request.url}: ${body}\nRequest: ${reqInfo}\nLogs:\n${logs}`);
	return new Response(`<!doctype html><html><head><title>Server Error Details</title></head><body style="font-family:sans-serif;padding:2rem;">
<h1>Catastrophic SSR Error</h1>
<p><strong>Request:</strong> ${request.method} ${request.url}</p>
<h3>h3 Response:</h3>
<pre style="background:#f4f4f4;padding:1rem;">${body}</pre>
<h3>Captured Server Logs:</h3>
<pre style="background:#222;color:#0f0;padding:1rem;overflow:auto;">${logs || "No server logs captured."}</pre>
</body></html>`, {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx), request);
	} catch (error) {
		console.error("[server.ts fetch error]", error);
		const detail = error instanceof Error ? error.stack : String(error);
		const logs = getCapturedLogs();
		return new Response(`<!doctype html><html><head><title>Server Error</title></head><body style="font-family:sans-serif;padding:2rem;">
<h1>SSR Handler Exception</h1>
<pre style="background:#f4f4f4;padding:1rem;">${detail}</pre>
<h3>Logs:</h3>
<pre style="background:#222;color:#0f0;padding:1rem;overflow:auto;">${logs}</pre>
</body></html>`, {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default };
