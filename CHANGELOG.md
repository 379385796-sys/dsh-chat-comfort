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
