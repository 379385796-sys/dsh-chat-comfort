export const STORAGE_KEY = 'dsh-chat-comfort.settings.v1'

export interface Settings {
  density: 'comfortable' | 'compact'
  backgroundOpacity: number
  frostedGlass: boolean
}

export const DEFAULTS: Settings = {
  density: 'comfortable',
  backgroundOpacity: 100,
  frostedGlass: false,
}

export function sanitize(value: unknown): Settings {
  const v = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
  const opacity = v.backgroundOpacity
  return {
    density: v.density === 'compact' ? 'compact' : 'comfortable',
    backgroundOpacity: typeof opacity === 'number' && Number.isFinite(opacity)
      ? Math.min(100, Math.max(0, Math.round(opacity / 5) * 5))
      : DEFAULTS.backgroundOpacity,
    frostedGlass: v.frostedGlass === true,
  }
}

export type StorageIssue = 'unavailable' | 'invalid' | 'unsaved' | null
export function readWithStatus(storage: Pick<Storage, 'getItem'>): { settings: Settings; issue: StorageIssue } {
  let raw: string | null
  try { raw = storage.getItem(STORAGE_KEY) }
  catch { return { settings: { ...DEFAULTS }, issue: 'unavailable' } }
  try { return { settings: sanitize(JSON.parse(raw ?? 'null')), issue: null } }
  catch { return { settings: { ...DEFAULTS }, issue: 'invalid' } }
}
export function read(storage: Pick<Storage, 'getItem'>): Settings { return readWithStatus(storage).settings }
