## 1.1.5 — 2026-11-19

- 在声明范围中加入 Windows x64 DSH Desktop **0.2.2-rc.5**；`0.2.1-rc.2`、`0.2.1-rc.3`、`0.2.1-rc.5`、`0.2.2-rc.1`、`0.2.2-rc.3` 保留不变。
- 纯声明变更：`lib/` 与 1.1.4 逐字节一致，`src/` 未改、未重新构建，也没有新增设置项、指纹、CSS 规则、计时器或运行时依赖。1.1.4 的 `engines.dsh` 不含 rc.5，宿主按 `semver.satisfies(runtimeVersion, range, { includePrerelease: true })` 判定后会在启动时静默跳过本插件；本版只解除该跳过。
- 定向核对（只读比对已安装 rc.5 `app.asar`，未安装、未启动插件）：`dsh-client-ui-chat` 六个适配指纹全部存在、`.LOmM4q_bubble{` 不存在、`data-message-bubble` 与 `data-chat-flow-kind` 存在，`v022` 适配与 rc.3 相同；`settings.section` slot、`ctx.slots.inject` / `register` 的 `locale` 选项、`ctx.locale.register(ns, dicts)` 签名均不变；所用主题 token 仍存在。
- 只跑定向检查：`tsc --noEmit`、lint 与 43 项 jsdom 单元测试全部通过（0 失败、0 跳过，用例不需要真实浏览器）；需要真实安装的画面验收未在本版执行，声明范围为静态比对结论。

- Add Windows x64 DSH Desktop **0.2.2-rc.5** to the declared host range; `0.2.1-rc.2`, `0.2.1-rc.3`, `0.2.1-rc.5`, `0.2.2-rc.1` and `0.2.2-rc.3` are retained.
- Declaration-only release: `lib/` is byte-identical to 1.1.4, `src/` is untouched, nothing was rebuilt, and there are no new settings, fingerprints, CSS rules, timers or runtime dependencies. 1.1.4's `engines.dsh` did not include rc.5, so the host's `semver.satisfies(runtimeVersion, range, { includePrerelease: true })` check made it silently skip this plugin at boot; this release only removes that skip.
- Targeted read-only review of the installed rc.5 `app.asar` (nothing installed or launched): `dsh-client-ui-chat` still carries all six adapter fingerprints with `.LOmM4q_bubble{` absent and `data-message-bubble` / `data-chat-flow-kind` present, so the `v022` adapter matches rc.3; the `settings.section` slot, the `locale` option of `ctx.slots.inject` / `register`, and the `ctx.locale.register(ns, dicts)` signature are unchanged; the theme tokens used are still defined.
- Only targeted checks were run: `tsc --noEmit`, lint and all 43 jsdom unit tests pass (0 failed, 0 skipped; no real browser needed). Live-install visual acceptance was not performed for this release; the declared range is based on static comparison.

## 1.1.4 — 2026-11-16

- 透明度与毛玻璃改为「预生成 20 档静态规则 + `data-cc-opacity` / `data-cc-glass` 属性切换」。拖动滑块不再重写样式表；100%、停用、异常与卸载时移除属性。视觉、密度、圆角和边框行为不变。
- 只有构建或密度变化才重写自有样式表；不新增观察器、运行时依赖或计时器。
- 在 Windows DSH Desktop 0.2.2-rc.3 上验证原生浅深色和 Claude Style **0.21.3**（0%、5%、50%、95%、100% × 毛玻璃开关）。声明的宿主范围不变。
- 43 项单元测试通过（原 40 项）。Chromium/Edge 页面基准（真实宿主 CSS、4,811 个合成节点）：每 5% 档 8.6–9.2 ms → 2.7–3.0 ms；这是浏览器页面基准，不是 Electron 实测。

- Opacity and frosted glass now use 20 pre-generated static rule sets switched by `data-cc-opacity` / `data-cc-glass`. Dragging the slider no longer rewrites the stylesheet; the attributes are removed at 100%, on disable, failure and disposal. Visuals, density, radii and border behaviour are unchanged.
- The owned stylesheet is rewritten only for a build or density change; no new observer, runtime dependency or timer.
- Verified native light and dark themes and Claude Style **0.21.3** on Windows DSH Desktop 0.2.2-rc.3 (0%, 5%, 50%, 95%, 100% × glass on/off). The declared host range is unchanged.
- 43 automated tests pass (was 40). Chromium/Edge page benchmark with the real host CSS and 4,811 synthetic nodes: 8.6–9.2 ms per 5% step → 2.7–3.0 ms. This is a browser page benchmark, not an Electron measurement.

## 1.1.3 — 2026-11-16

- 新增背景不透明度和独立毛玻璃。用户气泡和助手卡片的边框随背景透明度淡出，0% 隐藏边框与容器阴影，100% 保留原有样式。
- 「舒适 / 紧凑」改用可键盘操作的分段控件。启停统一使用 DSH 插件管理器，旧版密度偏好继续生效。
- 在 Windows DSH Desktop 0.2.2-rc.3 上验证原生浅深色和 Claude Style 0.21.2。声明的宿主范围不变。

- Add independent background-opacity and frosted-glass controls. Borders fade with the background, and surface shadows disappear at 0%. The original style is used at 100%.
- Use a keyboard-accessible Comfortable / Compact control. The DSH plugin manager owns enable and disable. Existing density preferences carry over.
- Verify native light and dark themes and Claude Style 0.21.2 on Windows DSH Desktop 0.2.2-rc.3. The declared host range is unchanged.

## 1.1.2 — 2026-11-13

- 在宿主范围中加入 Windows Desktop **0.2.2-rc.3**；`0.2.1-rc.2`、`0.2.1-rc.3`、`0.2.1-rc.5`、`0.2.2-rc.1` 保留不变。
- 无功能改动：rc.3 的聊天样式沿用 RC3 类名哈希，`MessageItem.module.css` 的 `.bubble` 类仍未提供，用户气泡继续走 `data-message-bubble`，`data-chat-flow-kind` 仍在，`v022` 适配原样生效；未新增指纹、设置、CSS 规则或滚动动画。
- 定向验证：核对当前 0.2.2-rc.3 安装中的 `dsh-client-ui-chat` 构建产物，六个必需指纹全部存在且 `.LOmM4q_bubble{` 不存在；插件装入 rc.3 Profile 后由宿主正常加载。
- 单元测试未重跑（代码与 1.1.1 逐字节一致），本版只改版本声明与文档。

- Add Windows Desktop **0.2.2-rc.3** to the declared host range; `0.2.1-rc.2`, `0.2.1-rc.3`, `0.2.1-rc.5` and `0.2.2-rc.1` are retained.
- No functional change: rc.3 keeps the RC3 class hashes, `MessageItem.module.css` still has no `.bubble`, the user bubble still carries `data-message-bubble`, `data-chat-flow-kind` is still present and the `v022` adapter resolves unchanged; no new fingerprints, settings, CSS rules or scroll animation.
- Targeted verification: the `dsh-client-ui-chat` build installed in 0.2.2-rc.3 carries all six required fingerprints and lacks `.LOmM4q_bubble{`; the plugin loads normally after installation into the rc.3 Profile.
- Unit tests were not rerun (code is byte-identical to 1.1.1); this release changes version declarations and docs only.

- 无新增设置项，不接管输入、会话或模型；设置键与存储结构不变。
- No new settings, no control over input, sessions or models; the settings key and stored shape are unchanged.

## 1.1.1 — 2026-11-09

- 独立显示偏好读取异常、损坏及保存失败；当前样式继续生效，保存重试成功后清除提示。
- 精修原生设置行、密度禁用状态、焦点与短时反馈；界面随宿主切换中文／英文并尊重 reduced-motion。
- 33 项回归通过；在当前 0.2.2-rc.1 隔离宿主核验原生／Claude Style 0.20.0、流式样式写入、浅深主题及模拟 DPI。
- 保持精确指纹、未知构建原生回退、head 范围观察及消息样式规则不变；未新增滚动或文本动画。

- Report unavailable, malformed or unsaved preferences separately from the active reading style; clear the warning after a successful retry.
- Polish native settings rows, density disabled states, focus and short feedback with host Chinese/English localization and reduced motion.
- Pass 33 regressions and isolated current-host checks with native styling and Claude Style 0.20.0, streaming, themes and emulated DPI.
- Retain exact fingerprints, native fallback, head-scoped observation and message CSS; add no scrolling or text animation engine.

## 1.1.0 — 2026-11-05

- Add DSH Desktop **0.2.2-rc.1** to the verified host range; earlier versions retained.
- 0.2.2-rc.1 keeps the RC3 CSS-module hashes but removes `MessageItem.module.css`'s `.bubble` class: the right-aligned user bubble now comes from the shared `UserMessageBubble` primitive carrying `data-message-bubble`. The RC2/RC3 fingerprint sets both require the removed class, so the plugin reported `unsupported` and left the native interface untouched.
- Add a `v022` build profile that claims the RC3 hashes only while the `.bubble` marker is absent, and target the bubble through `[data-message-bubble]`. RC2 and RC3 documents keep their existing rules; an unknown build still fails closed to native styling.
- Collapse fingerprint reading into one sheet snapshot so the observer's query budget is unchanged.
- Validation: 31 automated tests (5 new), plus 13 checks against the real CSS modules extracted from the installed 0.2.2-rc.1 app; the sheet is injected in a real browser session on that host with no page errors.

## 1.0.3 — 2026-10-30

- Add DSH Desktop 0.2.1-rc.5 explicitly to the verified host range; retain previous supported versions.
- RC5 adds rawText while retaining text in the reasoning body slot. This plugin does not consume that slot or read message content; its three reviewed chat styles are byte-identical to RC3. No functional code changes.
- Validation scope: isolated Windows rc.5 Host and browser, core plugin behavior and three-plugin coexistence; no formal installation or publication in this stage.

## 1.0.2 — 2026-10-25

- Review the RC3 chat CSS-module fingerprints and select a complete RC2 or RC3 adapter; unknown or mixed builds retain native styling. No global layout overrides.
- Retain prior host declarations and data formats; no new features.
- Real RC3 host and human Desktop acceptance passed; retain RC2 automated regression, with full RC2 Desktop retest NOT TESTED.

# Changelog

## 1.0.1

- Preserve the existing runtime and package identity.
- Add bilingual publication documentation, original display icons and localized metadata.
- Retain tested Windows / DSH 0.2.1-rc.2 limits; do not claim wider support.

This same-version public package is a publication candidate, separate from earlier personal installation artifacts. It has its own SHA-256.
