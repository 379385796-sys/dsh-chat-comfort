// src/settings.ts
var STORAGE_KEY = "dsh-chat-comfort.settings.v1";
var DEFAULTS = {
  density: "comfortable",
  backgroundOpacity: 100,
  frostedGlass: false
};
function sanitize(value) {
  const v = typeof value === "object" && value !== null ? value : {};
  const opacity = v.backgroundOpacity;
  return {
    density: v.density === "compact" ? "compact" : "comfortable",
    backgroundOpacity: typeof opacity === "number" && Number.isFinite(opacity) ? Math.min(100, Math.max(0, Math.round(opacity / 5) * 5)) : DEFAULTS.backgroundOpacity,
    frostedGlass: v.frostedGlass === true
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
