import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULTS, sanitize } from '../lib/testing/settings.js'
import { sheet } from '../lib/testing/adapter.js'

test('legacy preferences keep their density and receive material defaults', () => {
  assert.deepEqual(sanitize({ enabled: false, density: 'compact' }), {
    ...DEFAULTS, density: 'compact',
  })
})

test('opacity is bounded to 5% steps and the glass flag is independent', () => {
  for (const [input, expected] of [[-5, 0], [0, 0], [52, 50], [98, 100], [120, 100], [NaN, 100], [Infinity, 100], ['25', 100]]) {
    assert.deepEqual(sanitize({ backgroundOpacity: input, frostedGlass: true }), {
      ...DEFAULTS, backgroundOpacity: expected, frostedGlass: true,
    })
  }
  assert.equal(sanitize({ frostedGlass: 'true' }).frostedGlass, false)
})

const LEVELS = Array.from({ length: 20 }, (_, index) => index * 5)

for (const [build, user] of [
  ['rc2', '.cJsG2q_bubble'],
  ['rc3', '.LOmM4q_bubble'],
  ['v022', '[data-message-bubble]'],
]) {
  test(`${build}: the sheet is static and every opacity level is pre-generated`, () => {
    const baseline = sheet(DEFAULTS, build)
    // The sheet must not depend on the two visual switches: dragging the slider
    // or toggling glass only changes document attributes.
    assert.equal(sheet({ ...DEFAULTS, backgroundOpacity: 65, frostedGlass: true }, build), baseline)
    assert.equal(sheet({ ...DEFAULTS, backgroundOpacity: 0, frostedGlass: false }, build), baseline)
    assert.equal(sheet({ ...DEFAULTS, density: 'compact' }, build).includes('padding: 12px 16px'), true)

    const gates = new Set([...baseline.matchAll(/html\[data-cc-opacity="(\d+)"\]/g)].map(match => Number(match[1])))
    assert.deepEqual([...gates].sort((a, b) => a - b), LEVELS)
    assert.match(baseline, /var\(--dsw-specific-bubble\) 65%, transparent/)
    assert.match(baseline, /var\(--dsw-alias-label-primary\)\) 65%, transparent/)
    assert.doesNotMatch(baseline, /\bopacity\s*:/)
  })

  test(`${build}: material rules stay scoped to the chat surfaces`, () => {
    const css = sheet(DEFAULTS, build)
    for (const match of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      const [, selector, body] = match
      if (!/background-color:\s*color-mix|border-color:|backdrop-filter/.test(body)) continue
      assert.match(selector.trim(), /^html\[data-cc-opacity/, selector)
      assert.match(selector, /\[data-chat-flow\]/, selector)
    }
    assert.match(css, /html\[data-cc-opacity\]\[data-cc-glass\] [^{]*assistant-step[^{]*\{[^}]*backdrop-filter: blur\(8px\)/)
  })

  test(`${build}: zero hides the edge and every other level follows it`, () => {
    const css = sheet(DEFAULTS, build)
    const zero = css.split('\n').findIndex(line => line === '  border-color: transparent;')
    assert.notEqual(zero, -1)
    assert.equal(css.split('\n')[zero + 1], '  box-shadow: none;')
    for (const percent of [5, 50, 95]) {
      assert.match(css, new RegExp(`border-color: color-mix\\(in srgb, var\\(--dsw-alias-border-l1\\) ${percent}%, transparent\\);`))
    }
    assert.equal(css.includes('box-shadow: none;'), true)
    // Only the 0% group may remove the shadow.
    assert.equal(css.split('box-shadow: none;').length - 1, 1)
  })
}
