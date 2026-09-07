/**
 * AppOpenDemo — focused demo for `admob.appOpen`.
 *
 * Exercises `load`, `isReady`, `show`. Only Google's public test ad unit
 * IDs are used — see DemoUI.ts.
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
    AdMobEvent.AppOpenLoaded,
    AdMobEvent.AppOpenFailedToLoad,
    AdMobEvent.AppOpenShowed,
    AdMobEvent.AppOpenFailedToShow,
    AdMobEvent.AppOpenDismissed,
];

@ccclass('AppOpenDemo')
export class AppOpenDemo extends Component {
    private _ui!: DemoUI;

    onLoad() {
        this._ui = new DemoUI(this.node, 'App Open');
        this._ui.log('Load an ad, check readiness, then show it.');

        for (const event of EVENTS) {
            admob.on(event, this._onEvent);
        }

        this._ui.addButton('Load', () => this._onLoad());
        this._ui.addButton('Is Ready?', () => this._onIsReady());
        this._ui.addButton('Show', () => this._onShow());
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
        this._ui.log('Loading app open ad...');
        try {
            await admob.appOpen.load(testAdUnitId('appOpen'));
            this._ui.log('App open ad loaded.');
        } catch (e) {
            this._ui.reportError('Load app open', e);
        }
    }

    private async _onIsReady(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            const ready = await admob.appOpen.isReady();
            this._ui.log(`isReady() = ${ready}`);
        } catch (e) {
            this._ui.reportError('isReady', e);
        }
    }

    private async _onShow(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.appOpen.show();
            this._ui.log('App open ad dismissed.');
        } catch (e) {
            this._ui.reportError('Show app open', e);
        }
    }
}
