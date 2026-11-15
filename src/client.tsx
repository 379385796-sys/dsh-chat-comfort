import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { useId, useSyncExternalStore } from 'react'
import { ComfortController, type Status } from './controller.ts'
import { readWithStatus, sanitize, STORAGE_KEY, type Settings, type StorageIssue } from './settings.ts'

export const inject = ['slots', 'locale']
const zh = { title: 'Chat Comfort', intro: '舒适气泡，清晰阅读', density: '排版密度', densityHint: '切换后立即生效；字号和阅读宽度沿用宿主设置。', comfortable: '舒适', compact: '紧凑', opacity: '背景不透明度', glass: '毛玻璃效果', glassHint: '背景不透明度低于 100% 时可见。', active: '阅读优化已启用', unsupported: '当前组件构建未适配，已保留原生显示。', error: '增强已安全停止；重新加载插件后可重试。', unavailable: '无法读取偏好，当前使用默认设置；修改可能仅在本次生效。', invalid: '已保存的偏好无法解析，当前使用默认设置；再次修改可重新保存。', unsaved: '本次设置已生效，但未能保存。重启后可能恢复原设置；再次修改可重试保存。', theme: '配色跟随当前主题与 Appearance。' }
const en: typeof zh = { title: 'Chat Comfort', intro: 'Comfortable bubbles, clearer reading', density: 'Reading density', densityHint: 'Applies immediately. Text size and reading width follow DSH settings.', comfortable: 'Comfortable', compact: 'Compact', opacity: 'Background opacity', glass: 'Frosted glass', glassHint: 'Visible when background opacity is below 100%.', active: 'Reading enhancements are active', unsupported: 'This component build is unsupported. The native layout is retained.', error: 'Enhancement stopped safely. Reload the plugin to retry.', unavailable: 'Preferences could not be read. Defaults are active; changes may last only for this session.', invalid: 'Saved preferences could not be parsed. Defaults are active; change a setting to save again.', unsaved: 'Applied for this session, but could not be saved. Restarting may restore earlier preferences; change a setting to retry.', theme: 'Colors follow the current theme and Appearance.' }
declare module '@deepseek-ai/dsh-client-ui-slots' { interface LocaleNamespaceMap { 'chat-comfort': keyof typeof zh } }
const PANEL_CSS = `
.cc-settings{max-width:720px;min-width:0;padding:20px;color:var(--dsw-alias-label-primary);font:inherit}
.cc-settings h2{margin:0;font:inherit;font-size:18px;font-weight:600;line-height:1.4}
.cc-intro{margin:6px 0 22px;color:var(--dsw-alias-label-secondary);font-size:13px}
.cc-setting{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px 0;border-top:1px solid var(--dsw-alias-border-l2)}
.cc-copy{display:flex;flex-direction:column;gap:5px;min-width:0}.cc-copy strong{font-size:13px;font-weight:500}.cc-copy small,.cc-theme{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}
.cc-settings input[type="checkbox"]{width:16px;height:16px;flex:none;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.cc-range{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;flex:0 1 220px}
.cc-range input{width:100%;min-width:0;margin:0;accent-color:var(--dsw-alias-brand-primary)}
.cc-range span{flex:0 0 4ch;text-align:end;font-size:13px;font-variant-numeric:tabular-nums}
.cc-density{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));flex:0 1 210px;min-width:0;padding:3px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-2)}
.cc-density::before{content:'';position:absolute;inset:3px auto 3px 3px;width:calc(50% - 3px);box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:inherit;background:var(--dsw-alias-bg-layer-1);pointer-events:none;transition:transform 140ms ease-out}
.cc-density[data-density="compact"]::before{transform:translateX(100%)}
.cc-density label{position:relative;display:flex;min-width:0}
.cc-density input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.cc-density span{display:grid;place-items:center;width:100%;min-height:28px;padding:0 4px;box-sizing:border-box;border-radius:var(--dsw-radius-md,8px);color:var(--dsw-alias-label-secondary);font-size:13px;text-align:center;overflow-wrap:anywhere}
.cc-density input:checked + span,.cc-density input:hover + span{color:var(--dsw-alias-label-primary)}
.cc-density input:checked + span{font-weight:600}
.cc-settings :focus-visible,.cc-density input:focus-visible + span{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:3px}
.cc-status{min-height:24px;margin:16px 0 0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.cc-storage{margin:8px 0 0;padding:10px 12px;border-left:2px solid var(--dsw-alias-state-warning-primary,var(--dsw-alias-label-secondary));border-radius:0 6px 6px 0;background:var(--dsw-alias-bg-layer-2);font-size:12px;line-height:1.6;animation:cc-feedback-in 140ms ease-out}
.cc-theme{margin-top:10px}@keyframes cc-feedback-in{from{opacity:0}to{opacity:1}}
@media(max-width:440px){.cc-settings{padding:12px}.cc-setting{gap:12px;align-items:flex-start}.cc-density{flex:0 1 170px}}
@media(forced-colors:active){
  .cc-density::before{forced-color-adjust:none;background:Highlight;border-color:Highlight}
  .cc-density input:checked + span{forced-color-adjust:none;color:HighlightText}
  .cc-density input:focus-visible + span{outline-color:CanvasText}
}
@media(prefers-reduced-motion:reduce){.cc-density::before,.cc-storage{animation:none;transition:none}}
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
    const densityId = useId()
    return <section aria-label="Chat Comfort" className="cc-settings">
      <h2>{t('title')}</h2><p className="cc-intro">{t('intro')}</p>
      <div className="cc-setting">
        <span className="cc-copy"><strong id={densityId}>{t('density')}</strong><small id={`${densityId}-hint`}>{t('densityHint')}</small></span>
        <div className="cc-density" role="radiogroup" aria-labelledby={densityId} aria-describedby={`${densityId}-hint`}
          data-density={current.density}>
          {(['comfortable', 'compact'] as const).map(density => (
            <label key={density}>
              <input type="radio" name={densityId} value={density} checked={current.density === density}
                onChange={() => set({ ...current, density })}/>
              <span>{t(density)}</span>
            </label>
          ))}
        </div>
      </div>
      <label className="cc-setting">
        <span className="cc-copy"><strong>{t('opacity')}</strong></span>
        <span className="cc-range">
          <input type="range" min={0} max={100} step={5} value={current.backgroundOpacity}
            aria-valuetext={`${current.backgroundOpacity}%`}
            onChange={e => set({ ...current, backgroundOpacity: e.target.valueAsNumber })}/>
          <span aria-hidden="true">{current.backgroundOpacity}%</span>
        </span>
      </label>
      <label className="cc-setting">
        <span className="cc-copy"><strong>{t('glass')}</strong><small>{t('glassHint')}</small></span>
        <input type="checkbox" checked={current.frostedGlass}
          onChange={e => set({ ...current, frostedGlass: e.target.checked })}/>
      </label>
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
