/**
 * DemoUI — shared button/log-panel helper for the AdMob extension demo
 * scenes (`assets/scene/1.banner.scene` … `7.consent.scene`, `main.scene`).
 *
 * Each demo scene has exactly one component (e.g. `BannerDemo`) that builds
 * its whole UI in code (no scene-baked buttons) using this helper, so the
 * eight demo scripts don't each re-implement the same button/log-panel
 * drawing code — see ADMOB-CLEANROOM-SPEC.md §10.
 *
 * `DemoUI` is not a `Component` itself: construct one from a host
 * component's `onLoad()`, passing `this.node` as the root to build into.
 */

import { Node, Label, Graphics, Color, UITransform, Vec3, sys, director } from 'cc';
import { admob } from 'db://admob/index';

const MAX_LOG_LINES = 14;
const BUTTON_SPACING = 65;
const BUTTON_WIDTH = 320;

/**
 * Module-level cache so `admob.initialize()` runs exactly once no matter how
 * many demo scenes are opened in one session (menu -> scene -> back -> another
 * scene all share this promise instead of re-initializing the SDK).
 */
let _initPromise: Promise<void> | null = null;

function initializeOnce(): Promise<void> {
    if (!_initPromise) {
        _initPromise = admob.initialize({});
    }
    return _initPromise;
}

/**
 * Google's public test ad unit IDs, platform-specific. Safe to tap as much
 * as you like — see https://developers.google.com/admob/android/test-ads
 * and https://developers.google.com/admob/ios/test-ads. Never replace these
 * with your own live ad unit IDs in a build you intend to tap yourself; see
 * extensions/AdMob/doc/en/index.md ("Test ads vs. production ads") for why.
 */
const TEST_AD_UNIT_IDS = {
    banner: { android: 'ca-app-pub-3940256099942544/6300978111', ios: 'ca-app-pub-3940256099942544/2934735716' },
    interstitial: { android: 'ca-app-pub-3940256099942544/1033173712', ios: 'ca-app-pub-3940256099942544/4411468910' },
    rewarded: { android: 'ca-app-pub-3940256099942544/5224354917', ios: 'ca-app-pub-3940256099942544/1712485313' },
    rewardedInterstitial: { android: 'ca-app-pub-3940256099942544/5354046379', ios: 'ca-app-pub-3940256099942544/6978759866' },
    appOpen: { android: 'ca-app-pub-3940256099942544/9257395921', ios: 'ca-app-pub-3940256099942544/5575463023' },
    native: { android: 'ca-app-pub-3940256099942544/2247696110', ios: 'ca-app-pub-3940256099942544/3986624511' },
} as const;

/** Resolve the platform-correct Google test ad unit ID for one format. */
export function testAdUnitId(format: keyof typeof TEST_AD_UNIT_IDS): string {
    const ids = TEST_AD_UNIT_IDS[format];
    return sys.os === sys.OS.IOS ? ids.ios : ids.android;
}

export interface DemoUIOptions {
    /** Show the scrolling log panel below the title. Default true. */
    log?: boolean;
}

export class DemoUI {
    private readonly _root: Node;
    private _logLabel: Label | null = null;
    private _logLines: string[] = [];
    private _nextY: number;
    private _initLogged = false;

    constructor(root: Node, title: string, options: DemoUIOptions = {}) {
        this._root = root;

        const rootUi = root.getComponent(UITransform) ?? root.addComponent(UITransform);
        rootUi.setContentSize(640, 720);

        this._addLabel(title, 0, 330, 26, true);

        const showLog = options.log !== false;
        if (showLog) {
            this._logLabel = this._addLogPanel(0, 155, 600, 220);
            this._nextY = -20;
        } else {
            this._nextY = 250;
        }
    }

    /** Append a line to the on-screen log panel (a no-op if the panel was disabled). Always also goes to the console. */
    log(text: string): void {
        this._logLines.push(text);
        if (this._logLines.length > MAX_LOG_LINES) {
            this._logLines.splice(0, this._logLines.length - MAX_LOG_LINES);
        }
        if (this._logLabel) {
            this._logLabel.string = this._logLines.join('\n');
        }
        console.log('[AdMobDemo]', text);
    }

    /**
     * Ensure `admob.initialize()` has been called (once per session, shared
     * across every demo scene via a module-level promise — see
     * `initializeOnce()` above) and report the outcome to this scene's log
     * panel exactly once. Call from `start()` so initialization begins as
     * soon as the scene loads, and `await` it before any other `admob.*`
     * call so buttons don't fire while init is still in flight or after it
     * has failed.
     *
     * Returns `true` once the SDK is initialized and safe to use, `false` if
     * initialization failed (the failure is already logged; callers should
     * bail out of their button handler in that case).
     */
    async ready(): Promise<boolean> {
        try {
            await initializeOnce();
            if (!this._initLogged) {
                this._initLogged = true;
                this.log('admob.initialize(): ok');
            }
            return true;
        } catch (e) {
            if (!this._initLogged) {
                this._initLogged = true;
                this.reportError('admob.initialize', e);
            }
            return false;
        }
    }

    /** Log a caught error, with a friendly message for the common "native only" case. */
    reportError(what: string, err: any): void {
        if (err && err.code === 'E_NOT_SUPPORTED') {
            this.log(`${what}: native only — build to Android/iOS to try this.`);
            return;
        }
        const message = (err && err.message) || String(err);
        const code = (err && err.code) || 'E_UNKNOWN';
        this.log(`${what} failed [${code}]: ${message}`);
    }

    /** Add a full-width button, stacked automatically below the previous one. */
    addButton(text: string, onClick: () => void, width: number = BUTTON_WIDTH): Node {
        const node = this._makeButton(text, this._nextY, onClick, width);
        this._nextY -= BUTTON_SPACING;
        return node;
    }

    /** Add a "Back to menu" button that returns to `main.scene`, with extra spacing above it. */
    addBackButton(): Node {
        this._nextY -= 20;
        const node = this._makeButton('Back to menu', this._nextY, () => director.loadScene('main'), BUTTON_WIDTH);
        this._nextY -= BUTTON_SPACING;
        return node;
    }

    // -----------------------------------------------------------------
    // UI construction internals
    // -----------------------------------------------------------------

    private _addLabel(text: string, x: number, y: number, fontSize: number, bold: boolean): Label {
        const node = new Node('Label');
        this._root.addChild(node);
        node.setPosition(new Vec3(x, y, 0));
        const ui = node.addComponent(UITransform);
        ui.setContentSize(600, 40);
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 6;
        label.isBold = bold;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.overflow = Label.Overflow.RESIZE_HEIGHT;
        label.color = new Color(255, 255, 255, 255);
        return label;
    }

    private _addLogPanel(x: number, y: number, width: number, height: number): Label {
        const node = new Node('LogPanel');
        this._root.addChild(node);
        node.setPosition(new Vec3(x, y, 0));

        const ui = node.addComponent(UITransform);
        ui.setContentSize(width, height);

        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(0, 0, 0, 140);
        graphics.roundRect(-width / 2, -height / 2, width, height, 8);
        graphics.fill();

        const labelNode = new Node('LogLabel');
        node.addChild(labelNode);
        labelNode.setPosition(new Vec3(0, 0, 0));
        const labelUi = labelNode.addComponent(UITransform);
        labelUi.setContentSize(width - 24, height - 16);
        const label = labelNode.addComponent(Label);
        label.string = '';
        label.fontSize = 13;
        label.lineHeight = 17;
        label.horizontalAlign = Label.HorizontalAlign.LEFT;
        label.verticalAlign = Label.VerticalAlign.TOP;
        label.overflow = Label.Overflow.CLAMP;
        label.enableWrapText = true;
        label.color = new Color(220, 220, 220, 255);
        return label;
    }

    private _makeButton(text: string, y: number, onClick: () => void, width: number): Node {
        const node = new Node(`Button_${text.replace(/\s+/g, '')}`);
        this._root.addChild(node);
        node.setPosition(new Vec3(0, y, 0));

        const ui = node.addComponent(UITransform);
        ui.setContentSize(width, 56);

        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(43, 108, 176, 255);
        graphics.roundRect(-width / 2, -28, width, 56, 10);
        graphics.fill();

        const labelNode = new Node('Label');
        node.addChild(labelNode);
        const labelUi = labelNode.addComponent(UITransform);
        labelUi.setContentSize(width, 56);
        const label = labelNode.addComponent(Label);
        label.string = text;
        label.fontSize = 18;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.color = new Color(255, 255, 255, 255);

        node.on(Node.EventType.TOUCH_END, () => onClick(), this);

        return node;
    }
}
