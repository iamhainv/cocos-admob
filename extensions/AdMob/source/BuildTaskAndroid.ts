import * as fse from 'fs-extra';
import { AndroidConstants } from './AndroidConstants';
import { ITaskOptions } from './hooks';
import { appendContentToFileIfNo, insertContentBehindKey, upsertMarkerBlock } from './Util';

/** Google's public test AdMob App ID for Android (safe to ship as a fallback default). */
const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

const DEPENDENCIES_ANCHOR = "dependencies {";

const MANIFEST_PLACEHOLDER_BEGIN = '    // ADMOB-BEGIN:manifestPlaceholders';
const MANIFEST_PLACEHOLDER_END = '    // ADMOB-END:manifestPlaceholders';
const ANDROID_BLOCK_ANCHOR = 'android {';

/**
 * Handles every Android-side native project modification: copying the
 * `libadmob` Android library module into the built project and wiring it
 * into Gradle. All operations are idempotent — safe to run on every build.
 */
export class BuildTaskAndroid {
    async run(opts: ITaskOptions, result: any): Promise<void> {
        this.copyLibraryDirectory(opts);
        this.patchLibraryManifestPlaceholders(opts);
        this.patchSettingsGradle();
        this.patchAppBuildGradle();
    }

    private copyLibraryDirectory(opts: ITaskOptions): void {
        const dest = AndroidConstants.ProjectLibAdMobDir;
        const overwrite = opts.overwriteLibrary !== false;
        if (fse.existsSync(dest) && !overwrite) {
            return;
        }
        fse.copySync(AndroidConstants.TemplateLibAdMobDir, dest, { overwrite: true });
    }

    /**
     * The AdMob App ID varies per build (it is a build-panel option), so it
     * cannot be baked statically into the committed `libadmob/AndroidManifest.xml`.
     * Instead that manifest references `${admobAppId}`, a Gradle manifest
     * placeholder, and this method (re)writes the placeholder's value into
     * the *copied* `libadmob/build.gradle` on every build.
     */
    private patchLibraryManifestPlaceholders(opts: ITaskOptions): void {
        const buildGradle = `${AndroidConstants.ProjectLibAdMobDir}/build.gradle`;
        const appId = (opts.androidAppId && opts.androidAppId.trim()) || TEST_ANDROID_APP_ID;
        const useTestAds = opts.useTestAds !== false; // default true
        const testDeviceIds = (opts.testDeviceIds ?? '').replace(/"/g, '\\"');
        const body =
            `        manifestPlaceholders = [\n` +
            `            admobAppId: "${appId}",\n` +
            `            admobUseTestAds: "${useTestAds}",\n` +
            `            admobTestDeviceIds: "${testDeviceIds}",\n` +
            `        ]`;
        upsertMarkerBlock(
            buildGradle,
            MANIFEST_PLACEHOLDER_BEGIN,
            MANIFEST_PLACEHOLDER_END,
            body,
            ANDROID_BLOCK_ANCHOR,
        );
    }

    private patchSettingsGradle(): void {
        const snippet = fse.readFileSync(AndroidConstants.TemplateSettingsGradle, 'utf-8').trim();
        appendContentToFileIfNo(AndroidConstants.ProjectSettingsGradle, snippet);
    }

    private patchAppBuildGradle(): void {
        const snippet = fse.readFileSync(AndroidConstants.TemplateProjectBuildGradle, 'utf-8').trimEnd();
        insertContentBehindKey(AndroidConstants.ProjectAppBuildGradle, DEPENDENCIES_ANCHOR, snippet);
    }
}

export const buildTaskAndroid = { android: new BuildTaskAndroid() };
