/**
 * MainMenu — the demo project's start scene (`assets/scene/main.scene`).
 *
 * Just seven buttons, one per ad format demo scene. Each `director.loadScene`s
 * a scene from the table in ADMOB-CLEANROOM-SPEC.md §10; every one of those
 * scenes has its own "Back to menu" button (see DemoUI.addBackButton) that
 * returns here.
 */

import { _decorator, Component, director } from 'cc';
import { DemoUI } from './DemoUI';

const { ccclass } = _decorator;

interface MenuEntry {
    label: string;
    scene: string;
}

const SCENES: MenuEntry[] = [
    { label: '1. Banner', scene: '1.banner' },
    { label: '2. Interstitial', scene: '2.interstitial' },
    { label: '3. App Open', scene: '3.appOpenAd' },
    { label: '4. Rewarded', scene: '4.rewardedAd' },
    { label: '5. Rewarded Interstitial', scene: '5.rewardedInterstitialAd' },
    { label: '6. Native Ad', scene: '6.nativeAd' },
    { label: '7. Consent (UMP)', scene: '7.consent' },
];

@ccclass('MainMenu')
export class MainMenu extends Component {
    onLoad() {
        const ui = new DemoUI(this.node, 'AdMob Demo', { log: false });
        for (const entry of SCENES) {
            ui.addButton(entry.label, () => director.loadScene(entry.scene));
        }
    }
}
