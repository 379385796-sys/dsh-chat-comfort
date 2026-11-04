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
function supported(doc) {
  return resolveBuild(doc) !== void 0;
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
export {
  FINGERPRINTS,
  RC3_FINGERPRINTS,
  V022_ABSENT,
  V022_FINGERPRINTS,
  resolveBuild,
  sheet,
  supported
};
