import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { JSDOM } from 'jsdom'
import { FINGERPRINTS } from '../lib/testing/adapter.js'
const require = createRequire(import.meta.url)

test('distributed client applies through official loader shape and disposal cleans style and storage listener', async () => {
  const dom = new JSDOM('<html><head></head><body><textarea></textarea></body></html>', { url: 'http://comfort.test', runScripts: 'outside-only' })
  const { window } = dom, doc = window.document
  for (const [name, markers] of Object.entries(FINGERPRINTS)) {
    const s = doc.createElement('style')
    s.dataset.pluginCss = `@deepseek-ai/dsh-client-ui-chat/${name}`
    s.textContent = markers.map(x => `${x} }`).join('\n'); doc.head.append(s)
  }
  window.localStorage.setItem('dsh-ui-appearance.settings', 'preserve-me')
  let plugin, panel, registered = false
  window.__ModuleLoader__ = { load({ id, factory }) { assert.equal(id, 'dsh-chat-comfort'); plugin = factory(require) } }
  window.eval(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'))
  const effects = []
  const ctx = {
    effect(setup) { const dispose = setup(); effects.push(dispose); return dispose },
    slots: {
      inject(name, setup) { assert.equal(name, 'settings.section'); effects.push(setup()) },
      register(options, component) { assert.equal(options.id, 'chat-comfort'); panel = component; registered = true; return () => { registered = false } },
    },
  }
  plugin.apply(ctx)
  assert.equal(typeof panel, 'function')
  assert(registered)
  assert(doc.getElementById('dsh-chat-comfort-style-v1'))
  window.localStorage.setItem('dsh-chat-comfort.settings.v1', '{"enabled":false}')
  window.dispatchEvent(new window.StorageEvent('storage', { key: 'dsh-chat-comfort.settings.v1' }))
  assert.equal(doc.getElementById('dsh-chat-comfort-style-v1'), null)
  window.localStorage.setItem('dsh-chat-comfort.settings.v1', '{"enabled":true}')
  window.dispatchEvent(new window.StorageEvent('storage', { key: 'dsh-chat-comfort.settings.v1' }))
  assert(doc.getElementById('dsh-chat-comfort-style-v1'))
  for (const dispose of effects.reverse()) dispose?.()
  assert.equal(registered, false)
  window.dispatchEvent(new window.StorageEvent('storage', { key: 'dsh-chat-comfort.settings.v1' }))
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.equal(doc.getElementById('dsh-chat-comfort-style-v1'), null)
  assert.equal(window.localStorage.getItem('dsh-ui-appearance.settings'), 'preserve-me')
  assert.equal(doc.body.innerHTML, '<textarea></textarea>')
  dom.window.close()
})
