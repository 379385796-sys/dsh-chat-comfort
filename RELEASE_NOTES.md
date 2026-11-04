# dsh-chat-comfort 1.1.0

[Current GitHub Release](https://github.com/379385796-sys/dsh-chat-comfort/releases/tag/v1.1.0) · [使用说明 / Usage](README.md) · [Compatibility](docs/COMPATIBILITY.md)

DSH Desktop **0.2.2-rc.1** compatibility release. 0.2.2-rc.1 keeps the RC3 CSS-module hashes but removes `MessageItem.module.css`'s `.bubble` class — the right-aligned user bubble now comes from the shared `UserMessageBubble` primitive carrying `data-message-bubble`. The RC2/RC3 fingerprint sets both required that removed class, so 1.0.3 reported `unsupported` on 0.2.2-rc.1 and left the native interface untouched.

DSH Desktop **0.2.2-rc.1** 兼容性发布。该宿主保留 RC3 的类名哈希，但移除了 `MessageItem.module.css` 的 `.bubble` 类——用户气泡改由共享 `UserMessageBubble` 原语渲染（`data-message-bubble`）。RC2/RC3 指纹都要求这个已删除的类，因此 1.0.3 在 0.2.2-rc.1 上判为 `unsupported`，只保留原生界面。

## What changed

- New `v022` build profile: it claims the RC3 hashes only while the `.bubble` marker is absent, so a 0.2.2 document is never mistaken for RC3.
- The user bubble is targeted through `[data-message-bubble]` instead of the removed module class; the assistant reading card keeps its existing `.xMeOpW_root`/`.xMeOpW_body` target.
- RC2 and RC3 documents keep their previous rules. An unknown or mixed build still fails closed to native styling — nothing is guessed.
- Fingerprint reading now takes one sheet snapshot per refresh, so the observer's query budget and feedback-loop protection are unchanged.
- No new settings, no conversation/model control, no change to the stored settings key.

## Verification

- 31 automated tests pass (5 new for the 0.2.2 profile), including the RC3 regression and the "0.2.2 is never read as RC3" guard.
- 13 checks pass against the **real CSS modules extracted from the installed 0.2.2-rc.1 app**, asserting the native bubble padding (`10px 16px`) is replaced by the comfort padding (`12px 18px`), the assistant card padding (`20px 24px`), compact density, disable/re-enable, disposal and the RC3 negative control.
- In a real browser session against a live 0.2.2-rc.1 host, the stylesheet is injected (1837 characters) with no page errors, which only happens when build detection succeeds.

## Install

Download `dsh-chat-comfort-1.1.0.tgz`, verify it against `dsh-chat-comfort-1.1.0.tgz.sha256`, then install through the official plugin interface. Node 22+.

## Historical 1.0.3 notes

Windows DSH Desktop RC5 compatibility. The three reviewed chat style fingerprints match RC3; the conservative RC3 adapter remained in use.

MIT licenses and third-party notices retained.
