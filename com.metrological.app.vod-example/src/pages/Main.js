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

import { Router } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";
import { Page } from "../components";

export default class Main extends Page {
    static _template() {
        return {
            Content: {x: 140, type: List, w: w => w, y: 580, h: 500, direction: 'column', scroll: 0, scrollTransition: {duration: 0.4}}
        }
    }

    pageTransition(pageIn, pageOut) {
        const menu = pageIn.widgets.menu;
        if(menu.alpha !== 1) {
            menu.visible = true;
            menu.alpha = 0.001;
            menu.setSmooth('alpha', 1, {delay: 0.2, duration: 0.2});
        }
        return super.pageTransition(pageIn, pageOut);
    }

    _getFocused() {
        return this.tag('Content');
    }

    $updateItemTitle(e) {
        this.tag('ItemDescription').item = e;
    }

    addStrips(array) {
        if(this._hasData) {
            return;
        }
        this._hasData = true;
        const content = this.tag('Content');
        content.add(array);
    }

    _handleLeft() {
        Router.focusWidget('Menu');
    }
}