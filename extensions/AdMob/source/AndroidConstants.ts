import { join } from 'path';

/**
 * Centralized path constants for the Android build task. Keeping every path
 * in one place makes `BuildTaskAndroid.ts` easy to audit and keeps the
 * idempotent-patch helpers in `Util.ts` honest about what they touch.
 */
export class AndroidConstants {
    /** Source template directory shipped inside this extension (committed to git). */
    static readonly TemplateAndroidDir = join(__dirname, '..', 'template', 'android');

    static readonly TemplateProjectBuildGradle = join(AndroidConstants.TemplateAndroidDir, 'build.gradle');
    static readonly TemplateSettingsGradle = join(AndroidConstants.TemplateAndroidDir, 'settings.gradle');
    static readonly TemplateLibAdMobDir = join(AndroidConstants.TemplateAndroidDir, 'libadmob');

    /** Destination: the native Android project inside the user's Creator project. */
    static get ProjectNativeAndroidDir(): string {
        return join(Editor.Project.path, 'native', 'engine', 'android');
    }

    static get ProjectRootBuildGradle(): string {
        return join(AndroidConstants.ProjectNativeAndroidDir, 'build.gradle');
    }

    static get ProjectSettingsGradle(): string {
        return join(AndroidConstants.ProjectNativeAndroidDir, 'settings.gradle');
    }

    static get ProjectAppBuildGradle(): string {
        return join(AndroidConstants.ProjectNativeAndroidDir, 'app', 'build.gradle');
    }

    static get ProjectAppManifest(): string {
        return join(AndroidConstants.ProjectNativeAndroidDir, 'app', 'AndroidManifest.xml');
    }

    static get ProjectLibAdMobDir(): string {
        return join(AndroidConstants.ProjectNativeAndroidDir, 'libadmob');
    }

    /** Gradle dependency coordinates. Pinned; see THIRD_PARTY_NOTICES.md. */
    static readonly PlayServicesAdsVersion = '25.4.0';
    static readonly UserMessagingPlatformVersion = '4.0.0';
}
