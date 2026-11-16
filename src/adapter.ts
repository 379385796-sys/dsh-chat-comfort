import type { Settings } from './settings.ts'

// Exact CSS markers reviewed from the Windows Desktop RC2 and RC3 builds.
// A different build is unsupported until explicitly reviewed, even at the same version.
export const FINGERPRINTS = {
  'ChatView.module.css': ['.xz4KEq_column{', '.xz4KEq_flowItem{'],
  'MessageItem.module.css': ['.cJsG2q_userRow{', '.cJsG2q_userStack{', '.cJsG2q_bubble{'],
  'AssistantMarkdown.module.css': ['.v5IAXa_root{', '.v5IAXa_body{'],
} as const

export const RC3_FINGERPRINTS = {
  'ChatView.module.css': ['.V4vHZW_column{', '.V4vHZW_flowItem{'],
  'MessageItem.module.css': ['.LOmM4q_userRow{', '.LOmM4q_userStack{', '.LOmM4q_bubble{'],
  'AssistantMarkdown.module.css': ['.xMeOpW_root{', '.xMeOpW_body{'],
} as const

// DSH 0.2.2-rc.1 keeps the RC3 CSS-module hashes but moves the right-aligned
// user bubble out of MessageItem.module.css into the shared `UserMessageBubble`
// primitive, which carries `data-message-bubble` instead of a module class.
// Same hashes, different target: the bubble marker must be gone for this build.
export const V022_FINGERPRINTS = {
  'ChatView.module.css': ['.V4vHZW_column{', '.V4vHZW_flowItem{'],
  'MessageItem.module.css': ['.LOmM4q_userRow{', '.LOmM4q_userStack{'],
  'AssistantMarkdown.module.css': ['.xMeOpW_root{', '.xMeOpW_body{'],
} as const

/** Markers that must be absent, so a 0.2.2 document is never read as RC3. */
export const V022_ABSENT = {
  'MessageItem.module.css': ['.LOmM4q_bubble{'],
} as const

export type Build = 'rc2' | 'rc3' | 'v022'

/** Every fingerprint set reads the same three host sheets, so one pass serves all checks. */
const SHEET_FILES = ['ChatView.module.css', 'MessageItem.module.css', 'AssistantMarkdown.module.css'] as const

/** 0–95 in the 5% steps the settings sanitizer can produce; 100% removes the attribute. */
const OPACITY_LEVELS = Array.from({ length: 20 }, (_, index) => index * 5)

function snapshot(doc: Document): Map<string, string> {
  const sheets = new Map<string, string>()
  for (const file of SHEET_FILES) {
    sheets.set(file, doc.head.querySelector<HTMLStyleElement>(
      `style[data-plugin-css="@deepseek-ai/dsh-client-ui-chat/${file}"]`)?.textContent ?? '')
  }
  return sheets
}

function present(sheets: Map<string, string>, fingerprints: Readonly<Record<string, readonly string[]>>): boolean {
  return Object.entries(fingerprints).every(([file, markers]) => {
    const css = sheets.get(file) ?? ''
    return css !== '' && markers.every((marker: string) => css.includes(marker))
  })
}

function absent(sheets: Map<string, string>, fingerprints: Readonly<Record<string, readonly string[]>>): boolean {
  return Object.entries(fingerprints).every(([file, markers]) => {
    const css = sheets.get(file) ?? ''
    return markers.every((marker: string) => !css.includes(marker))
  })
}

export function resolveBuild(doc: Document): Build | undefined {
  const sheets = snapshot(doc)
  // Newest first: the 0.2.2 check owns the RC3 hashes, so it must claim them
  // before the RC3 rules see the same class names.
  if (present(sheets, V022_FINGERPRINTS) && absent(sheets, V022_ABSENT)) return 'v022'
  if (present(sheets, RC3_FINGERPRINTS)) return 'rc3'
  if (present(sheets, FINGERPRINTS)) return 'rc2'
  return undefined
}
export function supported(doc: Document): boolean { return resolveBuild(doc) !== undefined }

export function sheet(settings: Settings, build: Build = 'rc2'): string {
  const rc2 = build === 'rc2'
  const chat = rc2 ? 'xz4KEq' : 'V4vHZW'
  const message = rc2 ? 'cJsG2q' : 'LOmM4q'
  const aiRoot = rc2 ? ':is(.v5IAXa_root, .ydEAna_root)' : ':is(.xMeOpW_root, .ydEAna_root)'
  const aiBody = rc2 ? ':is(.v5IAXa_body, .ydEAna_body)' : ':is(.xMeOpW_body, .ydEAna_body)'
  const scope = `.${chat}_column[data-chat-flow]`
  const user = `${scope} [data-chat-flow-kind="user"]`
  // dsh-smooth-stream 0.7.0 replaces the native assistant-step renderer and
  // renders its own CSS-module root. Keep the native target as the fallback.
  const ai = `${scope} [data-chat-flow-kind="assistant-step"] ${aiRoot}`
  // 0.2.2 renders the user bubble through the shared primitive, so the module
  // class no longer exists; its semantic attribute is the stable target.
  const bubble = build === 'v022' ? `${user} [data-message-bubble]` : `${user} .${message}_bubble`
  const compact = settings.density === 'compact'
  const assistantBackground = 'color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, var(--dsw-alias-label-primary))'
  // Opacity and glass are attribute switches, so this sheet only depends on the
  // build and density. Dragging the slider must not rewrite any style text.
  const material = OPACITY_LEVELS.map(level => {
    const gate = `html[data-cc-opacity="${level}"]`
    const border = level === 0
      ? 'transparent'
      : `color-mix(in srgb, var(--dsw-alias-border-l1) ${level}%, transparent)`
    return `${gate} ${bubble} {
  background-color: color-mix(in srgb, var(--dsw-specific-bubble) ${level}%, transparent);
}
${gate} ${ai} {
  background-color: color-mix(in srgb, ${assistantBackground} ${level}%, transparent);
}
${gate} ${bubble}, ${gate} ${ai} {
  border-color: ${border};${level === 0 ? '\n  box-shadow: none;' : ''}
}`
  }).join('\n')
  const glass = `html[data-cc-opacity][data-cc-glass] ${bubble}, html[data-cc-opacity][data-cc-glass] ${ai} {
  backdrop-filter: blur(8px);
}`
  return `
${user} .${message}_userStack { max-width: 86%; }
${bubble} {
  border-radius: 20px 20px 6px 20px;
  padding: ${compact ? '10px 16px' : '12px 18px'};
  line-height: 1.75;
  overflow-wrap: anywhere;
}
${scope} [data-chat-flow-kind="user"]:not([hidden]) { padding-block: ${compact ? '6px' : '12px'}; }
${ai} {
  box-sizing: border-box;
  min-width: 0;
  padding: ${compact ? '12px 16px' : '20px 24px'};
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 18px;
  background: ${assistantBackground};
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
${material}
${glass}`
}
