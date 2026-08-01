// Minimal isomorphic logger. Keep noise out of production console.
type Level = "debug" | "info" | "warn" | "error";

const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

function emit(level: Level, scope: string, msg: string, meta?: unknown) {
  if (!isDev && level === "debug") return;
  const payload = meta !== undefined ? [`[${scope}]`, msg, meta] : [`[${scope}]`, msg];
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](...payload);
}

export const logger = {
  scope: (scope: string) => ({
    debug: (m: string, meta?: unknown) => emit("debug", scope, m, meta),
    info: (m: string, meta?: unknown) => emit("info", scope, m, meta),
    warn: (m: string, meta?: unknown) => emit("warn", scope, m, meta),
    error: (m: string, meta?: unknown) => emit("error", scope, m, meta),
  }),
};
