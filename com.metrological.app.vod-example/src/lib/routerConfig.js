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

import { Item } from "../components";
import { Main, Search, Splash, Detail, Player } from "../pages";
import { getDetailPage, getHomePage, getMoviesPage, getSearchResults, getSeriesPage } from "./api.js";
import { applyItemModel, applyPlayerModel, createItemCollection, createPageComponents } from "./Factory.js";
const routes = [
    {
        path: 'home',
        component: Main,
        on: async (page) => {
            getHomePage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu', 'detail']
    },
    {
        path: 'movies',
        component: Main,
        on: async (page) => {
            getMoviesPage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu', 'detail']
    },
    {
        path: 'series',
        component: Main,
        on: async (page) => {
            getSeriesPage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu', 'detail']
    },
    {
        path: 'search',
        component: Search,
        widgets: ['inputfield'],
        on: async (page) => {
            page.tag('Content').itemType = Item;
            page.onSearch = async (input) => {
                return getSearchResults(input)
                    .then((response) => {
                        return createItemCollection(response);
                    });
            }
            return true;
        },
        widgets: ['inputfield', 'detail']
    },
    {
        path: 'detail/:mediaType/:mediaId',
        component: Detail,
        before: async (page, {mediaType, mediaId}) => {
            getDetailPage(mediaType, mediaId)
                .then((response) => {
                    const dataItem = applyItemModel(response);
                    page.widgets.detail.show(dataItem);
                    page.widgets.detail.showMore(dataItem);
                    return true;
                });
        },
        widgets: ['detail']
    },
    {
        path: 'player/:mediaType/:mediaId',
        component: Player,
        before: async (page, {mediaType, mediaId}) => {
            getDetailPage(mediaType, mediaId)
                .then((response) => {
                    const dataItem = applyPlayerModel(response);
                    page.setData(dataItem);
                    return true;
                });
        }
    },
    {
        path: '$',
        component: Splash
    },
]

export default {
    root: routes[0].path,
    routes
}