import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { useSyncExternalStore } from 'react'
import { ComfortController, type Status } from './controller.ts'
import { read, sanitize, STORAGE_KEY, type Settings } from './settings.ts'

export const inject = ['slots']

export function apply(ctx: Context): void {
  const load = (): Settings => {
    try { return read(window.localStorage) } catch { return sanitize(null) }
  }
  let current = load()
  let status: Status = 'unsupported'
  let revision = 0
  const listeners = new Set<() => void>()
  const publish = (): void => { revision++; for (const fn of listeners) fn() }
  let controller: ComfortController | undefined

  const set = (next: Settings): void => {
    current = sanitize(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)) } catch { /* Session-only settings. */ }
    controller?.update(current)
    publish()
  }

  function SettingsPanel() {
    useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn) } }, () => revision)
    const statuses: Record<Status, string> = {
      active: '已启用 / Active', off: '原生显示 / Off',
      unsupported: '当前组件构建未适配，保留原生显示 / Unsupported build',
      error: '增强已安全停止；重新加载插件后可重试 / Enhancement stopped',
    }
    return <section aria-label="DSH Chat Comfort" style={{ padding: 20, color: 'var(--dsw-alias-label-primary)' }}>
      <h2>DSH Chat Comfort</h2>
      <p>聊天气泡与阅读留白 / Chat bubbles and reading space</p>
      <p><label><input type="checkbox" checked={current.enabled}
        onChange={e => set({ ...current, enabled: e.target.checked })} /> 启用聊天美化 / Enable</label></p>
      <p><label>排版密度 / Density <select value={current.density}
        onChange={e => set({ ...current, density: e.target.value === 'compact' ? 'compact' : 'comfortable' })}>
        <option value="comfortable">舒适 / Comfortable</option><option value="compact">紧凑 / Compact</option>
      </select></label></p>
      <p role="status">{statuses[status]}</p>
      <p>阅读宽度和字体大小沿用 DSH 原生设置。配色沿用当前主题与 Appearance。</p>
    </section>
  }

  ctx.effect(() => {
    controller = new ComfortController(document, current, next => { status = next; publish() })
    const sync = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== STORAGE_KEY) return
      current = load(); controller?.update(current); publish()
    }
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('storage', sync); controller?.dispose(); controller = undefined; listeners.clear() }
  }, 'chat-comfort: scoped style lifecycle')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'chat-comfort', order: 1010, label: 'Chat Comfort',
  }, SettingsPanel))
}
