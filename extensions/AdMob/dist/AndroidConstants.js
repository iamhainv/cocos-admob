"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidConstants = void 0;
const path_1 = require("path");
/**
 * Centralized path constants for the Android build task. Keeping every path
 * in one place makes `BuildTaskAndroid.ts` easy to audit and keeps the
 * idempotent-patch helpers in `Util.ts` honest about what they touch.
 */
class AndroidConstants {
    /** Destination: the native Android project inside the user's Creator project. */
    static get ProjectNativeAndroidDir() {
        return (0, path_1.join)(Editor.Project.path, 'native', 'engine', 'android');
    }
    static get ProjectRootBuildGradle() {
        return (0, path_1.join)(AndroidConstants.ProjectNativeAndroidDir, 'build.gradle');
    }
    static get ProjectSettingsGradle() {
        return (0, path_1.join)(AndroidConstants.ProjectNativeAndroidDir, 'settings.gradle');
    }
    static get ProjectAppBuildGradle() {
        return (0, path_1.join)(AndroidConstants.ProjectNativeAndroidDir, 'app', 'build.gradle');
    }
    static get ProjectAppManifest() {
        return (0, path_1.join)(AndroidConstants.ProjectNativeAndroidDir, 'app', 'AndroidManifest.xml');
    }
    static get ProjectLibAdMobDir() {
        return (0, path_1.join)(AndroidConstants.ProjectNativeAndroidDir, 'libadmob');
    }
}
exports.AndroidConstants = AndroidConstants;
/** Source template directory shipped inside this extension (committed to git). */
AndroidConstants.TemplateAndroidDir = (0, path_1.join)(__dirname, '..', 'template', 'android');
AndroidConstants.TemplateProjectBuildGradle = (0, path_1.join)(AndroidConstants.TemplateAndroidDir, 'build.gradle');
AndroidConstants.TemplateSettingsGradle = (0, path_1.join)(AndroidConstants.TemplateAndroidDir, 'settings.gradle');
AndroidConstants.TemplateLibAdMobDir = (0, path_1.join)(AndroidConstants.TemplateAndroidDir, 'libadmob');
/** Gradle dependency coordinates. Pinned; see THIRD_PARTY_NOTICES.md. */
AndroidConstants.PlayServicesAdsVersion = '25.4.0';
AndroidConstants.UserMessagingPlatformVersion = '4.0.0';
