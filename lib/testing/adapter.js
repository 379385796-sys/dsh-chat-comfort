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
export {
  FINGERPRINTS,
  sheet,
  supported
};
