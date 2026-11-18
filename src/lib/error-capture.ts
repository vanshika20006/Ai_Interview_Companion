// Captures logs and errors out-of-band so server.ts can expose them
// when h3 or start has swallowed the throw into a generic 500 Response.

const capturedLogs: string[] = [];

function recordLog(prefix: string, ...args: unknown[]) {
  try {
    const text = args
      .map((a) => {
        if (a instanceof Error) return `${a.name}: ${a.message}\n${a.stack}`;
        if (typeof a === "object" && a !== null) {
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        }
        return String(a);
      })
      .join(" ");
    capturedLogs.push(`[${new Date().toISOString()}] [${prefix}] ${text}`);
    if (capturedLogs.length > 50) capturedLogs.shift();
  } catch {}
}

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  recordLog("console.error", ...args);
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  recordLog("console.warn", ...args);
  originalConsoleWarn(...args);
};

if (typeof process !== "undefined" && process.on) {
  process.on("uncaughtException", (err) => recordLog("uncaughtException", err));
  process.on("unhandledRejection", (reason) => recordLog("unhandledRejection", reason));
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) =>
    recordLog("window.error", (event as ErrorEvent).error ?? event),
  );
  globalThis.addEventListener("unhandledrejection", (event) =>
    recordLog("window.unhandledrejection", (event as PromiseRejectionEvent).reason),
  );
}

export function getCapturedLogs(): string {
  return capturedLogs.join("\n");
}

export function consumeLastCapturedError(): unknown {
  return getCapturedLogs();
}
