import { test } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { ComfortController, STYLE_ID } from '../lib/testing/controller.js'
import { FINGERPRINTS } from '../lib/testing/adapter.js'
import { read, sanitize, DEFAULTS } from '../lib/testing/settings.js'

function host() {
  const dom = new JSDOM('<html><head></head><body><main><textarea>untouched</textarea></main></body></html>')
  const doc = dom.window.document
  for (const [name, markers] of Object.entries(FINGERPRINTS)) {
    const style = doc.createElement('style')
    style.dataset.pluginCss = `@deepseek-ai/dsh-client-ui-chat/${name}`
    style.textContent = markers.map(x => `${x} }`).join('\n')
    doc.head.append(style)
  }
  return { dom, doc }
}
const tick = () => new Promise(resolve => setTimeout(resolve, 0))

test('invalid settings, denied storage and injection values use bounded defaults', () => {
  assert.deepEqual(sanitize(null), DEFAULTS)
  assert.deepEqual(sanitize({ enabled: 'false', density: '};body{display:none}' }), DEFAULTS)
  assert.deepEqual(read({ getItem() { throw Error('denied') } }), DEFAULTS)
  assert.deepEqual(read({ getItem: () => '{invalid' }), DEFAULTS)
  assert.deepEqual(sanitize({ enabled: false, density: 'compact' }), { enabled: false, density: 'compact' })
})

test('enable, density change, disable, re-enable and dispose alter only the owned sheet', async () => {
  const { dom, doc } = host()
  const body = doc.body.outerHTML, before = doc.head.innerHTML
  const statuses = []
  const c = new ComfortController(doc, DEFAULTS, s => statuses.push(s))
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  c.update({ ...DEFAULTS, density: 'compact' })
  assert.match(doc.getElementById(STYLE_ID).textContent, /12px 16px/)
  c.update({ ...DEFAULTS, enabled: false })
  assert.equal(doc.head.innerHTML, before)
  c.update(DEFAULTS)
  await tick()
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  c.dispose(); c.dispose()
  c.update(DEFAULTS)
  await tick()
  assert.equal(doc.head.innerHTML, before)
  assert.equal(doc.body.outerHTML, body)
  assert.deepEqual(statuses, ['active', 'off', 'active'])
  dom.window.close()
})

test('late host CSS is recognized and changed/removed fingerprints retract enhancements', async () => {
  const { dom, doc } = host()
  const style = doc.head.firstElementChild
  style.remove()
  const statuses = []
  const c = new ComfortController(doc, DEFAULTS, s => statuses.push(s))
  assert.equal(statuses.at(-1), 'unsupported')
  doc.head.append(style); await tick()
  assert.equal(statuses.at(-1), 'active')
  style.textContent = '.future_build {}'; await tick()
  assert.equal(statuses.at(-1), 'unsupported')
  assert.equal(doc.getElementById(STYLE_ID), null)
  c.dispose(); dom.window.close()
})

test('style collision fails closed without touching the foreign element', () => {
  const { dom, doc } = host()
  const foreign = doc.createElement('style'); foreign.id = STYLE_ID; foreign.textContent = '/* foreign */'
  doc.head.append(foreign)
  const statuses = []
  const c = new ComfortController(doc, DEFAULTS, s => statuses.push(s))
  assert.equal(statuses.at(-1), 'error')
  c.dispose()
  assert.equal(doc.getElementById(STYLE_ID), foreign)
  dom.window.close()
})

test('head insertion error rolls back and disposed controller cannot reappear', async () => {
  const { dom, doc } = host()
  const append = doc.head.append.bind(doc.head)
  doc.head.append = () => { throw Error('blocked') }
  const statuses = []
  const c = new ComfortController(doc, DEFAULTS, s => statuses.push(s))
  assert.equal(statuses.at(-1), 'error')
  assert.equal(doc.getElementById(STYLE_ID), null)
  doc.head.append = append
  c.update(DEFAULTS); await tick()
  assert.equal(doc.getElementById(STYLE_ID), null)
  c.dispose(); dom.window.close()
})
