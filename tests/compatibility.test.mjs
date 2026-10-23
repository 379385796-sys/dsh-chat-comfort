import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { FINGERPRINTS, sheet } from '../lib/testing/adapter.js'
import { ComfortController, STYLE_ID } from '../lib/testing/controller.js'
import { DEFAULTS } from '../lib/testing/settings.js'

const nativeRoot = '<div class="v5IAXa_root"><div class="v5IAXa_body">AI 正文</div></div>'
const smoothRoot = '<div class="ydEAna_root"><div class="dsh-follow-host"><div class="ydEAna_body">AI 正文</div></div></div>'

function host(assistantInner, extra = '') {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <div class="xz4KEq_column" data-chat-flow>
      <div data-chat-flow-kind="user"><div class="cJsG2q_userRow"><div class="cJsG2q_userStack"><div class="cJsG2q_bubble">用户消息</div></div></div></div>
      <div data-chat-flow-kind="assistant-step">${assistantInner}</div>
    </div>${extra}</body></html>`)
  const doc = dom.window.document
  for (const [name, markers] of Object.entries(FINGERPRINTS)) {
    const style = doc.createElement('style')
    style.dataset.pluginCss = `@deepseek-ai/dsh-client-ui-chat/${name}`
    style.textContent = markers.map(x => `${x} }`).join('\n')
    doc.head.append(style)
  }
  return { dom, doc }
}

function applySheet(doc, density = 'comfortable') {
  const style = doc.createElement('style')
  style.textContent = sheet({ ...DEFAULTS, density })
  doc.head.append(style)
  return style
}

test('native and Smooth Stream assistant roots both receive the reading surface', () => {
  for (const [name, inner, rootSelector, bodySelector] of [
    ['native', nativeRoot, '.v5IAXa_root', '.v5IAXa_body'],
    ['smooth-stream', smoothRoot, '.ydEAna_root', '.ydEAna_body'],
  ]) {
    const { dom, doc } = host(inner)
    applySheet(doc)
    const root = doc.querySelector(`[data-chat-flow-kind="assistant-step"] ${rootSelector}`)
    assert(root, `${name}: root missing`)
    const style = doc.defaultView.getComputedStyle(root)
    assert.equal(style.padding, '20px 24px', `${name}: padding`)
    assert.equal(style.borderRadius, '18px', `${name}: radius`)
    assert.equal(style.lineHeight, '1.8', `${name}: line-height`)
    const body = doc.querySelector(`[data-chat-flow-kind="assistant-step"] ${bodySelector}`)
    assert(body, `${name}: body missing`)
    assert.match(doc.defaultView.getComputedStyle(body).minWidth, /^(0|0px)$/, `${name}: body min-width`)
    dom.window.close()
  }
})

test('the native user bubble stays on its own styling path', () => {
  for (const inner of [nativeRoot, smoothRoot]) {
    const { dom, doc } = host(inner)
    applySheet(doc)
    const bubble = doc.querySelector('[data-chat-flow-kind="user"] .cJsG2q_bubble')
    assert(bubble)
    const style = doc.defaultView.getComputedStyle(bubble)
    assert.equal(style.padding, '12px 18px')
    assert.equal(style.borderRadius, '20px 20px 6px 20px')
    assert.equal(style.lineHeight, '1.75')
    dom.window.close()
  }
})

test('the generated sheet keeps both root and body fallbacks', () => {
  const css = sheet(DEFAULTS)
  assert.match(css, /:is\(\.v5IAXa_root, \.ydEAna_root\)/)
  assert.match(css, /:is\(\.v5IAXa_body, \.ydEAna_body\)/)
  assert.doesNotMatch(css, /assistant-step\s*>\s*div/)
  assert.doesNotMatch(css, /!important/)
})

test('both selectors are scoped to the chat flow and the assistant-step kind', () => {
  const extra = `
    <div data-chat-flow-kind="assistant-step"><div class="ydEAna_root" id="outside-flow"></div></div>
    <div data-chat-flow-kind="user"><div class="ydEAna_root" id="wrong-kind"></div></div>`
  const { dom, doc } = host(nativeRoot, extra)
  applySheet(doc)
  assert.equal(doc.querySelectorAll('.xz4KEq_column[data-chat-flow] [data-chat-flow-kind="assistant-step"] :is(.v5IAXa_root, .ydEAna_root)').length, 1)
  assert.equal(doc.getElementById('outside-flow').matches('.xz4KEq_column[data-chat-flow] [data-chat-flow-kind="assistant-step"] .ydEAna_root'), false)
  assert.equal(doc.getElementById('wrong-kind').matches('.xz4KEq_column[data-chat-flow] [data-chat-flow-kind="assistant-step"] .ydEAna_root'), false)
  dom.window.close()
})

test('comfortable and compact densities keep their expected spacing', () => {
  for (const [density, aiPadding, userPadding] of [
    ['comfortable', '20px 24px', '12px 18px'],
    ['compact', '12px 16px', '10px 16px'],
  ]) {
    const { dom, doc } = host(smoothRoot)
    applySheet(doc, density)
    const ai = doc.querySelector('.ydEAna_root')
    const user = doc.querySelector('.cJsG2q_bubble')
    assert.equal(doc.defaultView.getComputedStyle(ai).padding, aiPadding, `${density}: AI padding`)
    assert.equal(doc.defaultView.getComputedStyle(user).padding, userPadding, `${density}: user padding`)
    dom.window.close()
  }
})

test('controller keeps one style tag across density changes and toggle cycles', () => {
  const { dom, doc } = host(nativeRoot)
  const controller = new ComfortController(doc, DEFAULTS)
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  const style = doc.getElementById(STYLE_ID)
  controller.update({ ...DEFAULTS, density: 'compact' })
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  assert.match(style.textContent, /12px 16px/)
  controller.update({ ...DEFAULTS, enabled: false })
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 0)
  controller.update(DEFAULTS)
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  controller.dispose()
  assert.equal(doc.querySelectorAll(`#${STYLE_ID}`).length, 0)
  dom.window.close()
})

test('the distributed client contains both compatibility selectors', async () => {
  const client = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  assert.match(client, /:is\(\.v5IAXa_root, \.ydEAna_root\)/)
  assert.match(client, /:is\(\.v5IAXa_body, \.ydEAna_body\)/)
})
