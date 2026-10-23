// TEST ONLY. Keyless, deterministic adapter; never shipped in the plugin tarball.
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
const { LlmAdapter } = await import(pathToFileURL(join(dirname(process.execPath), 'resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-llm/lib/index.js')).href)
const model = { provider: 'comfort-lab', id: 'comfort-fixture', name: 'Comfort fixture (local, no API)', contextWindow: 128000,
  reasoning: { efforts: [{ id: 'high', name: 'High' }], defaultEffort: 'high' } }
const pause = () => new Promise(resolve => setTimeout(resolve, 50))
class Adapter extends LlmAdapter {
  async listModels() { return [model] }
  async resolveModel() { return model }
  async *stream(options) {
    const thought = '这是隔离环境的确定性思考测试。所有内容均为人工测试数据。'
    yield { type: 'block-start', index: 0, blockType: 'reasoning' }
    yield { type: 'reasoning-delta', index: 0, text: thought }
    yield { type: 'block-end', index: 0, block: { type: 'reasoning', text: thought } }
    if (options.tools?.some(t => t.name === 'pwsh') && options.messages.at(-1)?.role !== 'tool') {
      const args = JSON.stringify({ command: "Write-Output 'COMFORT_TOOL_OK'", description: 'Local read-only tool rendering fixture' })
      yield { type: 'block-start', index: 1, blockType: 'tool-call' }
      yield { type: 'tool-call-delta', index: 1, id: 'comfort-echo', name: 'pwsh', argumentsDelta: args }
      yield { type: 'block-end', index: 1, block: { type: 'tool-call', id: 'comfort-echo', name: 'pwsh', arguments: args } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    const text = '# 舒适阅读验证\n\n这是本地测试模型的流式回复，用于检查消息留白、原生 Markdown 和主题兼容。\n\n## 内容层次\n\n- 清晰的发送方与阅读区域\n- 保留原生消息按钮\n- 支持 **粗体**、*强调* 和 [链接](https://example.com)\n\n> 引用应保持可读，且不会遮挡其他内容。\n\n```javascript\nconst message = "comfort fixture";\nconsole.log(message);\n' + 'const longValue = "' + 'x'.repeat(220) + '";\n```\n\n| 项目 | 结果 | 说明 | 补充 |\n| --- | --- | --- | --- |\n| 表格 | 可横向滚动 | 原生渲染 | 完整显示 |\n| 长内容 | ' + 'table-content-'.repeat(20) + ' | 宽表测试 | 不截断 |\n\n' + Array.from({ length: 12 }, (_, i) => `### 第 ${i + 1} 段\n\n长篇阅读测试：消息内容应自然换行，保留段落节奏。缩放和窗口变化时，消息列表与输入框应保持正常。`).join('\n\n') + '\n\nCOMFORT_FIXTURE_COMPLETE'
    yield { type: 'block-start', index: 1, blockType: 'text' }
    for (let i = 0; i < text.length; i += 80) {
      yield { type: 'text-delta', index: 1, text: text.slice(i, i + 80) }
      await pause()
    }
    yield { type: 'block-end', index: 1, block: { type: 'text', text } }
    yield { type: 'usage', usage: { inputTokens: 30, outputTokens: 500, reasoningTokens: 20 } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
export const inject = ['llm']
export function apply(ctx) { ctx.llm.registerAdapter(['comfort-lab'], new Adapter()) }
