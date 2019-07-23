"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const rison_node_1 = tslib_1.__importDefault(require("rison-node"));
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const url_1 = tslib_1.__importDefault(require("url"));
const urlParams_1 = require("x-pack/plugins/apm/public/store/urlParams");
const url_helpers_1 = require("./url_helpers");
function createG(query) {
    const { _g: nextG = {} } = query;
    const g = { ...nextG };
    if (typeof query.rangeFrom !== 'undefined') {
        lodash_1.set(g, 'time.from', encodeURIComponent(query.rangeFrom));
    }
    if (typeof query.rangeTo !== 'undefined') {
        lodash_1.set(g, 'time.to', encodeURIComponent(query.rangeTo));
    }
    if (typeof query.refreshPaused !== 'undefined') {
        lodash_1.set(g, 'refreshInterval.pause', String(query.refreshPaused));
    }
    if (typeof query.refreshInterval !== 'undefined') {
        lodash_1.set(g, 'refreshInterval.value', String(query.refreshInterval));
    }
    return g;
}
function getRisonHref({ location, pathname, hash, query = {} }) {
    const currentQuery = url_helpers_1.toQuery(location.search);
    const nextQuery = {
        ...urlParams_1.TIMEPICKER_DEFAULTS,
        ...lodash_1.pick(currentQuery, url_helpers_1.PERSISTENT_APM_PARAMS),
        ...query
    };
    // Create _g value for non-apm links
    const g = createG(nextQuery);
    const encodedG = rison_node_1.default.encode(g);
    const encodedA = query._a ? rison_node_1.default.encode(query._a) : ''; // TODO: Do we need to url-encode the _a values before rison encoding _a?
    const risonQuery = {
        _g: encodedG
    };
    if (encodedA) {
        risonQuery._a = encodedA;
    }
    // don't URI-encode the already-encoded rison
    const search = querystring_1.default.stringify(risonQuery, undefined, undefined, {
        encodeURIComponent: (v) => v
    });
    const href = url_1.default.format({
        pathname: chrome_1.default.addBasePath(pathname),
        hash: `${hash}?${search}`
    });
    return href;
}
exports.getRisonHref = getRisonHref;
