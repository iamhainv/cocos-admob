/**
 * NativeDemo — focused demo for `admob.native`.
 *
 * Exercises the full native-ad lifecycle: `load`, `show`, `hide`, `destroy`.
 * Only Google's public test ad unit IDs are used — see DemoUI.ts.
 *
 * Unlike the other formats, a native ad is a **platform view composited on
 * top of the GL surface**, not a node in the Cocos scene graph: it cannot
 * be z-ordered between Cocos nodes, does not scroll or transform with the
 * scene, and is positioned in screen pixel coordinates. This demo's log
 * panel and buttons are ordinary Cocos UI; the ad itself renders as a
 * separate native view layered above everything. See
 * extensions/AdMob/assets/Types.ts (`NativeAdOptions`) for details.
 *
 * On web preview / editor (non-native), every call rejects with
 * `{ code: 'E_NOT_SUPPORTED' }`; this component just logs that instead of
 * crashing.
 */

import { _decorator, Component } from 'cc';
import { admob, AdMobEvent } from 'db://admob/index';
import type { AdMobEventName } from 'db://admob/index';
import { DemoUI, testAdUnitId } from './DemoUI';

const { ccclass } = _decorator;

const EVENTS: AdMobEventName[] = [
    AdMobEvent.NativeLoaded,
    AdMobEvent.NativeFailedToLoad,
    AdMobEvent.NativeClicked,
    AdMobEvent.NativeImpression,
    AdMobEvent.NativeOpened,
    AdMobEvent.NativeClosed,
];

@ccclass('NativeDemo')
export class NativeDemo extends Component {
    private _ui!: DemoUI;

    onLoad() {
        this._ui = new DemoUI(this.node, 'Native Ad');
        this._ui.log('Native ads render as a platform view over the GL surface, not a scene node.');

        for (const event of EVENTS) {
            admob.on(event, this._onEvent);
        }

        this._ui.addButton('Load', () => this._onLoad());
        this._ui.addButton('Show', () => this._onShow());
        this._ui.addButton('Hide', () => this._onHide());
        this._ui.addButton('Destroy', () => this._onDestroy());
        this._ui.addBackButton();
    }

    start() {
        // Kick off SDK initialization as soon as the scene loads — this scene
        // may be opened directly in Creator, bypassing main.scene/MainMenu.
        void this._ui.ready();
    }

    onDestroy() {
        for (const event of EVENTS) {
            admob.off(event, this._onEvent);
        }
    }

    private _onEvent = (data: any): void => {
        this._ui.log(`event: ${data === undefined ? '(no data)' : JSON.stringify(data)}`);
    };

    private async _onLoad(): Promise<void> {
        if (!(await this._ui.ready())) return;
        this._ui.log('Loading native ad...');
        try {
            await admob.native.load({ adUnitId: testAdUnitId('native'), position: 'center' });
            this._ui.log('Native ad loaded.');
        } catch (e) {
            this._ui.reportError('Load native ad', e);
        }
    }

    private async _onShow(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.native.show();
            this._ui.log('Native ad shown.');
        } catch (e) {
            this._ui.reportError('Show native ad', e);
        }
    }

    private async _onHide(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.native.hide();
            this._ui.log('Native ad hidden.');
        } catch (e) {
            this._ui.reportError('Hide native ad', e);
        }
    }

    private async _onDestroy(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.native.destroy();
            this._ui.log('Native ad destroyed.');
        } catch (e) {
            this._ui.reportError('Destroy native ad', e);
        }
    }
}
