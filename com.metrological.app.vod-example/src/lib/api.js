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

const _baseUrl = 'https://api.themoviedb.org/3/';
const _headers = {
    'Content-Type': 'application/json;charset=utf-8'
};
const _params = {
    'api_key': '66683917a94e703e14ca150023f4ea7c',
    include_adult: false,
    include_video: true,
    region: 'NL'
};

const _executeRequest = (config, retryCounter = 0) => {
    const {url, target, body, headers = {}, exceptions = {}, method, timeout} = config;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = timeout || 10000;

        for(let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.onload = () => {
            if(xhr.status !== 200 && exceptions[xhr.status]) {
                resolve(xhr);
            }
            else if(xhr.status !== 200) {
                reject(target);
            }
            else {
                resolve(JSON.parse(xhr.response));
            }
        }

        xhr.onerror = () => {
            if(xhr.status !== 200 && exceptions[xhr.status]) {
                resolve(xhr);
            }
            else {
                reject(target);
            }
        }

        xhr.ontimeout = () => {
            if(retryCounter === 3) {
                reject(target);
            }
            else {
                retryCounter++;
                resolve(_executeRequest(config, retryCounter))
            }
        }
        xhr.send(body);
    })
}

const _request = ({url, target, params = {}, headers = {}, exceptions = {}, method, timeout}) => {
    headers = {..._headers, ...headers};
    params = {..._params, ...params};
    url = url || _baseUrl + target;
    let body = null;
    if(method !== 'GET') {
        body = JSON.stringify(params);
    }
    if(method === 'GET' && params) {
        url += `?${qsify(params)}`;
    }
    return _executeRequest({url, target, body, headers, exceptions, method, timeout})
}

const qsify = obj => {
    const ec = v=>encodeURIComponent(v);
    return Object.keys(obj).map((key) => {
        return `${ec(key)}=${ec(obj[key])}`;
    }).join("&");
};

//public functions
export const getRequest = (obj) => {
    return _request({...obj, method: 'GET'});
};

export const generateRequestIterable = (obj, amount) => {
    return new Array(amount).fill("").map(() => _request({...obj, method: 'GET'}));
}

export const postRequest = (obj) => {
    return _request({...obj, method: 'POST'});
};

const _fetchPageData = (lists, itemParams = {}) => {
    const calls = lists.map(({path, params}) => {
        return getRequest({target: path, params})
    });
    return Promise.all(calls)
        .then((response) => {
            return response.map((list, index) => {
                return {title: lists[index].title, ...itemParams, items: list.results}
            })
            .filter((strip) => strip.items.length > 0);
        });
}

export const getSearchResults = (query) => {
    return getRequest({target: 'search/multi', params: {query}})
        .then((response) => {
            response.results = response.results.filter(({media_type, poster_path}) => media_type !== 'person' && poster_path !== null);
            return response.results;
        })
}

export const getHomePage = () => {
    return _fetchPageData([
        {path: 'trending/all/day', title: 'Trending Today'},
        {path: 'trending/all/week', title: 'Trending this Week'},
    ]);
}

export const getMoviesPage = () => {
    const currentDate = new Date();
    const futureDate = _futureDate(currentDate);
    const pastDate = _pastDate(currentDate);
    return _fetchPageData([
        {path: 'discover/movie', title: 'Most Popular'},
        {path: 'discover/movie', params: {sort_by: 'vote_count.desc'}, title: 'Top Rated'},
        {path: 'discover/movie', params: {with_watch_monetization_types: 'free'}, title: 'Free to Watch'},
        {path: 'discover/movie', params: {'release_date.gte': futureDate.gte, 'release_date.lte': futureDate.lte, 'with_release_type': 3}, title: 'Upcoming'},
        {path: 'discover/movie', params: {'release_date.gte': pastDate.gte, 'release_date.lte': pastDate.lte, 'with_release_type': 3}, title: 'In Theaters'},
    ], {media_type: 'movie'});
}

export const getSeriesPage = () => {
    const currentDate = new Date();
    const formatCurrentDate = `${_nomalizeDatePart(currentDate.getDay())}-${_nomalizeDatePart(currentDate.getMonth() + 1)}-${currentDate.getFullYear()}`;
    return _fetchPageData([
        {path: 'discover/tv', title: 'Most Popular'},
        {path: 'discover/tv', params: {sort_by: 'vote_count.desc'}, title: 'Top Rated'},
        {path: 'discover/tv', params: {'release_date.gte': formatCurrentDate, 'release_date.lte': formatCurrentDate}, title: 'Airing Today'}
    ], {media_type: 'tv'});
}

export const getDetailPage = (mediaType, mediaId) => {
    return getRequest({target: `${mediaType}/${mediaId}`, params: {append_to_response: 'episode_groups,images'}})
        .then((response) => {
            return {media_type: mediaType, ...response};
        })
}

const _futureDate = (date) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDay = date.getDay();

    let futureMonth = currentMonth + 1;
    let futureYear = currentYear;
    if(futureMonth > 11) {
        futureMonth = 0;
        futureYear = currentYear + 1;
    }
    return {
        gte: `${_nomalizeDatePart(currentYear)}-${_nomalizeDatePart(currentMonth + 1)}-${currentDay < 22 ? 22 : currentDay}`,
        lte: `${_nomalizeDatePart(futureYear)}-${_nomalizeDatePart(futureMonth + 1)}-14`
    }
}

const _pastDate = (date) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDay = date.getDay();

    let pastMonth = currentMonth - 1;
    let pastYear = currentYear;
    const pastDay = Math.min(28, currentDay);

    if(pastMonth < 0) {
        pastMonth = 11;
        pastYear = currentYear - 1;
    }
    return {
        lte: `${_nomalizeDatePart(currentYear)}-${_nomalizeDatePart(currentMonth)}-${currentDay}`,
        gte: `${_nomalizeDatePart(pastYear)}-${_nomalizeDatePart(pastMonth)}-${pastDay}`
    }
}

const _nomalizeDatePart = (num) => {
    if((num + '').length === 1) {
        return '0' + num;
    }
    return num;
}