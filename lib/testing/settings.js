// src/settings.ts
var STORAGE_KEY = "dsh-chat-comfort.settings.v1";
var DEFAULTS = { enabled: true, density: "comfortable" };
function sanitize(value) {
  const v = typeof value === "object" && value !== null ? value : {};
  return {
    enabled: typeof v.enabled === "boolean" ? v.enabled : DEFAULTS.enabled,
    density: v.density === "compact" ? "compact" : "comfortable"
  };
}
function readWithStatus(storage) {
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { settings: { ...DEFAULTS }, issue: "unavailable" };
  }
  try {
    return { settings: sanitize(JSON.parse(raw ?? "null")), issue: null };
  } catch {
    return { settings: { ...DEFAULTS }, issue: "invalid" };
  }
}
function read(storage) {
  return readWithStatus(storage).settings;
}
export {
  DEFAULTS,
  STORAGE_KEY,
  read,
  readWithStatus,
  sanitize
};
