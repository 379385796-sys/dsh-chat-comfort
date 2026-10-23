import { test } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { ComfortController, STYLE_ID } from '../lib/testing/controller.js'
import { FINGERPRINTS } from '../lib/testing/adapter.js'
import { DEFAULTS } from '../lib/testing/settings.js'

const tick = () => new Promise(resolve => setTimeout(resolve, 0))

function fixture() {
  const dom = new JSDOM('<html><head></head><body><textarea></textarea></body></html>')
  const doc = dom.window.document
  const modules = Object.entries(FINGERPRINTS).map(([name, markers]) => {
    const style = doc.createElement('style')
    style.dataset.pluginCss = `@deepseek-ai/dsh-client-ui-chat/${name}`
    style.textContent = markers.map(x => `${x} }`).join('\n')
    doc.head.append(style)
    return style
  })
  let queries = 0
  const query = doc.head.querySelector.bind(doc.head)
  doc.head.querySelector = selector => {
    if (selector.startsWith('style[data-plugin-css="@deepseek-ai/dsh-client-ui-chat/')) queries++
    return query(selector)
  }
  const statuses = []
  const controller = new ComfortController(doc, DEFAULTS, s => statuses.push(s))
  return { dom, doc, modules, controller, statuses,
    reset: () => { queries = 0 }, queries: () => queries,
    close: () => { controller.dispose(); dom.window.close() } }
}

test('unrelated head insertions, removals, replacements, attributes and text skip fingerprint queries', async () => {
  const f = fixture()
  try {
    f.reset()
    const style = f.doc.createElement('style')
    style.textContent = '/* unrelated */'
    const title = f.doc.createElement('title')
    title.textContent = 'Synthetic title'
    const wrapper = f.doc.createElement('template')
    f.doc.head.append(style, title, wrapper)
    await tick()
    style.textContent = '/* replaced text */'; await tick()
    style.firstChild.data = '/* characterData */'
    title.firstChild.data = 'Another title'
    style.id = 'unrelated-id'
    style.dataset.pluginCss = 'unrelated/module.css'
    await tick()
    const replacement = style.cloneNode(true)
    style.replaceWith(replacement); await tick()
    replacement.remove(); title.remove(); wrapper.remove(); await tick()
    assert.equal(f.queries(), 0)
    assert.deepEqual(f.statuses, ['active'])
    assert.equal(f.doc.querySelectorAll(`#${STYLE_ID}`).length, 1)
  } finally { f.close() }
})

test('relevant CSS removal, late re-addition and replacement revalidate in the next observer delivery', async () => {
  const f = fixture()
  try {
    for (const style of f.modules) {
      f.reset(); style.remove(); await tick()
      assert(f.queries() > 0)
      assert.equal(f.statuses.at(-1), 'unsupported')
      assert.equal(f.doc.getElementById(STYLE_ID), null)
      f.reset(); f.doc.head.append(style); await tick()
      assert(f.queries() > 0)
      assert.equal(f.statuses.at(-1), 'active')
    }
    const old = f.modules[0], replacement = old.cloneNode(true)
    f.reset(); old.replaceWith(replacement); await tick()
    assert(f.queries() > 0)
    assert.equal(f.statuses.at(-1), 'active')
    replacement.textContent = '/* incompatible replacement */'; await tick()
    assert.equal(f.statuses.at(-1), 'unsupported')
  } finally { f.close() }
})

test('relevant characterData changes retract and restore the enhancement', async () => {
  const f = fixture()
  try {
    const text = f.modules[1].firstChild, saved = text.data
    f.reset(); text.data = '/* incompatible */'; await tick()
    assert(f.queries() > 0)
    assert.equal(f.doc.getElementById(STYLE_ID), null)
    text.data = saved; await tick()
    assert.equal(f.statuses.at(-1), 'active')
  } finally { f.close() }
})

test('CSS identity attributes moving into or out of the supported set are relevant', async () => {
  const f = fixture()
  try {
    const style = f.modules[0], name = style.dataset.pluginCss
    style.dataset.pluginCss = 'other/module.css'; await tick()
    assert.equal(f.statuses.at(-1), 'unsupported')
    style.dataset.pluginCss = name; await tick()
    assert.equal(f.statuses.at(-1), 'active')
    style.removeAttribute('data-plugin-css'); await tick()
    assert.equal(f.doc.getElementById(STYLE_ID), null)
    style.setAttribute('data-plugin-css', name); await tick()
    assert.equal(f.statuses.at(-1), 'active')
  } finally { f.close() }
})

test('nested head subtrees containing host CSS are handled on insertion and removal', async () => {
  const f = fixture()
  try {
    const wrapper = f.doc.createElement('div')
    wrapper.append(f.modules[2]); f.doc.head.append(wrapper); await tick()
    assert.equal(f.statuses.at(-1), 'active')
    wrapper.remove(); await tick()
    assert.equal(f.statuses.at(-1), 'unsupported')
    f.doc.head.append(wrapper); await tick()
    assert.equal(f.statuses.at(-1), 'active')
  } finally { f.close() }
})

test('foreign same-ID nodes added before or after the owned sheet fail closed without deleting the foreign node', async () => {
  for (const position of ['before', 'after', 'nested', 'attribute']) {
    const f = fixture()
    try {
      const foreign = f.doc.createElement('style')
      foreign.textContent = '/* preserve foreign */'
      if (position !== 'attribute') foreign.id = STYLE_ID
      if (position === 'before') f.doc.head.prepend(foreign)
      else if (position === 'nested') {
        const wrapper = f.doc.createElement('div'); wrapper.append(foreign); f.doc.head.append(wrapper)
      } else f.doc.head.append(foreign)
      if (position === 'attribute') { await tick(); foreign.id = STYLE_ID }
      await tick()
      assert.equal(f.statuses.at(-1), 'error', position)
      assert.equal(f.doc.getElementById(STYLE_ID), foreign)
      assert.equal(foreign.textContent, '/* preserve foreign */')
      foreign.remove(); await tick()
      assert.equal(f.doc.getElementById(STYLE_ID), null, 'failed controller must not retry')
    } finally { f.close() }
  }
})

test('owned sheet removal, childList tampering and characterData tampering self-heal without a feedback loop', async () => {
  const f = fixture()
  try {
    const style = f.doc.getElementById(STYLE_ID), css = style.textContent
    for (const mutate of [() => style.remove(), () => { style.id = 'externally-renamed' }, () => { style.textContent = '/* tampered */' },
      () => { style.firstChild.data = '/* tampered text node */' }]) {
      f.reset(); mutate(); await tick()
      assert.equal(f.doc.getElementById(STYLE_ID), style)
      assert.equal(style.textContent, css)
      assert(f.queries() > 0)
      assert(f.queries() <= 6, 'at most the triggering delivery and repair delivery')
      const settled = f.queries(); await tick()
      assert.equal(f.queries(), settled, 'no observer feedback loop')
    }
  } finally { f.close() }
})

test('disabled controller skips mutation checks and re-enable validates the current host', async () => {
  const f = fixture()
  try {
    f.controller.update({ ...DEFAULTS, enabled: false }); await tick(); f.reset()
    f.modules[0].firstChild.data = '/* incompatible while disabled */'
    const unrelated = f.doc.createElement('meta'); f.doc.head.append(unrelated); await tick()
    assert.equal(f.queries(), 0)
    assert.equal(f.statuses.at(-1), 'off')
    assert.equal(f.doc.getElementById(STYLE_ID), null)
    f.controller.update(DEFAULTS)
    assert.equal(f.statuses.at(-1), 'unsupported')
  } finally { f.close() }
})

test('dispose cancels queued and future relevant mutations without restoring styles', async () => {
  const f = fixture()
  try {
    f.reset(); f.modules[0].remove(); f.controller.dispose()
    f.doc.head.append(f.modules[0]); await tick()
    assert.equal(f.queries(), 0)
    assert.equal(f.doc.getElementById(STYLE_ID), null)
    f.modules[1].firstChild.data = '/* later mutation */'; await tick()
    assert.equal(f.queries(), 0)
    assert.deepEqual(f.statuses, ['active'])
  } finally { f.close() }
})

test('all three delayed CSS modules must arrive before enhancement activates', async () => {
  const f = fixture()
  let late
  try {
    f.controller.dispose()
    for (const style of f.modules) style.remove()
    const statuses = []
    late = new ComfortController(f.doc, DEFAULTS, s => statuses.push(s))
    assert.equal(statuses.at(-1), 'unsupported')
    for (const [index, style] of f.modules.entries()) {
      f.doc.head.append(style); await tick()
      assert.equal(statuses.at(-1), index === 2 ? 'active' : 'unsupported')
      assert.equal(f.doc.querySelectorAll(`#${STYLE_ID}`).length, index === 2 ? 1 : 0)
    }
  } finally { late?.dispose(); f.close() }
})

test('a DOM failure in record filtering fails closed and disconnects further delivery', async () => {
  const f = fixture()
  try {
    f.doc.head.closest = () => { throw Error('DOM adapter failure') }
    f.doc.head.append(f.doc.createElement('meta')); await tick()
    assert.equal(f.statuses.at(-1), 'error')
    assert.equal(f.doc.getElementById(STYLE_ID), null)
    f.reset(); f.modules[0].remove(); await tick()
    assert.equal(f.queries(), 0)
  } finally { f.close() }
})
