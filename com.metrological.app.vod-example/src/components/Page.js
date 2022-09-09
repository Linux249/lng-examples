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

import {Lightning, Router} from '@lightningjs/sdk';

export default class Page extends Lightning.Component {
    pageTransition(pageIn, pageOut) {
        return this._pageTransition(pageIn, pageOut);
    }

    _pageTransition(pageIn, pageOut) {
        pageOut.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});

        if(this.hideBackground) {
            this.fireAncestors('$hideBackground');
        }
        else {
            this.fireAncestors('$showBackground');
        }

        return new Promise((resolve) => {
            pageIn.visible = true;
            pageIn.alpha = 0.001;
            pageIn.transition('alpha').on('finish', () => {
                if(pageIn.alpha === 1) {
                    pageOut.visible = false;
                    resolve(true);
                }
            });
            pageIn.setSmooth('alpha', 1, {delay: 0.2, duration: 0.2});
        });
    }

    _inactive() {
        this.stage.gc();
    }

    _handleBack(e) {
        const navCheck = Router.isNavigating();
        if(navCheck) {
            return true;
        }
        return false;
    }
}