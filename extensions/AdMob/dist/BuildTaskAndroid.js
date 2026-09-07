"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTaskAndroid = exports.BuildTaskAndroid = void 0;
const fse = __importStar(require("fs-extra"));
const AndroidConstants_1 = require("./AndroidConstants");
const Util_1 = require("./Util");
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
class BuildTaskAndroid {
    run(opts, result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.copyLibraryDirectory(opts);
            this.patchLibraryManifestPlaceholders(opts);
            this.patchSettingsGradle();
            this.patchAppBuildGradle();
        });
    }
    copyLibraryDirectory(opts) {
        const dest = AndroidConstants_1.AndroidConstants.ProjectLibAdMobDir;
        const overwrite = opts.overwriteLibrary !== false;
        if (fse.existsSync(dest) && !overwrite) {
            return;
        }
        fse.copySync(AndroidConstants_1.AndroidConstants.TemplateLibAdMobDir, dest, { overwrite: true });
    }
    /**
     * The AdMob App ID varies per build (it is a build-panel option), so it
     * cannot be baked statically into the committed `libadmob/AndroidManifest.xml`.
     * Instead that manifest references `${admobAppId}`, a Gradle manifest
     * placeholder, and this method (re)writes the placeholder's value into
     * the *copied* `libadmob/build.gradle` on every build.
     */
    patchLibraryManifestPlaceholders(opts) {
        var _a;
        const buildGradle = `${AndroidConstants_1.AndroidConstants.ProjectLibAdMobDir}/build.gradle`;
        const appId = (opts.androidAppId && opts.androidAppId.trim()) || TEST_ANDROID_APP_ID;
        const useTestAds = opts.useTestAds !== false; // default true
        const testDeviceIds = ((_a = opts.testDeviceIds) !== null && _a !== void 0 ? _a : '').replace(/"/g, '\\"');
        const body = `        manifestPlaceholders = [\n` +
            `            admobAppId: "${appId}",\n` +
            `            admobUseTestAds: "${useTestAds}",\n` +
            `            admobTestDeviceIds: "${testDeviceIds}",\n` +
            `        ]`;
        (0, Util_1.upsertMarkerBlock)(buildGradle, MANIFEST_PLACEHOLDER_BEGIN, MANIFEST_PLACEHOLDER_END, body, ANDROID_BLOCK_ANCHOR);
    }
    patchSettingsGradle() {
        const snippet = fse.readFileSync(AndroidConstants_1.AndroidConstants.TemplateSettingsGradle, 'utf-8').trim();
        (0, Util_1.appendContentToFileIfNo)(AndroidConstants_1.AndroidConstants.ProjectSettingsGradle, snippet);
    }
    patchAppBuildGradle() {
        const snippet = fse.readFileSync(AndroidConstants_1.AndroidConstants.TemplateProjectBuildGradle, 'utf-8').trimEnd();
        (0, Util_1.insertContentBehindKey)(AndroidConstants_1.AndroidConstants.ProjectAppBuildGradle, DEPENDENCIES_ANCHOR, snippet);
    }
}
exports.BuildTaskAndroid = BuildTaskAndroid;
exports.buildTaskAndroid = { android: new BuildTaskAndroid() };
