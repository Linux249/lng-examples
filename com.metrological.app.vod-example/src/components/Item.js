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

import { Colors, Img, Lightning, Router, Utils } from '@lightningjs/sdk';

export default class Item extends Lightning.Component {
    static _template() {
        return {
            Focus: {
                alpha: 0, y: -36, x: -20, w: w => w + 40, h: h => h + 40, rect: true, colorBottom: Colors('focus2').get(), colorTop: Colors('focus').get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Poster: {w: w => w, h: h => h, shader: {type: Lightning.shaders.RoundedRectangle, radius: 12}}
        }
    }

    _firstActive() {
        this.patch({
            Poster: {texture: Img(this.item.poster).original()}
        });
    }

    _init() {
        const poster = this.tag('Poster');
        poster.on('txError', () => {
            poster.src = Utils.asset('images/missingImage.jpg')
        });
    }

    _focus() {
        const {backdrop, id, title, description} = this.item;
        this.fireAncestors('$updateBackdrop', {src: backdrop});
        this.fireAncestors('$getDetailWidget').show({id, title, description});
        this.patch({
            Focus: {smooth: {alpha: 1}},
            Poster: {smooth: {y: -15}}
        });
    }

    _unfocus() {
        this.patch({
            Focus: {smooth: {alpha: 0}},
            Poster: {smooth: {y: 0}}
        });
    }

    _handleEnter() {
        const {id, media_type} = this.item;
        Router.navigate(`detail/${media_type}/${id}`, {keepAlive: true});
    }

    static get width() {
        return 185;
    }

    static get height() {
        return 278;
    }

    static get marginRight() {
        return 40;
    }

    static get marginBottom() {
        return 40;
    }
}