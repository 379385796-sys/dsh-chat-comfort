export const STORAGE_KEY = 'dsh-chat-comfort.settings.v1'
export interface Settings { enabled: boolean; density: 'comfortable' | 'compact' }
export const DEFAULTS: Settings = { enabled: true, density: 'comfortable' }

export function sanitize(value: unknown): Settings {
  const v = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
  return { enabled: typeof v.enabled === 'boolean' ? v.enabled : DEFAULTS.enabled,
    density: v.density === 'compact' ? 'compact' : 'comfortable' }
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
