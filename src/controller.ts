import { FINGERPRINTS, resolveBuild, sheet } from './adapter.ts'
import type { Settings } from './settings.ts'

export const STYLE_ID = 'dsh-chat-comfort-style-v1'
export type Status = 'active' | 'off' | 'unsupported' | 'error'

const HOST_SHEETS = new Set(Object.keys(FINGERPRINTS).map(file => `@deepseek-ai/dsh-client-ui-chat/${file}`))
const OWN_SELECTOR = `[id="${STYLE_ID}"]`
const RELEVANT_SELECTOR = [OWN_SELECTOR,
  ...Array.from(HOST_SHEETS, name => `style[data-plugin-css="${name}"]`)].join(',')

/** Owns only a style node and a head observer; never inspects message content. */
export class ComfortController {
  private style: HTMLStyleElement | undefined
  private observer: MutationObserver | undefined
  private disposed = false
  private failed = false
  private status: Status | undefined

  constructor(private doc: Document, private settings: Settings,
    private report: (status: Status) => void = () => {}) {
    this.refresh()
    if (!this.failed) {
      try {
        const Observer = doc.defaultView!.MutationObserver
        this.observer = new Observer(records => {
          if (this.disposed || this.failed || !this.settings.enabled) return
          try { if (records.some(record => this.affectsStyle(record))) this.refresh() }
          catch { this.fail() }
        })
        // No transcript observer; streaming adds no work for this plugin.
        this.observer.observe(doc.head, { childList: true, subtree: true, characterData: true,
          attributes: true, attributeFilter: ['id', 'data-plugin-css'], attributeOldValue: true })
      } catch { this.fail() }
    }
  }

  update(settings: Settings): void { this.settings = settings; this.refresh() }

  private affectsStyle(record: MutationRecord): boolean {
    // Text replacement targets the style; characterData targets its text node.
    // Identity also recognizes our sheet if its id was changed externally.
    const target = record.target
    if (target === this.style || this.style?.contains(target)) return true
    const element = target.nodeType === 1 ? target as Element : target.parentElement
    if (element?.closest(RELEVANT_SELECTOR)) return true
    if (record.type === 'attributes') {
      // The current selector no longer matches after removing/renaming an identity.
      return (record.attributeName === 'id' && record.oldValue === STYLE_ID)
        || (record.attributeName === 'data-plugin-css' && element?.tagName === 'STYLE'
          && HOST_SHEETS.has(record.oldValue ?? ''))
    }
    if (record.type !== 'childList') return false
    return [...record.addedNodes, ...record.removedNodes].some(node => {
      if (node === this.style || (this.style !== undefined && node.contains(this.style))) return true
      if (node.nodeType !== 1) return false
      const changed = node as Element
      return changed.matches(RELEVANT_SELECTOR)
        || (changed.firstElementChild !== null && changed.querySelector(RELEVANT_SELECTOR) !== null)
    })
  }

  private publish(status: Status): void {
    if (this.status === status) return
    this.status = status
    this.report(status)
  }

  private remove(): void { this.style?.remove(); this.style = undefined }

  private fail(): void {
    this.failed = true
    this.observer?.disconnect()
    this.remove()
    this.publish('error')
  }

  private refresh(): void {
    if (this.disposed || this.failed) return
    try {
      if (!this.settings.enabled) { this.remove(); this.publish('off'); return }
      const build = resolveBuild(this.doc)
      if (build === undefined) { this.remove(); this.publish('unsupported'); return }
      // Collision fails closed; do not delete or replace somebody else's node.
      const existing = this.doc.getElementById(STYLE_ID)
      if (existing !== null && existing !== this.style) throw new Error('style id collision')
      // getElementById alone can return our node when a duplicate follows it.
      if (this.doc.head.querySelectorAll(OWN_SELECTOR).length > (this.style?.isConnected ? 1 : 0)) {
        throw new Error('duplicate style id')
      }
      const css = sheet(this.settings, build)
      if (this.style === undefined) {
        this.style = this.doc.createElement('style')
        this.style.id = STYLE_ID
        this.style.dataset.plugin = 'dsh-chat-comfort'
        this.style.textContent = css
        this.doc.head.append(this.style)
      } else {
        if (this.style.id !== STYLE_ID) this.style.id = STYLE_ID
        if (this.style.textContent !== css) this.style.textContent = css
        if (!this.style.isConnected) this.doc.head.append(this.style)
      }
      this.publish('active')
    } catch { this.fail() }
  }

  dispose(): void {
    this.disposed = true
    this.observer?.disconnect()
    this.observer = undefined
    this.remove()
  }
}
