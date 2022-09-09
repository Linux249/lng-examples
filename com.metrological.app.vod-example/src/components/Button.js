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

import { Lightning, Colors, Utils } from "@lightningjs/sdk";

export default class Button extends Lightning.Component {
    static _template() {
        return {
            Background: {
                w: w => w, h: h => h, rect: true, color: Colors('white').alpha(0.5).get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Content: {mount: 0.5, x: w => w / 2, color: Colors('white').get(), y: h => h / 2}
        }
    }

    set icon (src) {
        this._icon = src;
        this.tag('Content').src = Utils.asset(src);
    }

    get icon() {
        return this._icon;
    }

    set content(obj) {
        this.tag('Content').patch(obj);
    }

    get content() {
        return this.tag('Content');
    }

    _init() {
        const whiteAlpha = Colors('white').alpha(0.5).get();
        this._focusAnimation = this.animation({duration: 0.2, actions: [
            {t: 'Background', p: 'shader.fillColor', v: {0: 0x00ffffff, 1: 0xffffffff}},
            {t: 'Background', p: 'colorTop', v: {0: whiteAlpha, 1: Colors('focus').get()}},
            {t: 'Background', p: 'colorBottom', v: {0: whiteAlpha, 1: Colors('focus2').get()}},
        ]})
    }

    _focus() {
        this._focusAnimation.start();
    }

    _unfocus() {
        this._focusAnimation.stop();
    }
}