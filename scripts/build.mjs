import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('lib', { recursive: true })
await build({ entryPoints: ['src/index.ts'], outfile: 'lib/index.js', bundle: true, format: 'esm', platform: 'node', target: 'node22' })
const result = await build({ entryPoints: ['src/client.tsx'], bundle: true, write: false, format: 'cjs', platform: 'browser', target: 'es2022', jsx: 'automatic', external: ['react', 'react/jsx-runtime'], legalComments: 'none', metafile: true })
const imports = Object.values(result.metafile.outputs).flatMap(x => x.imports.map(i => i.path))
if (imports.some(x => !['react', 'react/jsx-runtime'].includes(x))) throw new Error('Unexpected browser dependency')
await writeFile('lib/client.js', `window.__ModuleLoader__.load({id:"dsh-chat-comfort",factory:(require)=>{var module={exports:{}};var exports=module.exports;\n${result.outputFiles[0].text}\nreturn module.exports;}});\n`)
// Importable pure modules for unit tests; excluded from runtime dependency graph.
await build({ entryPoints: ['src/settings.ts', 'src/adapter.ts', 'src/controller.ts'], outdir: 'lib/testing', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' })
console.log('Built host entry, official ModuleLoader client, and test modules')
