# dsh-chat-comfort 1.1.3

[使用说明 / Usage](README.md) · [兼容记录 / Compatibility](docs/COMPATIBILITY.md)

## 中文

- 用户气泡和助手阅读卡片支持 0–100% 背景不透明度（步长 5%）和独立毛玻璃开关。默认 100%、毛玻璃关闭。边框随背景淡出，0% 隐藏边框与容器阴影，100% 沿用原样式。
- 「舒适 / 紧凑」改用分段控件，支持方向键和系统高对比度。统一从 DSH 插件管理器启停，旧版保存的密度继续生效。
- 宿主范围保持不变。Windows DSH Desktop 0.2.2-rc.3 的原生浅深色及 Claude Style 0.21.2 已验证。遇到宿主热重载失败时，请退出后重启 DSH 以应用插件启停。

## English

- User bubbles and assistant reading cards support background opacity from 0% to 100% in 5% steps and an independent frosted-glass switch. Defaults are 100% and glass off. Borders fade with the background. At 0%, borders and surface shadows are hidden. At 100%, the original styling is used.
- Comfortable and Compact use a segmented control with arrow-key and high-contrast support. Enable or disable Chat Comfort in the DSH plugin manager. Existing density preferences carry over.
- The declared host range is unchanged. Native light and dark themes and Claude Style 0.21.2 were verified on Windows DSH Desktop 0.2.2-rc.3. If the host cannot hot-reload an enable or disable change, restart DSH to apply it.

## 安装 / Installation

下载 `dsh-chat-comfort-1.1.3.tgz`，对照同名 `.sha256` 校验后通过 DSH 插件管理器安装，再重启 DSH。

Download `dsh-chat-comfort-1.1.3.tgz`, verify the accompanying SHA-256 file, then install through the DSH plugin manager and restart DSH.
