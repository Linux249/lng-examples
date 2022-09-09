/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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
 */

import Page from "../../app/Page.js";
import { Item } from '../itemComponents';
import { List } from '@lightningjs/ui'; 

export default class ListAsColumn extends Page {
    static _template() {
        return {
            ...super._template(),
            Content: {
                List: {
                    x: 90, y: 200,
                    h: 800,
                    direction: 'column',
                    type: List,
                    itemType: Item,
                    items: [
                        {
                            label: 'Search'
                        },
                        'Home',
                        20,
                        'Pictures',
                        'Settings'
                    ]
                }
            }
        }
    }

    _getFocused() {
        return this.tag('List');
    }

    static get header() {
        return 'List displayed as Column';
    }

    static get icon() {
        return 'images/list.png';
    }
}