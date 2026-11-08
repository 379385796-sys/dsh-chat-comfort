import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { useSyncExternalStore } from 'react'
import { ComfortController, type Status } from './controller.ts'
import { readWithStatus, sanitize, STORAGE_KEY, type Settings, type StorageIssue } from './settings.ts'

export const inject = ['slots', 'locale']
const zh = { title: 'Chat Comfort', intro: '舒适气泡，清晰阅读', enable: '启用阅读优化', enableHint: '调整气泡与留白，保留原生消息交互。', density: '排版密度', densityHint: '切换后立即生效；字号和阅读宽度沿用宿主设置。', comfortable: '舒适', compact: '紧凑', active: '阅读优化已启用', off: '当前使用原生显示', unsupported: '当前组件构建未适配，已保留原生显示。', error: '增强已安全停止；重新加载插件后可重试。', unavailable: '无法读取偏好，当前使用默认设置；修改可能仅在本次生效。', invalid: '已保存的偏好无法解析，当前使用默认设置；再次修改可重新保存。', unsaved: '本次设置已生效，但未能保存。重启后可能恢复原设置；再次修改可重试保存。', theme: '配色跟随当前主题与 Appearance。' }
const en: typeof zh = { title: 'Chat Comfort', intro: 'Comfortable bubbles, clearer reading', enable: 'Enable reading enhancements', enableHint: 'Adjust bubbles and spacing while retaining native message controls.', density: 'Reading density', densityHint: 'Applies immediately. Text size and reading width follow DSH settings.', comfortable: 'Comfortable', compact: 'Compact', active: 'Reading enhancements are active', off: 'Using the native layout', unsupported: 'This component build is unsupported. The native layout is retained.', error: 'Enhancement stopped safely. Reload the plugin to retry.', unavailable: 'Preferences could not be read. Defaults are active; changes may last only for this session.', invalid: 'Saved preferences could not be parsed. Defaults are active; change a setting to save again.', unsaved: 'Applied for this session, but could not be saved. Restarting may restore earlier preferences; change a setting to retry.', theme: 'Colors follow the current theme and Appearance.' }
declare module '@deepseek-ai/dsh-client-ui-slots' { interface LocaleNamespaceMap { 'chat-comfort': keyof typeof zh } }
const PANEL_CSS = `
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
`

export function apply(ctx: Context): void {
  let storageIssue: StorageIssue = null
  const load = (): Settings => {
    try { const result = readWithStatus(window.localStorage); storageIssue = result.issue; return result.settings }
    catch { storageIssue = 'unavailable'; return sanitize(null) }
  }
  let current = load()
  let status: Status = 'unsupported'
  let revision = 0
  const listeners = new Set<() => void>()
  const publish = (): void => { revision++; for (const fn of listeners) fn() }
  let controller: ComfortController | undefined
  const set = (next: Settings): void => {
    current = sanitize(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)); storageIssue = null }
    catch { storageIssue = 'unsaved' }
    controller?.update(current); publish()
  }
  function SettingsPanel({ t = (key: keyof typeof zh) => zh[key] }: { t?: (key: keyof typeof zh) => string }) {
    useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn) } }, () => revision)
    return <section aria-label="Chat Comfort" className="cc-settings">
      <h2>{t('title')}</h2><p className="cc-intro">{t('intro')}</p>
      <label className="cc-setting"><span className="cc-copy"><strong>{t('enable')}</strong><small>{t('enableHint')}</small></span><input type="checkbox" checked={current.enabled} onChange={e => set({ ...current, enabled: e.target.checked })}/></label>
      <label className="cc-setting"><span className="cc-copy"><strong>{t('density')}</strong><small>{t('densityHint')}</small></span><select disabled={!current.enabled} value={current.density} onChange={e => set({ ...current, density: e.target.value === 'compact' ? 'compact' : 'comfortable' })}><option value="comfortable">{t('comfortable')}</option><option value="compact">{t('compact')}</option></select></label>
      <p className="cc-status" role="status">{t(status)}</p>
      {storageIssue && <p className="cc-storage" role="status">{t(storageIssue)}</p>}
      <p className="cc-theme">{t('theme')}</p>
    </section>
  }
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.pluginCss = 'dsh-chat-comfort/panel.css'; style.textContent = PANEL_CSS; document.head.append(style)
    return () => { style.remove() }
  }, 'chat-comfort: settings styles')
  ctx.effect(() => ctx.locale.register('chat-comfort', { zh, en }), 'chat-comfort: locale')
  ctx.effect(() => {
    controller = new ComfortController(document, current, next => { status = next; publish() })
    const sync = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== STORAGE_KEY) return
      current = load(); controller?.update(current); publish()
    }
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('storage', sync); controller?.dispose(); controller = undefined; listeners.clear() }
  }, 'chat-comfort: scoped style lifecycle')
  ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'chat-comfort', order: 1010, locale: 'chat-comfort', label: 'Chat Comfort' }, SettingsPanel))
}
