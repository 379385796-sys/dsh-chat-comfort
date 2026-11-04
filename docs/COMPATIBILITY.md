# Compatibility / 兼容与验证

## 当前范围 / Current scope

- Package **1.1.0** declares DSH `0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5 || 0.2.2-rc.1`; Node **22+**.
- Current published target: Windows x64 DSH Desktop **0.2.2-rc.1**. See [v1.1.0 Release](https://github.com/379385796-sys/dsh-chat-comfort/releases/tag/v1.1.0).
- 声明接受范围不等于每个版本、平台及第三方组合都完成同等验收。下面的 RC2/RC3/RC5 测试数量与安装状态是对应日期的历史记录。
- Declared ranges are not equal validation of every build/platform/combination. Historical RC2/RC3/RC5 records below retain their dates and scope.
- Linux/macOS and arbitrary host builds remain untested.

## 1.1.0 — 0.2.2-rc.1 adapter (2026-11-05)

Target: DSH Desktop 0.2.2-rc.1, Windows x64, Electron 44 / Node 24.21.0. Exact host range: `0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5 || 0.2.2-rc.1`.

### What 0.2.2-rc.1 changed in the reviewed surfaces

| Surface | RC3 / RC5 | 0.2.2-rc.1 |
| --- | --- | --- |
| `ChatView.module.css` | `.V4vHZW_column`, `.V4vHZW_flowItem` | identical |
| `MessageItem.module.css` | `.LOmM4q_userRow`, `.LOmM4q_userStack`, `.LOmM4q_bubble` | `.LOmM4q_userRow`, `.LOmM4q_userStack`; **`.bubble` removed** |
| User bubble element | `<div class="LOmM4q_bubble">` | `<UserMessageBubble data-message-bubble="">` from `dsh-client-ui-primitives` |
| `AssistantMarkdown.module.css` | `.xMeOpW_root`, `.xMeOpW_body` | identical |
| Flow attributes | `data-chat-flow`, `data-chat-flow-kind` | identical |

Because both existing fingerprint sets required `.LOmM4q_bubble`, 1.0.3 resolved no build on 0.2.2-rc.1 and reported `unsupported`, leaving native styling.

### Adapter

- `v022` fingerprint set carries the RC3 hashes plus a required **absence** of `.LOmM4q_bubble`; it is evaluated first so a 0.2.2 document can never be read as RC3.
- The bubble rule targets `[data-chat-flow-kind="user"] [data-message-bubble]`; the assistant reading card keeps `.xMeOpW_root`/`.xMeOpW_body`.
- Unknown or mixed builds still fail closed; the plugin never writes global layout or touches message content.

### Evidence

- 31 automated tests pass, including the new 0.2.2 cases and the RC3 regression.
- 13 checks pass against the real CSS modules extracted from the installed 0.2.2-rc.1 `app.asar`; native bubble padding `10px 16px` → comfort `12px 18px`, assistant card `20px 24px`, compact density `10px 16px` / `12px 16px`, disable/re-enable and disposal verified.
- Live browser session on a 0.2.2-rc.1 host: 18 chat CSS modules present, comfort stylesheet injected with 1837 characters, no page errors.

## 历史验证记录 / Historical validation records


- Windows + DSH Desktop 0.2.1-rc.2: previously isolated and formally installed for exporter, comfort, and prompt-inject; bilingual metadata reader and Chinese light/dark GUI verified. Public packaging is verified separately in the private release report.
- Linux/macOS/other DSH builds: NOT TESTED.
- 仅核验 Windows DSH Desktop 0.2.1-rc.2 的特定组件指纹。仅对 Smooth Stream 0.7.0 有专项兼容测试；其他版本和其他第三方组合未经完整验证。指纹不匹配时保持原生界面。没有接管输入、会话数据、模型或权限。
- Tested on Windows DSH Desktop 0.2.1-rc.2 with the recorded component fingerprints. Smooth Stream 0.7.0 has dedicated compatibility tests. Other versions and combinations are unverified. A fingerprint mismatch leaves the native interface in place.

No live credentials, real conversations, Profile snapshots, recovery backups, or test logs belong in this repository. Functional test counts are reported as historical evidence when not rerun; a successful build is not GUI acceptance.

## Public candidate checks, 2026-10-24

Clean official tgz install and cold Web host startup PASS. Actual English and Chinese plugin cards and loaded icons PASS. No duplicate client stylesheet and no browser page errors. Frozen-lock clean development install, build, typecheck, lint, and 24 tests PASS. No real model requests were sent.

## 1.0.2 — 2026-10-25

Installed target verified from immutable app.asar metadata: DSH and Shell 0.2.1-rc.3; Shell commit be72761ee1a6736ebcdf4f3739363b083ae53c98; Electron 44.7.0, Node 24.21.0, ABI 149.

Review the RC3 chat CSS-module fingerprints and select a complete RC2 or RC3 adapter; unknown or mixed builds retain native styling. No global layout overrides.

Build, typecheck, style-safety lint and 26 regressions passed; actual RC3 message styling, settings, scrolling and menus were verified. All three maintained plugins coexist with Packer 0.4.2 in an isolated RC3 Profile; the final headless Web-host pass has no page, console or HTTP errors. The human user completed actual Desktop GUI checks. Headless and Desktop results are recorded separately. No compatibility exemption was used. Prior RC2 support remains; full RC2 Desktop retesting this maintenance is NOT TESTED.

## 1.0.3 — rc.5 maintenance (2026-10-30)

Target: DSH Desktop 0.2.1-rc.5, Windows x64, Electron 44.7.0 / Node 24.21.0 / ABI 149. Exact host range: `0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`. RC5 adds rawText while retaining text in the reasoning body slot. This plugin does not consume that slot or read message content; its three reviewed chat styles are byte-identical to RC3. No functional code changes.

Core behavior is checked on an isolated rc.5 Host/browser with synthetic sessions and deterministic offline model output, followed by three-plugin coexistence and the unchanged Packer 0.4.3 candidate dependency precheck. Earlier RC2/RC3 evidence remains; those full Desktop GUI checks are not repeated here. No formal Profile or DSH core modification.
