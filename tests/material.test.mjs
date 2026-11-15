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

for (const [build, user] of [
  ['rc2', '.cJsG2q_bubble'],
  ['rc3', '.LOmM4q_bubble'],
  ['v022', '[data-message-bubble]'],
]) {
  test(`${build}: opacity and blur affect only the themed user and assistant surfaces`, () => {
    const baseline = sheet(DEFAULTS, build)
    assert.equal(sheet({ ...DEFAULTS, frostedGlass: true }, build), baseline)
    assert.doesNotMatch(baseline, /backdrop-filter|background-color: color-mix/)

    const translucent = sheet({ ...DEFAULTS, backgroundOpacity: 65 }, build)
    assert.ok(translucent.startsWith(baseline))
    const material = translucent.slice(baseline.length)
    assert.ok(material.includes(`[data-chat-flow-kind="user"] ${user} {`))
    assert.match(material, /var\(--dsw-specific-bubble\) 65%, transparent/)
    assert.match(material, /var\(--dsw-alias-label-primary\)\) 65%, transparent/)
    assert.doesNotMatch(material, /backdrop-filter|\bopacity\s*:/)

    const glass = sheet({ ...DEFAULTS, backgroundOpacity: 0, frostedGlass: true }, build)
    assert.match(glass, /0%, transparent/)
    assert.match(glass, /backdrop-filter: blur\(8px\)/)
    assert.match(glass, /assistant-step.*\.ydEAna_root\).*backdrop-filter/)
  })
  test(`${build}: edge follows opacity without changing bubble geometry`, () => {
    const baseline = sheet(DEFAULTS, build)
    for (const frostedGlass of [false, true]) {
      assert.equal(sheet({ ...DEFAULTS, backgroundOpacity: 100, frostedGlass }, build), baseline)
      const zero = sheet({ ...DEFAULTS, backgroundOpacity: 0, frostedGlass }, build).slice(baseline.length)
      const sharedEdge = zero.split('\n').findIndex(line => line.includes(`${user},`) && line.includes('assistant-step'))
      assert.notEqual(sharedEdge, -1)
      assert.deepEqual(zero.split('\n').slice(sharedEdge + 1, sharedEdge + 3), [
        '  border-color: transparent;',
        '  box-shadow: none;',
      ])
      for (const percent of [5, 50, 95]) {
        const material = sheet({ ...DEFAULTS, backgroundOpacity: percent, frostedGlass }, build).slice(baseline.length)
        assert.ok(material.includes(`border-color: color-mix(in srgb, var(--dsw-alias-border-l1) ${percent}%, transparent);`))
        assert.doesNotMatch(material, /box-shadow/)
        assert.doesNotMatch(material, /(?:padding|line-height|border-width|border-style|border-radius|width|border)\s*:/)
      }
      assert.equal(zero.includes('backdrop-filter: blur(8px)'), frostedGlass)
    }
  })
}
