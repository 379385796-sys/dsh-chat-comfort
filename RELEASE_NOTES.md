# dsh-chat-comfort 1.1.4

[使用说明 / Usage](README.md) · [兼容记录 / Compatibility](docs/COMPATIBILITY.md)

## 中文

- 透明度与毛玻璃改为预生成静态规则加属性切换：拖动滑块只切换 `data-cc-opacity` / `data-cc-glass`，不再整表重写样式。视觉、密度、圆角、边框与设置项保持不变。
- 只有宿主构建或密度变化才会更新插件自己的样式表；100%、停用、异常与卸载时清理属性。没有新增观察器、运行时依赖或计时器。
- 宿主范围不变。Windows DSH Desktop 0.2.2-rc.3 的原生浅深色及 Claude Style **0.21.3** 已验证（0%、5%、50%、95%、100% × 毛玻璃开关）。
- 43 项单元测试通过。Chromium/Edge 页面基准（真实宿主 CSS、4,811 个合成节点）每 5% 档由 8.6–9.2 ms 降至 2.7–3.0 ms；该数据来自浏览器页面，不是 Electron 实测。

## English

- Opacity and frosted glass now use pre-generated static rules switched by `data-cc-opacity` / `data-cc-glass`. Dragging the slider no longer rewrites the stylesheet. Visuals, density, radii, borders and controls are unchanged.
- The plugin's own stylesheet is updated only when the host build or density changes; attributes are cleared at 100%, on disable, failure and disposal. No new observer, runtime dependency or timer.
- The declared host range is unchanged. Native light and dark themes and Claude Style **0.21.3** were verified on Windows DSH Desktop 0.2.2-rc.3 (0%, 5%, 50%, 95%, 100% × glass on/off).
- 43 automated tests pass. Chromium/Edge page benchmark with the real host CSS and 4,811 synthetic nodes: 8.6–9.2 ms → 2.7–3.0 ms per 5% step. This is a browser page benchmark, not an Electron measurement.

## 安装 / Installation

下载 `dsh-chat-comfort-1.1.4.tgz`，对照同名 `.sha256` 校验后通过 DSH 插件管理器安装，再重启 DSH。

Download `dsh-chat-comfort-1.1.4.tgz`, verify the accompanying SHA-256 file, then install through the DSH plugin manager and restart DSH.
