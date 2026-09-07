# Changelog

All notable changes to this extension will be documented in this file.

## 1.2.0 — Demo: one scene per ad format

- Replaced the single combined `assets/scene/main.scene` + `AdMobTest.ts`
  demo with eight scenes: `1.banner.scene`, `2.interstitial.scene`,
  `3.appOpenAd.scene`, `4.rewardedAd.scene`,
  `5.rewardedInterstitialAd.scene`, `6.nativeAd.scene`, `7.consent.scene`,
  driven respectively by `BannerDemo.ts`, `InterstitialDemo.ts`,
  `AppOpenDemo.ts`, `RewardedDemo.ts`, `RewardedInterstitialDemo.ts`,
  `NativeDemo.ts`, `ConsentDemo.ts`. `main.scene` is now a menu
  (`MainMenu.ts`) with one button per scene above; every other scene has a
  "Back to menu" button.
- The split closes a coverage gap: `banner.destroy`, the three `isReady()`
  calls (interstitial/rewarded/rewardedInterstitial — app open's was
  already exercised), and `consent.canRequestAds()` / `consent.reset()`
  existed in `AdMobClient.ts` but had no button in the old combined demo.
  Every public `AdMobClient` ad-format method now has one.
- Each of the seven format scenes calls `admob.initialize()` itself, from
  `start()`, via a new idempotent `DemoUI.ready()` helper backed by a
  module-level cached promise, so the SDK initializes once per session no
  matter how many scenes are opened, and every button awaits that same
  promise before making any other `admob.*` call. Deliberately not wired
  through `MainMenu.ts` alone, since a format scene can be opened directly
  in Creator, bypassing the menu.
- Factored the shared button/log-panel UI (previously duplicated inline)
  into `assets/script/test/DemoUI.ts`, used by all eight scripts.
- Removed `assets/script/test/AdMobTest.ts`.

## 1.1.0 — Native ads

- Add native ads: `admob.native.load()` / `show()` / `hide()` / `destroy()`,
  rendered from ad-supplied assets into a hand-built platform view (Android
  `NativeAdView`, iOS `GADNativeAdView` built entirely in code) composited
  over the GL surface — not a Cocos scene-graph node. Includes the
  Google-mandated "Ad" attribution badge and asset-view registration for
  correct impression/click counting; the AdChoices icon is auto-rendered by
  the SDK on both platforms.
- New events: `native.loaded`, `native.failedToLoad`, `native.clicked`,
  `native.impression`, `native.opened`, `native.closed`.

## 1.0.0 — Initial release

- Initial open-source release of AdMob — Google AdMob Extension for Cocos Creator.
