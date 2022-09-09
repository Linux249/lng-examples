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

import { IconKey, Key } from "../components/Key.js";

export default {
    layouts: {
        'ABC': [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], 
            ['Layout:123', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Space', 'Backspace']
        ],
        '123': [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['Layout:ABC', 'Space', 'Backspace']
        ]
    },
    styling: {
        align: 'center',
        horizontalSpacing: 15,
        verticalSpacing: 20,
    },
    buttonTypes: {
        default: {
            type: Key,
        },
        Layout: {
            type: Key, w: 110,
        },
        Backspace: {
            type: IconKey, icon: '/images/backspace.png'
        },
        Space: {
            type: IconKey, w: 110, icon: '/images/space.png',
        }
    }
};