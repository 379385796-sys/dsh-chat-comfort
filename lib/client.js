window.__ModuleLoader__.load({id:"dsh-chat-comfort",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");

// src/adapter.ts
var FINGERPRINTS = {
  "ChatView.module.css": [".xz4KEq_column{", ".xz4KEq_flowItem{"],
  "MessageItem.module.css": [".cJsG2q_userRow{", ".cJsG2q_userStack{", ".cJsG2q_bubble{"],
  "AssistantMarkdown.module.css": [".v5IAXa_root{", ".v5IAXa_body{"]
};
var RC3_FINGERPRINTS = {
  "ChatView.module.css": [".V4vHZW_column{", ".V4vHZW_flowItem{"],
  "MessageItem.module.css": [".LOmM4q_userRow{", ".LOmM4q_userStack{", ".LOmM4q_bubble{"],
  "AssistantMarkdown.module.css": [".xMeOpW_root{", ".xMeOpW_body{"]
};
var V022_FINGERPRINTS = {
  "ChatView.module.css": [".V4vHZW_column{", ".V4vHZW_flowItem{"],
  "MessageItem.module.css": [".LOmM4q_userRow{", ".LOmM4q_userStack{"],
  "AssistantMarkdown.module.css": [".xMeOpW_root{", ".xMeOpW_body{"]
};
var V022_ABSENT = {
  "MessageItem.module.css": [".LOmM4q_bubble{"]
};
var SHEET_FILES = ["ChatView.module.css", "MessageItem.module.css", "AssistantMarkdown.module.css"];
function snapshot(doc) {
  const sheets = /* @__PURE__ */ new Map();
  for (const file of SHEET_FILES) {
    sheets.set(file, doc.head.querySelector(
      `style[data-plugin-css="@deepseek-ai/dsh-client-ui-chat/${file}"]`
    )?.textContent ?? "");
  }
  return sheets;
}
function present(sheets, fingerprints) {
  return Object.entries(fingerprints).every(([file, markers]) => {
    const css = sheets.get(file) ?? "";
    return css !== "" && markers.every((marker) => css.includes(marker));
  });
}
function absent(sheets, fingerprints) {
  return Object.entries(fingerprints).every(([file, markers]) => {
    const css = sheets.get(file) ?? "";
    return markers.every((marker) => !css.includes(marker));
  });
}
function resolveBuild(doc) {
  const sheets = snapshot(doc);
  if (present(sheets, V022_FINGERPRINTS) && absent(sheets, V022_ABSENT)) return "v022";
  if (present(sheets, RC3_FINGERPRINTS)) return "rc3";
  if (present(sheets, FINGERPRINTS)) return "rc2";
  return void 0;
}
function sheet(settings, build = "rc2") {
  const rc2 = build === "rc2";
  const chat = rc2 ? "xz4KEq" : "V4vHZW";
  const message = rc2 ? "cJsG2q" : "LOmM4q";
  const aiRoot = rc2 ? ":is(.v5IAXa_root, .ydEAna_root)" : ":is(.xMeOpW_root, .ydEAna_root)";
  const aiBody = rc2 ? ":is(.v5IAXa_body, .ydEAna_body)" : ":is(.xMeOpW_body, .ydEAna_body)";
  const scope = `.${chat}_column[data-chat-flow]`;
  const user = `${scope} [data-chat-flow-kind="user"]`;
  const ai = `${scope} [data-chat-flow-kind="assistant-step"] ${aiRoot}`;
  const bubble = build === "v022" ? `${user} [data-message-bubble]` : `${user} .${message}_bubble`;
  const compact = settings.density === "compact";
  return `
${user} .${message}_userStack { max-width: 86%; }
${bubble} {
  border-radius: 20px 20px 6px 20px;
  padding: ${compact ? "10px 16px" : "12px 18px"};
  line-height: 1.75;
  overflow-wrap: anywhere;
}
${scope} [data-chat-flow-kind="user"]:not([hidden]) { padding-block: ${compact ? "6px" : "12px"}; }
${ai} {
  box-sizing: border-box;
  min-width: 0;
  padding: ${compact ? "12px 16px" : "20px 24px"};
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 18px;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, var(--dsw-alias-label-primary));
  line-height: 1.8;
  overflow-wrap: anywhere;
}
${ai} ${aiBody} { min-width: 0; }
/* Native wide tables normally break out of the column. Keep their own native
   scroll container within this reading surface, without clipping any content. */
${ai} .md-table-wide {
  width: 100%; max-width: 100%; margin-left: 0; padding-left: 0;
}
${ai} :where(p, li, blockquote) { line-height: 1.8; }
${ai} :where(p) { margin-block: .65em; }
@media (max-width: 640px) {
  ${user} .${message}_userStack { max-width: 94%; }
  ${ai} { padding: 12px; border-radius: 14px; }
}
`;
}

// src/controller.ts
var STYLE_ID = "dsh-chat-comfort-style-v1";
var HOST_SHEETS = new Set(Object.keys(FINGERPRINTS).map((file) => `@deepseek-ai/dsh-client-ui-chat/${file}`));
var OWN_SELECTOR = `[id="${STYLE_ID}"]`;
var RELEVANT_SELECTOR = [
  OWN_SELECTOR,
  ...Array.from(HOST_SHEETS, (name) => `style[data-plugin-css="${name}"]`)
].join(",");
var ComfortController = class {
  constructor(doc, settings, report = () => {
  }) {
    this.doc = doc;
    this.settings = settings;
    this.report = report;
    this.refresh();
    if (!this.failed) {
      try {
        const Observer = doc.defaultView.MutationObserver;
        this.observer = new Observer((records) => {
          if (this.disposed || this.failed || !this.settings.enabled) return;
          try {
            if (records.some((record) => this.affectsStyle(record))) this.refresh();
          } catch {
            this.fail();
          }
        });
        this.observer.observe(doc.head, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["id", "data-plugin-css"],
          attributeOldValue: true
        });
      } catch {
        this.fail();
      }
    }
  }
  style;
  observer;
  disposed = false;
  failed = false;
  status;
  update(settings) {
    this.settings = settings;
    this.refresh();
  }
  affectsStyle(record) {
    const target = record.target;
    if (target === this.style || this.style?.contains(target)) return true;
    const element = target.nodeType === 1 ? target : target.parentElement;
    if (element?.closest(RELEVANT_SELECTOR)) return true;
    if (record.type === "attributes") {
      return record.attributeName === "id" && record.oldValue === STYLE_ID || record.attributeName === "data-plugin-css" && element?.tagName === "STYLE" && HOST_SHEETS.has(record.oldValue ?? "");
    }
    if (record.type !== "childList") return false;
    return [...record.addedNodes, ...record.removedNodes].some((node) => {
      if (node === this.style || this.style !== void 0 && node.contains(this.style)) return true;
      if (node.nodeType !== 1) return false;
      const changed = node;
      return changed.matches(RELEVANT_SELECTOR) || changed.firstElementChild !== null && changed.querySelector(RELEVANT_SELECTOR) !== null;
    });
  }
  publish(status) {
    if (this.status === status) return;
    this.status = status;
    this.report(status);
  }
  remove() {
    this.style?.remove();
    this.style = void 0;
  }
  fail() {
    this.failed = true;
    this.observer?.disconnect();
    this.remove();
    this.publish("error");
  }
  refresh() {
    if (this.disposed || this.failed) return;
    try {
      if (!this.settings.enabled) {
        this.remove();
        this.publish("off");
        return;
      }
      const build = resolveBuild(this.doc);
      if (build === void 0) {
        this.remove();
        this.publish("unsupported");
        return;
      }
      const existing = this.doc.getElementById(STYLE_ID);
      if (existing !== null && existing !== this.style) throw new Error("style id collision");
      if (this.doc.head.querySelectorAll(OWN_SELECTOR).length > (this.style?.isConnected ? 1 : 0)) {
        throw new Error("duplicate style id");
      }
      const css = sheet(this.settings, build);
      if (this.style === void 0) {
        this.style = this.doc.createElement("style");
        this.style.id = STYLE_ID;
        this.style.dataset.plugin = "dsh-chat-comfort";
        this.style.textContent = css;
        this.doc.head.append(this.style);
      } else {
        if (this.style.id !== STYLE_ID) this.style.id = STYLE_ID;
        if (this.style.textContent !== css) this.style.textContent = css;
        if (!this.style.isConnected) this.doc.head.append(this.style);
      }
      this.publish("active");
    } catch {
      this.fail();
    }
  }
  dispose() {
    this.disposed = true;
    this.observer?.disconnect();
    this.observer = void 0;
    this.remove();
  }
};

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

// src/client.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var inject = ["slots", "locale"];
var zh = { title: "Chat Comfort", intro: "\u8212\u9002\u6C14\u6CE1\uFF0C\u6E05\u6670\u9605\u8BFB", enable: "\u542F\u7528\u9605\u8BFB\u4F18\u5316", enableHint: "\u8C03\u6574\u6C14\u6CE1\u4E0E\u7559\u767D\uFF0C\u4FDD\u7559\u539F\u751F\u6D88\u606F\u4EA4\u4E92\u3002", density: "\u6392\u7248\u5BC6\u5EA6", densityHint: "\u5207\u6362\u540E\u7ACB\u5373\u751F\u6548\uFF1B\u5B57\u53F7\u548C\u9605\u8BFB\u5BBD\u5EA6\u6CBF\u7528\u5BBF\u4E3B\u8BBE\u7F6E\u3002", comfortable: "\u8212\u9002", compact: "\u7D27\u51D1", active: "\u9605\u8BFB\u4F18\u5316\u5DF2\u542F\u7528", off: "\u5F53\u524D\u4F7F\u7528\u539F\u751F\u663E\u793A", unsupported: "\u5F53\u524D\u7EC4\u4EF6\u6784\u5EFA\u672A\u9002\u914D\uFF0C\u5DF2\u4FDD\u7559\u539F\u751F\u663E\u793A\u3002", error: "\u589E\u5F3A\u5DF2\u5B89\u5168\u505C\u6B62\uFF1B\u91CD\u65B0\u52A0\u8F7D\u63D2\u4EF6\u540E\u53EF\u91CD\u8BD5\u3002", unavailable: "\u65E0\u6CD5\u8BFB\u53D6\u504F\u597D\uFF0C\u5F53\u524D\u4F7F\u7528\u9ED8\u8BA4\u8BBE\u7F6E\uFF1B\u4FEE\u6539\u53EF\u80FD\u4EC5\u5728\u672C\u6B21\u751F\u6548\u3002", invalid: "\u5DF2\u4FDD\u5B58\u7684\u504F\u597D\u65E0\u6CD5\u89E3\u6790\uFF0C\u5F53\u524D\u4F7F\u7528\u9ED8\u8BA4\u8BBE\u7F6E\uFF1B\u518D\u6B21\u4FEE\u6539\u53EF\u91CD\u65B0\u4FDD\u5B58\u3002", unsaved: "\u672C\u6B21\u8BBE\u7F6E\u5DF2\u751F\u6548\uFF0C\u4F46\u672A\u80FD\u4FDD\u5B58\u3002\u91CD\u542F\u540E\u53EF\u80FD\u6062\u590D\u539F\u8BBE\u7F6E\uFF1B\u518D\u6B21\u4FEE\u6539\u53EF\u91CD\u8BD5\u4FDD\u5B58\u3002", theme: "\u914D\u8272\u8DDF\u968F\u5F53\u524D\u4E3B\u9898\u4E0E Appearance\u3002" };
var en = { title: "Chat Comfort", intro: "Comfortable bubbles, clearer reading", enable: "Enable reading enhancements", enableHint: "Adjust bubbles and spacing while retaining native message controls.", density: "Reading density", densityHint: "Applies immediately. Text size and reading width follow DSH settings.", comfortable: "Comfortable", compact: "Compact", active: "Reading enhancements are active", off: "Using the native layout", unsupported: "This component build is unsupported. The native layout is retained.", error: "Enhancement stopped safely. Reload the plugin to retry.", unavailable: "Preferences could not be read. Defaults are active; changes may last only for this session.", invalid: "Saved preferences could not be parsed. Defaults are active; change a setting to save again.", unsaved: "Applied for this session, but could not be saved. Restarting may restore earlier preferences; change a setting to retry.", theme: "Colors follow the current theme and Appearance." };
var PANEL_CSS = `
.cc-settings{max-width:720px;min-width:0;padding:20px;color:var(--dsw-alias-label-primary);font:inherit}
.cc-settings h2{margin:0;font:inherit;font-size:18px;font-weight:600;line-height:1.4}
.cc-intro{margin:6px 0 22px;color:var(--dsw-alias-label-secondary);font-size:13px}
.cc-setting{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px 0;border-top:1px solid var(--dsw-alias-border-l2)}
.cc-copy{display:flex;flex-direction:column;gap:5px;min-width:0}.cc-copy strong{font-size:13px;font-weight:500}.cc-copy small,.cc-theme{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}
.cc-settings input{width:16px;height:16px;flex:none;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.cc-settings select{font:inherit;font-size:13px;color:inherit;min-width:112px;max-width:50%;min-height:34px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-1);transition:background-color 120ms ease,border-color 120ms ease,box-shadow 120ms ease}
.cc-settings select:hover:enabled{background:var(--dsw-alias-interactive-bg-hover)}.cc-settings select:active:enabled{background:var(--dsw-alias-interactive-bg-active)}
.cc-settings :focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:3px}.cc-settings select:disabled{opacity:.45;cursor:default}
.cc-status{min-height:24px;margin:16px 0 0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.cc-storage{margin:8px 0 0;padding:10px 12px;border-left:2px solid var(--dsw-alias-state-warning-primary,var(--dsw-alias-label-secondary));border-radius:0 6px 6px 0;background:var(--dsw-alias-bg-layer-2);font-size:12px;line-height:1.6;animation:cc-feedback-in 140ms ease-out}
.cc-theme{margin-top:10px}@keyframes cc-feedback-in{from{opacity:0}to{opacity:1}}
@media(max-width:440px){.cc-settings{padding:12px}.cc-setting{gap:12px;align-items:flex-start}.cc-settings select{min-width:96px}}
@media(prefers-reduced-motion:reduce){.cc-settings select,.cc-storage{animation:none;transition:none}}
`;
function apply(ctx) {
  let storageIssue = null;
  const load = () => {
    try {
      const result = readWithStatus(window.localStorage);
      storageIssue = result.issue;
      return result.settings;
    } catch {
      storageIssue = "unavailable";
      return sanitize(null);
    }
  };
  let current = load();
  let status = "unsupported";
  let revision = 0;
  const listeners = /* @__PURE__ */ new Set();
  const publish = () => {
    revision++;
    for (const fn of listeners) fn();
  };
  let controller;
  const set = (next) => {
    current = sanitize(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      storageIssue = null;
    } catch {
      storageIssue = "unsaved";
    }
    controller?.update(current);
    publish();
  };
  function SettingsPanel({ t = (key) => zh[key] }) {
    (0, import_react.useSyncExternalStore)((fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    }, () => revision);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { "aria-label": "Chat Comfort", className: "cc-settings", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cc-intro", children: t("intro") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "cc-setting", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "cc-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("enable") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("enableHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: current.enabled, onChange: (e) => set({ ...current, enabled: e.target.checked }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "cc-setting", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "cc-copy", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("density") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("densityHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { disabled: !current.enabled, value: current.density, onChange: (e) => set({ ...current, density: e.target.value === "compact" ? "compact" : "comfortable" }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "comfortable", children: t("comfortable") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "compact", children: t("compact") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cc-status", role: "status", children: t(status) }),
      storageIssue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cc-storage", role: "status", children: t(storageIssue) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cc-theme", children: t("theme") })
    ] });
  }
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.pluginCss = "dsh-chat-comfort/panel.css";
    style.textContent = PANEL_CSS;
    document.head.append(style);
    return () => {
      style.remove();
    };
  }, "chat-comfort: settings styles");
  ctx.effect(() => ctx.locale.register("chat-comfort", { zh, en }), "chat-comfort: locale");
  ctx.effect(() => {
    controller = new ComfortController(document, current, (next) => {
      status = next;
      publish();
    });
    const sync = (event) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      current = load();
      controller?.update(current);
      publish();
    };
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      controller?.dispose();
      controller = void 0;
      listeners.clear();
    };
  }, "chat-comfort: scoped style lifecycle");
  ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "chat-comfort", order: 1010, locale: "chat-comfort", label: "Chat Comfort" }, SettingsPanel));
}

return module.exports;}});
