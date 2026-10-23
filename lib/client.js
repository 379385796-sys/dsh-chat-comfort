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
function supported(doc) {
  return Object.entries(FINGERPRINTS).every(([file, markers]) => {
    const css = doc.head.querySelector(
      `style[data-plugin-css="@deepseek-ai/dsh-client-ui-chat/${file}"]`
    )?.textContent ?? "";
    return markers.every((marker) => css.includes(marker));
  });
}
function sheet(settings) {
  const scope = ".xz4KEq_column[data-chat-flow]";
  const user = `${scope} [data-chat-flow-kind="user"]`;
  const ai = `${scope} [data-chat-flow-kind="assistant-step"] :is(.v5IAXa_root, .ydEAna_root)`;
  const compact = settings.density === "compact";
  return `
${user} .cJsG2q_userStack { max-width: 86%; }
${user} .cJsG2q_bubble {
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
${ai} :is(.v5IAXa_body, .ydEAna_body) { min-width: 0; }
/* Native wide tables normally break out of the column. Keep their own native
   scroll container within this reading surface, without clipping any content. */
${ai} .md-table-wide {
  width: 100%; max-width: 100%; margin-left: 0; padding-left: 0;
}
${ai} :where(p, li, blockquote) { line-height: 1.8; }
${ai} :where(p) { margin-block: .65em; }
@media (max-width: 640px) {
  ${user} .cJsG2q_userStack { max-width: 94%; }
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
      if (!supported(this.doc)) {
        this.remove();
        this.publish("unsupported");
        return;
      }
      const existing = this.doc.getElementById(STYLE_ID);
      if (existing !== null && existing !== this.style) throw new Error("style id collision");
      if (this.doc.head.querySelectorAll(OWN_SELECTOR).length > (this.style?.isConnected ? 1 : 0)) {
        throw new Error("duplicate style id");
      }
      const css = sheet(this.settings);
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
function read(storage) {
  try {
    return sanitize(JSON.parse(storage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return { ...DEFAULTS };
  }
}

// src/client.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var inject = ["slots"];
function apply(ctx) {
  const load = () => {
    try {
      return read(window.localStorage);
    } catch {
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
    } catch {
    }
    controller?.update(current);
    publish();
  };
  function SettingsPanel() {
    (0, import_react.useSyncExternalStore)((fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    }, () => revision);
    const statuses = {
      active: "\u5DF2\u542F\u7528 / Active",
      off: "\u539F\u751F\u663E\u793A / Off",
      unsupported: "\u5F53\u524D\u7EC4\u4EF6\u6784\u5EFA\u672A\u9002\u914D\uFF0C\u4FDD\u7559\u539F\u751F\u663E\u793A / Unsupported build",
      error: "\u589E\u5F3A\u5DF2\u5B89\u5168\u505C\u6B62\uFF1B\u91CD\u65B0\u52A0\u8F7D\u63D2\u4EF6\u540E\u53EF\u91CD\u8BD5 / Enhancement stopped"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { "aria-label": "DSH Chat Comfort", style: { padding: 20, color: "var(--dsw-alias-label-primary)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "DSH Chat Comfort" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u804A\u5929\u6C14\u6CE1\u4E0E\u9605\u8BFB\u7559\u767D / Chat bubbles and reading space" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "checkbox",
            checked: current.enabled,
            onChange: (e) => set({ ...current, enabled: e.target.checked })
          }
        ),
        " \u542F\u7528\u804A\u5929\u7F8E\u5316 / Enable"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u6392\u7248\u5BC6\u5EA6 / Density ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            value: current.density,
            onChange: (e) => set({ ...current, density: e.target.value === "compact" ? "compact" : "comfortable" }),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "comfortable", children: "\u8212\u9002 / Comfortable" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "compact", children: "\u7D27\u51D1 / Compact" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: statuses[status] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u9605\u8BFB\u5BBD\u5EA6\u548C\u5B57\u4F53\u5927\u5C0F\u6CBF\u7528 DSH \u539F\u751F\u8BBE\u7F6E\u3002\u914D\u8272\u6CBF\u7528\u5F53\u524D\u4E3B\u9898\u4E0E Appearance\u3002" })
    ] });
  }
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
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "chat-comfort",
    order: 1010,
    label: "Chat Comfort"
  }, SettingsPanel));
}

return module.exports;}});
