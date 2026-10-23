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
export {
  ComfortController,
  STYLE_ID
};
