import ts from 'typescript'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
for (const name of await readdir('src')) {
  const text = await readFile(`src/${name}`, 'utf8')
  const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, name.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  assert.equal(file.parseDiagnostics.length, 0, `${name}: syntax`)
  function visit(node) {
    assert.notEqual(node.kind, ts.SyntaxKind.AnyKeyword, `${name}: explicit any`)
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert(!/innerHTML|outerHTML|replaceChildren|removeChild|fetch\(|XMLHttpRequest|!important/.test(text), `${name}: forbidden mutation, networking or override`)
}
const adapter = await readFile('src/adapter.ts', 'utf8')
assert(!/(?:^|[;{\n])\s*(?:display|visibility|opacity|position|z-index|height|overflow)\s*:/m.test(adapter), 'No hiding, clipping or core layout overrides')
assert(!/class\*|:root|#root|document\.body|\.style\.setProperty/.test(adapter), 'No broad selectors or theme mutations')
console.log('Source syntax, explicit-any, style safety and forbidden operations checks passed')
