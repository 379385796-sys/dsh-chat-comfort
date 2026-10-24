import { test } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { FINGERPRINTS, RC3_FINGERPRINTS, resolveBuild } from '../lib/testing/adapter.js'
import { ComfortController, STYLE_ID } from '../lib/testing/controller.js'
import { DEFAULTS } from '../lib/testing/settings.js'

function host(markers = RC3_FINGERPRINTS) {
  const dom = new JSDOM(`<html><head></head><body>
    <div class="V4vHZW_column" data-chat-flow>
      <div data-chat-flow-kind="user"><div class="LOmM4q_userStack"><div class="LOmM4q_bubble">中文 Ω</div></div></div>
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

test('RC3 fingerprints select RC3 bubble and assistant rules, preserving menus and tools', () => {
  const dom = host(), doc = dom.window.document
  assert.equal(resolveBuild(doc), 'rc3')
  const menuPadding = dom.window.getComputedStyle(doc.querySelector('#menu')).padding
  const toolPadding = dom.window.getComputedStyle(doc.querySelector('#tool')).padding
  const controller = new ComfortController(doc, DEFAULTS)
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.LOmM4q_bubble')).padding, '12px 18px')
  assert.equal(dom.window.getComputedStyle(doc.querySelector('.xMeOpW_root')).padding, '20px 24px')
  assert.equal(dom.window.getComputedStyle(doc.querySelector('#menu')).padding, menuPadding)
  assert.equal(dom.window.getComputedStyle(doc.querySelector('#tool')).padding, toolPadding)
  controller.update({ ...DEFAULTS, enabled: false })
  assert.equal(doc.getElementById(STYLE_ID), null)
  controller.update(DEFAULTS)
  assert.equal(doc.querySelectorAll('#' + STYLE_ID).length, 1)
  controller.dispose()
  assert.equal(doc.getElementById(STYLE_ID), null)
  dom.window.close()
})

test('mixed RC2/RC3 fingerprints fail closed', () => {
  const dom = host({ ...RC3_FINGERPRINTS, 'MessageItem.module.css': FINGERPRINTS['MessageItem.module.css'] })
  assert.equal(resolveBuild(dom.window.document), undefined)
  const controller = new ComfortController(dom.window.document, DEFAULTS)
  assert.equal(dom.window.document.getElementById(STYLE_ID), null)
  controller.dispose(); dom.window.close()
})
