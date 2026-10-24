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

export type Build = 'rc2' | 'rc3'
export function resolveBuild(doc: Document): Build | undefined {
  for (const [build, fingerprints] of [['rc2', FINGERPRINTS], ['rc3', RC3_FINGERPRINTS]] as const) {
    if (Object.entries(fingerprints).every(([file, markers]) => {
      const css = doc.head.querySelector<HTMLStyleElement>(
        `style[data-plugin-css="@deepseek-ai/dsh-client-ui-chat/${file}"]`)?.textContent ?? ''
      return markers.every((marker: string) => css.includes(marker))
    })) return build
  }
  return undefined
}
export function supported(doc: Document): boolean { return resolveBuild(doc) !== undefined }

export function sheet(settings: Settings, build: Build = 'rc2'): string {
  const chat = build === 'rc3' ? 'V4vHZW' : 'xz4KEq'
  const message = build === 'rc3' ? 'LOmM4q' : 'cJsG2q'
  const aiRoot = build === 'rc3' ? ':is(.xMeOpW_root, .ydEAna_root)' : ':is(.v5IAXa_root, .ydEAna_root)'
  const aiBody = build === 'rc3' ? ':is(.xMeOpW_body, .ydEAna_body)' : ':is(.v5IAXa_body, .ydEAna_body)'
  const scope = `.${chat}_column[data-chat-flow]`
  const user = `${scope} [data-chat-flow-kind="user"]`
  // dsh-smooth-stream 0.7.0 replaces the native assistant-step renderer and
  // renders its own CSS-module root. Keep the native target as the fallback.
  const ai = `${scope} [data-chat-flow-kind="assistant-step"] ${aiRoot}`
  const compact = settings.density === 'compact'
  return `
${user} .${message}_userStack { max-width: 86%; }
${user} .${message}_bubble {
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
`
}
