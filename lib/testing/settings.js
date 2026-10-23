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
function read(storage) {
  try {
    return sanitize(JSON.parse(storage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return { ...DEFAULTS };
  }
}
export {
  DEFAULTS,
  STORAGE_KEY,
  read,
  sanitize
};
