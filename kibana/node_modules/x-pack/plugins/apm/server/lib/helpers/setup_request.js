"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
function decodeEsQuery(esQuery) {
    return esQuery ? JSON.parse(decodeURIComponent(esQuery)) : null;
}
function getApmIndices(config) {
    return [
        config.get('apm_oss.errorIndices'),
        config.get('apm_oss.metricsIndices'),
        config.get('apm_oss.onboardingIndices'),
        config.get('apm_oss.sourcemapIndices'),
        config.get('apm_oss.spanIndices'),
        config.get('apm_oss.transactionIndices')
    ];
}
function isApmIndex(apmIndices, indexParam) {
    if (lodash_1.isString(indexParam)) {
        return apmIndices.includes(indexParam);
    }
    else if (Array.isArray(indexParam)) {
        // return false if at least one of the indices is not an APM index
        return indexParam.every(index => apmIndices.includes(index));
    }
    return false;
}
exports.isApmIndex = isApmIndex;
function addFilterForLegacyData(apmIndices, params) {
    // search across all data (including 6.x data)
    if (!isApmIndex(apmIndices, params.index)) {
        return params;
    }
    const nextParams = lodash_1.cloneDeep(params);
    if (!lodash_1.has(nextParams, 'body.query.bool.filter')) {
        lodash_1.set(nextParams, 'body.query.bool.filter', []);
    }
    // add to filter
    nextParams.body.query.bool.filter.push({
        range: { [elasticsearch_fieldnames_1.OBSERVER_VERSION_MAJOR]: { gte: 7 } }
    });
    return nextParams;
}
function setupRequest(req) {
    const query = req.query;
    const cluster = req.server.plugins.elasticsearch.getCluster('data');
    const uiSettings = req.getUiSettingsService();
    const config = req.server.config();
    const apmIndices = getApmIndices(config);
    const client = async (type, params) => {
        const includeFrozen = await uiSettings.get('search:includeFrozen');
        const nextParams = {
            ...addFilterForLegacyData(apmIndices, params),
            ignore_throttled: !includeFrozen,
            rest_total_hits_as_int: true // ensure that ES returns accurate hits.total with pre-6.6 format
        };
        if (query._debug) {
            console.log(`DEBUG ES QUERY:`);
            console.log('includeFrozen: ', includeFrozen);
            console.log(`${req.method.toUpperCase()} ${req.url.pathname} ${JSON.stringify(query)}`);
            console.log(`GET ${nextParams.index}/_search`);
            console.log(JSON.stringify(nextParams.body, null, 4));
        }
        return cluster.callWithRequest(req, type, nextParams);
    };
    return {
        start: moment_1.default.utc(query.start).valueOf(),
        end: moment_1.default.utc(query.end).valueOf(),
        esFilterQuery: decodeEsQuery(query.esFilterQuery),
        client,
        config
    };
}
exports.setupRequest = setupRequest;
