/**
 * Copyright 2021 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Colors,
  Img,
  Lightning,
} from '@lightningjs/sdk';
import { List } from '@lightningjs/ui';

import { Page } from '../components';
import { IconKey } from '../components/Key';

export default class Player extends Page {
    static _template() {
        return {
            Placeholder: {alpha: 0.001, w: 1920, h: 1080},
            ScreenBlock: {w: 1920, h: 1080, rect: true, color: Colors('black').get()},
            Overlay: {
                Top: {rect: true, w: 1920, h: 540, colorBottom: Colors('black').alpha(0.3).get(), colorTop: Colors('black').alpha(0.85).get()},
                Bottom: {rect: true, w: 1920, h: 540, mountY: 1, y: 1080, colorTop: Colors('black').alpha(0.3).get(), colorBottom: Colors('black').alpha(0.85).get()}
            },
            Title: {x: 230, y: 90, w: 1060, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
            PlayerButtons: {
                y: 890, x: 960, mountX: 0.5, type: List, autoResize: true, spacing: 50, forceLoad: true,
            },
            Progressbar: {y: 830, x: 960, w: 1620, h: 8, mountX: 0.5,
                Frame: {
                    w: w => w, h: h => h, rect: true, alpha: 0.7, shader: {type: Lightning.shaders.RoundedRectangle, radius: 2}
                },
                Troth: {
                    mountY: 0.5, y: 4, x: -10, w: 20, h: 20, rect: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 10}
                }
            },
            EventMessage: {
                x: 960, y: 540, mount: 0.5, text: {fontFace: 'MediumItalic', fontSize: 32, lineHeight: 28}
            }
        }
    }

    pageTransition(pageIn, pageOut) {
        const widgets = pageIn.widgets;
        //hide all widgets in app;
        for(let key in widgets) {
            widgets[key].setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
        }
        //fire super
        return super.pageTransition(pageIn, pageOut);
    }

    setData(data) {
        this._data = data;
        this._update();
    }

    _setup() {
        //map player buttons
        const buttons = ['previous', 'play', 'next'].map((icon) => {
            return {type: IconKey, w: 110, h: 110, icon: `images/${icon}.png`, action: icon}
        });

        //playerButtons list
        const playerButtons = this.tag('PlayerButtons')
        //add mapped player buttons
        playerButtons.add(buttons);
        //force playerButtons list index to 1
        playerButtons.index = 1;

        //use the animation functinality to fake playback replace the following events with player events
        this._progressAnimation = this.animation({duration: 60, repeat: -1, actions: [
        ]});


        this._progressAnimation.on('progress', (percentage) => {
            /*
                to calculate the throth for players you have to calculate the percentage of the current playback
                you can use the following formula to do so: currentTime / duration
            */
            const w = this.tag('Progressbar').w;
            this.tag('Troth').w = w * percentage + 20;
        });

        //When the asset is starting
        this._progressAnimation.on('start', () => {
            this._showEventMessage(`handle player start`);
            this._showOverlay();
            this._startOverlayTimeout();
            this._updatePlayButton(false);
            this._hideScreenBlock();
        });

        //This event should be fired when the play event is fired. resume == play
        this._progressAnimation.on('resume', () => {
            this._startOverlayTimeout();
            this._updatePlayButton(false);
        })

        //this event should be fired when the pause event is fired.
        this._progressAnimation.on('pause', () => {
            this._updatePlayButton(true);
        });

        //this event should be fired when the stop event is fired.
        this._progressAnimation.on('stop', (p) => {
            this._showEventMessage(`handle player stop`);
            this._showOverlay();
            this._showScreenBlock();
        });

        this.tag('Placeholder').on('txLoaded', () => {
            this.tag('Placeholder').setSmooth('alpha', 1, {duration: 0.1});
            this._progressAnimation.start();
        });

        const blackAlpha = Colors('black').alpha(0.3).get();

        //create overlay hide animation
        this._hideControls = this.animation({duration: 0.2, stopMethod: 'reverse', actions: [
            {t: 'Top', p: 'alpha', v: {0: 1, 1: 0}},
            {t: 'Top', p: 'colorBottom', v: {0: blackAlpha, 1: 0x00000000}},
            {t: 'Title', p: 'y', v: {0: 90, 1: 50}},
            {t: 'Title', p: 'alpha', v: {0: 1, 1: 0}},
            {t: 'Bottom', p: 'alpha', v: {0: 1, 1: 0}},
            {t: 'Bottom', p: 'colorTop', v: {0: blackAlpha, 1: 0x00000000}},
            {t: 'Progressbar', p: 'y', v: {0: 830, 1: 870}},
            {t: 'Progressbar', p: 'alpha', v: {0: 1, 1: 0}},
            {t: 'PlayerButtons', p: 'y', v: {0: 890, 1: 930}},
            {t: 'PlayerButtons', p: 'alpha', v: {0: 1, 1: 0}},
        ]});

        this._hideControls.on('stopFinish', () => {
            //when controls are visible try hiding after delay
            this._startOverlayTimeout();
        });
    }

    _showOverlay() {
        //show controls.
        this._hideControls.stop();
    }

    _startOverlayTimeout() {
        this._clearOverlayTimeout();
        //create timeout for 3000 ms
        this._overlayTimeout = setTimeout(() => {
            //if active and player is progressing (player is playing)
            if(this.active && this._progressAnimation.isActive()) {
                this._hideControls.start();
                this._showEventMessage(`hiding controls during playback`);
            }
        }, 3000)
    }

    _clearOverlayTimeout() {
        if(this._overlayTimeout) {
            clearTimeout(this._overlayTimeout);
        }
    }

    _update() {
        //if not active or no data dont update
        if(!this.active || !this._data) {
            return;
        }
        const {title, backdrop} = this._data;
        this.patch({
            Placeholder: {texture: Img(backdrop).contain(1920, 1080)},
            Title: {text: title}
        });
    }

    _updatePlayButton(toPlay = true) {
        //update play pause buttong to play icon when toPlay is true.
        this.tag('PlayerButtons').items[1].icon = `images/${toPlay ? 'play' : 'pause'}.png`;
        if(!toPlay) {
            this._startOverlayTimeout();
        }
    }

    _showScreenBlock() {
        this.tag('ScreenBlock').alpha = 1;
    }

    _hideScreenBlock() {
        this.tag('ScreenBlock').alpha = 0;
    }

    _showEventMessage(message) {
        const eventMessage = this.tag('EventMessage');
        eventMessage.text = message;
        eventMessage.alpha = 1;
        eventMessage.setSmooth('alpha', 0, {delay: 1.5, duration: 0.2});
    }

    _handleEnter() {
        const currentButton = this.tag('PlayerButtons').currentItem;

        switch(currentButton.action) {
            case 'play':
                if(this._progressAnimation.isActive()) {
                    this._progressAnimation.pause();
                }
                else {
                    this._progressAnimation.play();
                }
                break;
            case 'next':
                //handle next action
                break;
            case 'previous':
                //handle previous action
                break;
        }
        this._showEventMessage(`handle ${currentButton.action} button action`);
    }

    _captureKey() {
        if(this._hideControls.p !== 0) {
            this._showOverlay();
        }
        return false;
    }

    _firstActive() {
        this._update();
    }

    _inactive() {
        super._inactive();
        //stop fake media progress
        this._progressAnimation.stopNow();
        //show controls instantly reverting it to starting point
        this._hideControls.stopNow();

        //playback placeholder remove from code when implementing player
        this.tag('Placeholder').alpha = 0.001;
    }

    _getFocused() {
        return this.tag('PlayerButtons');
    }
    
    get hideBackground() {
        return true;
    }
}