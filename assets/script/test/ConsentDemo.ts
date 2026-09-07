/**
 * ConsentDemo — focused demo for `admob.consent` (Google UMP).
 *
 * Exercises `request`, `showFormIfRequired`, `canRequestAds`, `reset`.
 * `reset()` is for debugging only — it wipes locally stored consent state
 * so the flow can be re-tested from a clean slate.
 *
 * On web preview / editor (non-native), every call rejects with
 * `{ code: 'E_NOT_SUPPORTED' }`; this component just logs that instead of
 * crashing.
 */

import { _decorator, Component } from 'cc';
import { admob, AdMobEvent } from 'db://admob/index';
import type { AdMobEventName, ConsentInfo } from 'db://admob/index';
import { DemoUI } from './DemoUI';

const { ccclass } = _decorator;

const EVENTS: AdMobEventName[] = [
    AdMobEvent.ConsentInfoUpdated,
    AdMobEvent.ConsentFormDismissed,
];

@ccclass('ConsentDemo')
export class ConsentDemo extends Component {
    private _ui!: DemoUI;

    onLoad() {
        this._ui = new DemoUI(this.node, 'Consent (UMP)');
        this._ui.log('Request consent info, then show the form if Google says one is required.');

        for (const event of EVENTS) {
            admob.on(event, this._onEvent);
        }

        this._ui.addButton('Request', () => this._onRequest());
        this._ui.addButton('Show Form If Required', () => this._onShowForm());
        this._ui.addButton('Can Request Ads?', () => this._onCanRequestAds());
        this._ui.addButton('Reset (debug)', () => this._onReset());
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

    private async _onRequest(): Promise<void> {
        if (!(await this._ui.ready())) return;
        this._ui.log('Requesting consent info...');
        try {
            const info: ConsentInfo = await admob.consent.request();
            this._ui.log(`status=${info.status} formAvailable=${info.isConsentFormAvailable} canRequestAds=${info.canRequestAds}`);
        } catch (e) {
            this._ui.reportError('Request consent', e);
        }
    }

    private async _onShowForm(): Promise<void> {
        if (!(await this._ui.ready())) return;
        this._ui.log('Showing consent form if required...');
        try {
            const info: ConsentInfo = await admob.consent.showFormIfRequired();
            this._ui.log(`After form: status=${info.status} canRequestAds=${info.canRequestAds}`);
        } catch (e) {
            this._ui.reportError('Show consent form', e);
        }
    }

    private async _onCanRequestAds(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            const can = await admob.consent.canRequestAds();
            this._ui.log(`canRequestAds() = ${can}`);
        } catch (e) {
            this._ui.reportError('canRequestAds', e);
        }
    }

    private async _onReset(): Promise<void> {
        if (!(await this._ui.ready())) return;
        try {
            await admob.consent.reset();
            this._ui.log('Consent state reset.');
        } catch (e) {
            this._ui.reportError('Reset consent', e);
        }
    }
}
