# Chat Comfort (dsh-chat-comfort)

## 1.0.2 compatibility maintenance (2026-10-25)

Explicit host range: `0.2.1-rc.2 || 0.2.1-rc.3`. Target: Windows Desktop 0.2.1-rc.3, Electron 44.7.0, Node 24.21.0. RC3 changes all three chat CSS-module fingerprints. Select a complete reviewed RC2 or RC3 selector set; unknown or mixed fingerprints retain the native UI.

Validated on an isolated real RC3 host, including coexistence with Packer 0.4.2, lifecycle, settings and persistence. The human user completed actual Desktop GUI acceptance; Build, typecheck, style-safety lint and 26 regressions passed; actual RC3 message styling, settings, scrolling and menus were verified. Prior RC2 declarations and automated tests remain; full RC2 Desktop retesting in this maintenance is NOT TESTED. See [compatibility](docs/COMPATIBILITY.md).


[简体中文](README.md)

Conservative chat bubble, spacing, and reading-surface improvements for DSH.

An independently maintained DSH integration. Third-party code retains its own attribution and license.

## Compatibility and status

Version **1.0.2**. Current target: Windows DSH Desktop **0.2.1-rc.3**. Prior RC2 support and automated coverage remain; full RC2 Desktop retesting this maintenance is NOT TESTED. Other platforms are untested.

Reviewed Windows DSH Desktop RC2 and RC3 component fingerprints are supported. The dedicated Smooth Stream 0.7.0 compatibility record belongs to the earlier RC2 validation. Other versions and combinations are unverified. A fingerprint mismatch leaves the native interface in place.

## Install, use, and uninstall

Download the prebuilt tgz from Releases, verify its SHA-256, and select it in the official plugin manager, or use `dsh plugin --profile <profile> add <absolute-tgz-path>`. Restart DSH and verify the plugin ID and version. Back up your configuration before updating. To uninstall, use the official manager or `dsh plugin --profile <profile> remove dsh-chat-comfort`. Do not edit node_modules or app.asar. Removing the plugin does not erase existing exports, history, or retained preferences.

Open Settings → Chat Comfort to enable it and choose Comfortable or Compact. Native width and font controls remain in charge.

## Development and troubleshooting

Use Node.js 22+, configure your local cache and temporary directories, then run `pnpm install --frozen-lockfile --ignore-scripts` and `npm run check`. Prebuilt runtime files are included; installation requires no build-time script. Verify host version, Profile selection, checksums, and import errors before troubleshooting. Do not disable safety checks or overwrite host files. See [validation scope](docs/COMPATIBILITY.md).

## License

See LICENSE and the retained third-party notices.

## Screenshots / 截图

Synthetic offline conversation, not real user content; historical 1.0.x visual test. Host UI is shown for integration context.

![Light](assets/screenshot-light.png)

![Dark](assets/screenshot-dark.png)

## Plugin manager / 插件管理器

Actual isolated DSH 0.2.1-rc.2 interface, with no personal account, Profile path, or conversation content in the captured cards.

![中文](assets/manager-zh.png)

![English](assets/manager-en.png)
