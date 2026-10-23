# Chat Comfort (dsh-chat-comfort)

[简体中文](README.md)

Conservative chat bubble, spacing, and reading-surface improvements for DSH.

An independently maintained DSH integration. Third-party code retains its own attribution and license.

## Compatibility and status

Version **1.0.1**. Tested on Windows with DSH Desktop **0.2.1-rc.2**. Other platforms are untested. 

Tested on Windows DSH Desktop 0.2.1-rc.2 with the recorded component fingerprints. Smooth Stream 0.7.0 has dedicated compatibility tests. Other versions and combinations are unverified. A fingerprint mismatch leaves the native interface in place.

## Install, use, and uninstall

Download the prebuilt tgz from Releases, verify its SHA-256, and select it in the official plugin manager, or use `dsh plugin --profile <profile> add <absolute-tgz-path>`. Restart DSH and verify the plugin ID and version. Back up your configuration before updating. To uninstall, use the official manager or `dsh plugin --profile <profile> remove dsh-chat-comfort`. Do not edit node_modules or app.asar. Removing the plugin does not erase existing exports, history, or retained preferences.

Open Settings → Chat Comfort to enable it and choose Comfortable or Compact. Native width and font controls remain in charge.

## Development and troubleshooting

Use Node.js 22+, configure your local cache and temporary directories, then run `pnpm install --frozen-lockfile --ignore-scripts` and `npm run check`. Exporter’s native WinForms helper requires the existing Windows .NET Framework C# compiler. Prebuilt runtime files are included; installation requires no build-time script. Verify host version, Profile selection, checksums, and import errors before troubleshooting. Do not disable safety checks or overwrite host files. See [validation scope](docs/COMPATIBILITY.md).

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
