# dsh-chat-comfort 1.0.3

[Current GitHub Release](https://github.com/379385796-sys/dsh-chat-comfort/releases/tag/v1.0.3) · [使用说明 / Usage](README.md) · [Compatibility](docs/COMPATIBILITY.md)

Windows DSH Desktop RC5 compatibility. The three reviewed chat style fingerprints match RC3; the conservative RC3 adapter remains in use. This release does not add conversation or model controls.

当前发布状态以上述 Release 为准。下载 tgz 和同名 SHA-256 文件，核对后通过官方插件界面安装。下方保留此前版本的历史记录，不代表本轮重新验收。

Use the linked Release and matching tgz/checksum. The historical notes below retain their original validation scope; this documentation-only revision does not rerun acceptance.

## Historical 1.0.2 notes

RC3 changes all three chat CSS-module fingerprints. Select a complete reviewed RC2 or RC3 selector set; unknown or mixed fingerprints retain the native UI.

No new features or core/Shell changes. Host range: 0.2.1-rc.2 || 0.2.1-rc.3.

Validation: real installed RC3 runtime, isolated official tgz installation, enable/disable/reload, settings persistence, coexistence with Packer 0.4.2, and human Desktop GUI acceptance. Build, typecheck, style-safety lint and 26 regressions passed; actual RC3 message styling, settings, scrolling and menus were verified. RC2 automated coverage remains; full RC2 Desktop retest this maintenance is NOT TESTED.

MIT licenses and third-party notices retained.
