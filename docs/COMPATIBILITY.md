# Compatibility / 兼容与验证

- Windows + DSH Desktop 0.2.1-rc.2: previously isolated and formally installed for exporter, comfort, and prompt-inject; bilingual metadata reader and Chinese light/dark GUI verified. Public packaging is verified separately in the private release report.
- Linux/macOS/other DSH builds: NOT TESTED.
- 仅核验 Windows DSH Desktop 0.2.1-rc.2 的特定组件指纹。仅对 Smooth Stream 0.7.0 有专项兼容测试；其他版本和其他第三方组合未经完整验证。指纹不匹配时保持原生界面。没有接管输入、会话数据、模型或权限。
- Tested on Windows DSH Desktop 0.2.1-rc.2 with the recorded component fingerprints. Smooth Stream 0.7.0 has dedicated compatibility tests. Other versions and combinations are unverified. A fingerprint mismatch leaves the native interface in place.

No live credentials, real conversations, Profile snapshots, recovery backups, or test logs belong in this repository. Functional test counts are reported as historical evidence when not rerun; a successful build is not GUI acceptance.

## Public candidate checks, 2026-10-24

Clean official tgz install and cold Web host startup PASS. Actual English and Chinese plugin cards and loaded icons PASS. No duplicate client stylesheet and no browser page errors. Frozen-lock clean development install, build, typecheck, lint, and 24 tests PASS. No real model requests were sent.
