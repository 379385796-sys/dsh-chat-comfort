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
