# Third-Party Notices

AdMob — Google AdMob Extension for Cocos Creator may bundle or depend on third-party software. Their licenses are
reproduced below (or referenced) as required by their respective terms.

| Component | Version | License | Notes |
| --- | --- | --- | --- |
| Google Mobile Ads SDK (Android, `com.google.android.gms:play-services-ads`) | 25.4.0 | [Android Software Development Kit License Agreement](https://developer.android.com/studio/terms) | Resolved from Google's Maven repository at build time; not vendored in this repository. |
| User Messaging Platform SDK (Android, `com.google.android.ump:user-messaging-platform`) | 4.0.0 | [Android Software Development Kit License Agreement](https://developer.android.com/studio/terms) | Resolved from Google's Maven repository at build time; not vendored in this repository. |
| Google Mobile Ads SDK (iOS, `GoogleMobileAds.xcframework`) | 13.7.0 | [Google APIs Terms of Service](https://developers.google.com/terms) | Downloaded on demand by `extensions/AdMob/scripts/fetch-admob-ios-sdk.sh` from Google's official `dl.google.com` distribution; not vendored in this repository. SHA-256 of the fetched archive is pinned in the script. |
| User Messaging Platform SDK (iOS, `UserMessagingPlatform.xcframework`) | 3.1.0 | [Google APIs Terms of Service](https://developers.google.com/terms) | Downloaded on demand by the same script, from the same distribution channel. SHA-256 of the fetched archive is pinned in the script. |

None of the above SDKs are redistributed inside this git repository: the Android
dependencies are resolved by Gradle from Google's Maven repository, and the iOS
`.xcframework` bundles are fetched on demand by `scripts/fetch-admob-ios-sdk.sh`
and ignored by `.gitignore`. Only the glue code that talks to these SDKs
(written from scratch in this repository) is MIT-licensed.
