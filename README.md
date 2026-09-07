# AdMob — Google AdMob Extension for Cocos Creator

[![CI](https://github.com/iamhainv/cocos-admob/actions/workflows/ci.yml/badge.svg)](https://github.com/iamhainv/cocos-admob/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](#english) | [中文](#中文)

---

<a id="english"></a>
## English

A Cocos Creator 3.8.x extension: AdMob — Google AdMob Extension for Cocos Creator.

### Features

- Banner ads (anchored adaptive, top or bottom, show / hide / destroy)
- Interstitial ads (load, show, `isReady()`)
- Rewarded ads (reward callback with `{ type, amount }`)
- Rewarded interstitial ads
- App open ads (cold-start / foreground guard)
- Native ads (platform view composited over the GL surface, with the required "Ad" badge and AdChoices icon)
- Google User Messaging Platform (UMP) consent flow (EEA/UK compliant)
- Test mode with Google's public test ad unit IDs (default on)

### Compatibility

| Cocos Creator | Android | iOS | Web |
| --- | --- | --- | --- |
| >= 3.8.0 | Yes | Yes | Preview only (native features degrade gracefully) |

### Demo

A runnable demo lives at the project root, with one scene per ad format
plus a menu:

| Scene | Format |
| --- | --- |
| [`assets/scene/main.scene`](./assets/scene/main.scene) | Menu — one button per demo scene below |
| [`assets/scene/1.banner.scene`](./assets/scene/1.banner.scene) | Banner |
| [`assets/scene/2.interstitial.scene`](./assets/scene/2.interstitial.scene) | Interstitial |
| [`assets/scene/3.appOpenAd.scene`](./assets/scene/3.appOpenAd.scene) | App open |
| [`assets/scene/4.rewardedAd.scene`](./assets/scene/4.rewardedAd.scene) | Rewarded |
| [`assets/scene/5.rewardedInterstitialAd.scene`](./assets/scene/5.rewardedInterstitialAd.scene) | Rewarded interstitial |
| [`assets/scene/6.nativeAd.scene`](./assets/scene/6.nativeAd.scene) | Native ad |
| [`assets/scene/7.consent.scene`](./assets/scene/7.consent.scene) | Google User Messaging Platform (UMP) consent |

Each scene's logic lives in its own script under
[`assets/script/test/`](./assets/script/test/) (`BannerDemo.ts`,
`InterstitialDemo.ts`, `AppOpenDemo.ts`, `RewardedDemo.ts`,
`RewardedInterstitialDemo.ts`, `NativeDemo.ts`, `ConsentDemo.ts`), all built
on a shared UI/logging helper,
[`DemoUI.ts`](./assets/script/test/DemoUI.ts). `MainMenu.ts` drives the menu
scene and just `director.loadScene()`s the one you pick.

Every demo scene calls `admob.initialize()` itself on `start()` (via a
shared, deduplicated `initializeOnce()` promise in `DemoUI.ts`), so **any
scene can be opened and run directly** — you don't have to start from
`main.scene` or wire up initialization order by hand. All scenes use only
[Google's public test ad unit IDs](https://developers.google.com/admob/android/test-ads)
(publisher ID `ca-app-pub-3940256099942544`), so the demo is safe to build
and run as-is; swap in your own ad unit IDs before shipping a real app.

Open this repo as a Cocos Creator 3.8.x project and build to Android or
iOS to see live ads; on web/editor preview the native ad calls are no-ops
and the on-screen log reports that plainly.

### Installation

1. Copy `extensions/AdMob` into your project's `extensions/` folder.
2. Restart Cocos Creator, or use **Extension → Extension Manager** to enable it.
3. See the full documentation: [doc/en](./extensions/AdMob/doc/en/index.md)

### Documentation

- English: [extensions/AdMob/doc/en/index.md](./extensions/AdMob/doc/en/index.md)
- 中文: [extensions/AdMob/doc/zh/index.md](./extensions/AdMob/doc/zh/index.md)

### License

MIT — see [LICENSE](./LICENSE).

### Trademarks

This project is an independent, community-maintained wrapper and is **not
affiliated with, endorsed by, or sponsored by** Cocos, Google, or Apple.
"Cocos Creator", "AdMob", "Firebase", "Google Play" and "App Store" are
trademarks of their respective owners.

---

<a id="中文"></a>
## 中文

一个 Cocos Creator 3.8.x 扩展：AdMob — Google AdMob Extension for Cocos Creator。

### 功能特性

- Banner ads (anchored adaptive, top or bottom, show / hide / destroy)
- Interstitial ads (load, show, `isReady()`)
- Rewarded ads (reward callback with `{ type, amount }`)
- Rewarded interstitial ads
- App open ads (cold-start / foreground guard)
- Native ads (platform view composited over the GL surface, with the required "Ad" badge and AdChoices icon)
- Google User Messaging Platform (UMP) consent flow (EEA/UK compliant)
- Test mode with Google's public test ad unit IDs (default on)

### 兼容性

| Cocos Creator | Android | iOS | Web |
| --- | --- | --- | --- |
| >= 3.8.0 | 支持 | 支持 | 仅预览（原生功能会优雅降级） |

### 演示

项目根目录下有一个可直接运行的演示，每种广告形式各占一个场景，外加一个菜单场景：

| 场景 | 广告形式 |
| --- | --- |
| [`assets/scene/main.scene`](./assets/scene/main.scene) | 菜单——每个按钮对应下面一个演示场景 |
| [`assets/scene/1.banner.scene`](./assets/scene/1.banner.scene) | Banner（横幅广告） |
| [`assets/scene/2.interstitial.scene`](./assets/scene/2.interstitial.scene) | Interstitial（插屏广告） |
| [`assets/scene/3.appOpenAd.scene`](./assets/scene/3.appOpenAd.scene) | App Open（应用打开广告） |
| [`assets/scene/4.rewardedAd.scene`](./assets/scene/4.rewardedAd.scene) | Rewarded（激励广告） |
| [`assets/scene/5.rewardedInterstitialAd.scene`](./assets/scene/5.rewardedInterstitialAd.scene) | Rewarded Interstitial（激励插屏广告） |
| [`assets/scene/6.nativeAd.scene`](./assets/scene/6.nativeAd.scene) | Native Ad（原生广告） |
| [`assets/scene/7.consent.scene`](./assets/scene/7.consent.scene) | Google 用户消息平台（UMP）同意流程 |

每个场景的逻辑都写在 [`assets/script/test/`](./assets/script/test/) 目录下各自的
脚本中（`BannerDemo.ts`、`InterstitialDemo.ts`、`AppOpenDemo.ts`、`RewardedDemo.ts`、
`RewardedInterstitialDemo.ts`、`NativeDemo.ts`、`ConsentDemo.ts`），它们都基于共享的
UI/日志辅助脚本 [`DemoUI.ts`](./assets/script/test/DemoUI.ts) 构建。`MainMenu.ts`
驱动菜单场景，点击按钮时只是调用 `director.loadScene()` 跳转到对应场景。

每个演示场景都会在 `start()` 中自行调用 `admob.initialize()`（通过
`DemoUI.ts` 中共享且去重的 `initializeOnce()` Promise 实现），因此**任意场景都可以
直接打开并运行**——无需从 `main.scene` 启动，也无需手动管理初始化顺序。所有场景
都只使用 [Google 官方提供的测试广告单元 ID](https://developers.google.com/admob/android/test-ads)
（发布商 ID 为 `ca-app-pub-3940256099942544`），因此该演示可以直接构建运行；
正式发布应用前请替换为你自己的广告单元 ID。

将本仓库作为 Cocos Creator 3.8.x 项目打开，构建到 Android 或 iOS 即可看到真实广告；
在 Web/编辑器预览下，原生广告调用为空操作，屏幕上的日志会明确提示这一点。

### 安装

1. 将 `extensions/AdMob` 复制到项目的 `extensions/` 目录下。
2. 重启 Cocos Creator，或通过 **扩展 → 扩展管理器** 启用该扩展。
3. 查看完整文档：[doc/zh](./extensions/AdMob/doc/zh/index.md)

### 文档

- English: [extensions/AdMob/doc/en/index.md](./extensions/AdMob/doc/en/index.md)
- 中文: [extensions/AdMob/doc/zh/index.md](./extensions/AdMob/doc/zh/index.md)

### 许可证

MIT — 详见 [LICENSE](./LICENSE)。

### 商标声明

本项目为独立的社区维护封装库，**与 Cocos、Google、Apple 均无关联，未获得其
认可或赞助**。"Cocos Creator"、"AdMob"、"Firebase"、"Google Play" 与
"App Store" 均为其各自所有者的商标。
