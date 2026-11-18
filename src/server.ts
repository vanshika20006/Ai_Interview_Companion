import "./lib/error-capture";
import ws from "ws";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = ws as any;
}

import { getCapturedLogs } from "./lib/error-capture";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"status":500,"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  request: Request,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const logs = getCapturedLogs();
  const reqInfo = `${request.method} ${request.url} | Headers: ${JSON.stringify(Object.fromEntries(request.headers.entries()))}`;

  console.error(`h3 swallowed SSR error on ${request.url}: ${body}\nRequest: ${reqInfo}\nLogs:\n${logs}`);
  return new Response(
    `<!doctype html><html><head><title>Server Error Details</title></head><body style="font-family:sans-serif;padding:2rem;">
<h1>Catastrophic SSR Error</h1>
<p><strong>Request:</strong> ${request.method} ${request.url}</p>
<h3>h3 Response:</h3>
<pre style="background:#f4f4f4;padding:1rem;">${body}</pre>
<h3>Captured Server Logs:</h3>
<pre style="background:#222;color:#0f0;padding:1rem;overflow:auto;">${logs || "No server logs captured."}</pre>
</body></html>`,
    {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response, request);
    } catch (error) {
      console.error("[server.ts fetch error]", error);
      const detail = error instanceof Error ? error.stack : String(error);
      const logs = getCapturedLogs();
      return new Response(
        `<!doctype html><html><head><title>Server Error</title></head><body style="font-family:sans-serif;padding:2rem;">
<h1>SSR Handler Exception</h1>
<pre style="background:#f4f4f4;padding:1rem;">${detail}</pre>
<h3>Logs:</h3>
<pre style="background:#222;color:#0f0;padding:1rem;overflow:auto;">${logs}</pre>
</body></html>`,
        {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }
  },
};
