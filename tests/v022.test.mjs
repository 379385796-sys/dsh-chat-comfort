import { test } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { RC3_FINGERPRINTS, V022_FINGERPRINTS, resolveBuild } from '../lib/testing/adapter.js'
import { ComfortController, STYLE_ID } from '../lib/testing/controller.js'
import { DEFAULTS } from '../lib/testing/settings.js'

/**
 * DSH 0.2.2-rc.1 document: same CSS-module hashes as RC3, but the right-aligned
 * user bubble now comes from the shared UserMessageBubble primitive and carries
 * `data-message-bubble` instead of `.LOmM4q_bubble`.
 */
function host(markers = V022_FINGERPRINTS, bubble = '<div data-message-bubble="">中文 Ω</div>') {
  const dom = new JSDOM(`<html><head></head><body>
    <div class="V4vHZW_column" data-chat-flow>
      <div data-chat-flow-kind="user"><div class="LOmM4q_userRow"><div class="LOmM4q_userStack">${bubble}</div></div></div>
      <div data-chat-flow-kind="assistant-step"><div class="xMeOpW_root"><div class="xMeOpW_body">Long answer</div></div></div>
      <div data-chat-flow-kind="tool"><button id="tool">Tool</button></div>
    </div><aside><button id="menu">More</button></aside></body></html>`)
  for (const [file, values] of Object.entries(markers)) {
    const style = dom.window.document.createElement('style')
    style.dataset.pluginCss = `@deepseek-ai/dsh-client-ui-chat/${file}`
    style.textContent = values.map(x => x + '}').join('')
    dom.window.document.head.append(style)
  }
  return dom
}

test('0.2.2 fingerprints select the v022 build and style the shared bubble primitive', () => {
  const dom = host(), doc = dom.window.document
  assert.equal(resolveBuild(doc), 'v022')
  const controller = new ComfortController(doc, DEFAULTS)
  assert.equal(dom.window.getComputedStyle(doc.querySelector('[data-message-bubble]')).padding, '12px 18px')
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.xMeOpW_root')).padding, '20px 24px')
  controller.dispose()
  assert.equal(doc.getElementById(STYLE_ID), null)
  dom.window.close()
})

test('0.2.2 compact density keeps the same targets with tighter spacing', () => {
  const dom = host(), doc = dom.window.document
  const controller = new ComfortController(doc, { ...DEFAULTS, density: 'compact' })
  assert.equal(dom.window.getComputedStyle(doc.querySelector('[data-message-bubble]')).padding, '10px 16px')
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.xMeOpW_root')).padding, '12px 16px')
  controller.dispose(); dom.window.close()
})

test('a 0.2.2 document is never mistaken for RC3', () => {
  const dom = host(), doc = dom.window.document
  assert.notEqual(resolveBuild(doc), 'rc3')
  // The RC3 module class is gone, so RC3 rules must not be generated for it.
  const controller = new ComfortController(doc, DEFAULTS)
  assert.doesNotMatch(doc.getElementById(STYLE_ID).textContent, /_bubble/)
  controller.dispose(); dom.window.close()
})

test('an RC3 document with the module bubble still resolves to RC3', () => {
  const dom = host(RC3_FINGERPRINTS, '<div class="LOmM4q_bubble">中文 Ω</div>'), doc = dom.window.document
  assert.equal(resolveBuild(doc), 'rc3')
  const controller = new ComfortController(doc, DEFAULTS)
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.LOmM4q_bubble')).padding, '12px 18px')
  controller.dispose(); dom.window.close()
})

test('a 0.2.2 document without the primitive fails closed instead of guessing', () => {
  const dom = host(V022_FINGERPRINTS, '<div class="unknown-bubble">中文 Ω</div>'), doc = dom.window.document
  // Fingerprints still match: the build is recognized, and only the primitive is styled.
  assert.equal(resolveBuild(doc), 'v022')
  const controller = new ComfortController(doc, DEFAULTS)
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.unknown-bubble')).padding, '')
  controller.dispose(); dom.window.close()
})
