"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const createHashHistory_1 = tslib_1.__importDefault(require("history/createHashHistory"));
const lodash_1 = require("lodash");
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const url_1 = tslib_1.__importDefault(require("url"));
const urlParams_1 = require("x-pack/plugins/apm/public/store/urlParams");
function toQuery(search) {
    return search ? querystring_1.default.parse(search.slice(1)) : {};
}
exports.toQuery = toQuery;
function fromQuery(query) {
    return querystring_1.default.stringify(query);
}
exports.fromQuery = fromQuery;
exports.PERSISTENT_APM_PARAMS = [
    'kuery',
    'rangeFrom',
    'rangeTo',
    'refreshPaused',
    'refreshInterval'
];
function getSearchString(location, pathname, query = {}) {
    const currentQuery = toQuery(location.search);
    // Preserve existing params for apm links
    const isApmLink = pathname.includes('app/apm') || pathname === '';
    if (isApmLink) {
        const nextQuery = {
            ...urlParams_1.TIMEPICKER_DEFAULTS,
            ...lodash_1.pick(currentQuery, exports.PERSISTENT_APM_PARAMS),
            ...query
        };
        return fromQuery(nextQuery);
    }
    return fromQuery(query);
}
// TODO: Will eventually need to solve for the case when we need to use this helper to link to
// another Kibana app which requires url query params not covered by APMQueryParams
function getKibanaHref({ location, pathname = '', hash, query = {} }) {
    const search = getSearchString(location, pathname, query);
    const href = url_1.default.format({
        pathname: chrome_1.default.addBasePath(pathname),
        hash: `${hash}?${search}`
    });
    return href;
}
exports.getKibanaHref = getKibanaHref;
// This is downright horrible 😭 💔
// Angular decodes encoded url tokens like "%2F" to "/" which causes problems when path params contains forward slashes
// This was originally fixed in Angular, but roled back to avoid breaking backwards compatability: https://github.com/angular/angular.js/commit/2bdf7126878c87474bb7588ce093d0a3c57b0026
function legacyEncodeURIComponent(rawUrl) {
    return (rawUrl &&
        encodeURIComponent(rawUrl)
            .replace(/~/g, '%7E')
            .replace(/%/g, '~'));
}
exports.legacyEncodeURIComponent = legacyEncodeURIComponent;
function legacyDecodeURIComponent(encodedUrl) {
    return encodedUrl && decodeURIComponent(encodedUrl.replace(/~/g, '%'));
}
exports.legacyDecodeURIComponent = legacyDecodeURIComponent;
// Make history singleton available across APM project.
// This is not great. Other options are to use context or withRouter helper
// React Context API is unstable and will change soon-ish (probably 16.3)
// withRouter helper from react-router overrides several props (eg. `location`) which makes it less desireable
exports.history = createHashHistory_1.default();
