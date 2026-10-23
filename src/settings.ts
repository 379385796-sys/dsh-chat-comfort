export const STORAGE_KEY = 'dsh-chat-comfort.settings.v1'
export interface Settings { enabled: boolean; density: 'comfortable' | 'compact' }
export const DEFAULTS: Settings = { enabled: true, density: 'comfortable' }

export function sanitize(value: unknown): Settings {
  const v = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
  return { enabled: typeof v.enabled === 'boolean' ? v.enabled : DEFAULTS.enabled,
    density: v.density === 'compact' ? 'compact' : 'comfortable' }
}

export function read(storage: Pick<Storage, 'getItem'>): Settings {
  try { return sanitize(JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')) }
  catch { return { ...DEFAULTS } }
}
