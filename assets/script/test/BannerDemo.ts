/**
 * BannerDemo — focused demo for `admob.banner`.
 *
 * Exercises the full banner lifecycle: `load`, `show`, `hide`, `destroy`.
 * Only Google's public test ad unit IDs are used — see DemoUI.ts.
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
    AdMobEvent.BannerLoaded,
    AdMobEvent.BannerFailedToLoad,
    AdMobEvent.BannerOpened,
    AdMobEvent.BannerClosed,
];

@ccclass('BannerDemo')
export class BannerDemo extends Component {
    private _ui!: DemoUI;

    onLoad() {
        this._ui = new DemoUI(this.node, 'Banner');
        this._ui.log('Load, then Show. Hide/Destroy act on the same view.');

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
        this._ui.log('Loading banner...');
        try {
            await admob.banner.load({ adUnitId: testAdUnitId('banner'), position: 'bottom' });
            this._ui.log('Banner loaded.');
        } catch (e) {
            this._ui.reportError('Load banner', e);
        }
    }

    private async _onShow(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.banner.show();
            this._ui.log('Banner shown.');
        } catch (e) {
            this._ui.reportError('Show banner', e);
        }
    }

    private async _onHide(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.banner.hide();
            this._ui.log('Banner hidden.');
        } catch (e) {
            this._ui.reportError('Hide banner', e);
        }
    }

    private async _onDestroy(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.banner.destroy();
            this._ui.log('Banner destroyed.');
        } catch (e) {
            this._ui.reportError('Destroy banner', e);
        }
    }
}
