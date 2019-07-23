"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const lodash_1 = require("lodash");
const reselect_1 = require("reselect");
const url_helpers_1 = require("../components/shared/Links/url_helpers");
// @ts-ignore
const location_1 = require("./location");
const serviceDetails_1 = require("./reactReduxRequest/serviceDetails");
const transactionDistribution_1 = require("./reactReduxRequest/transactionDistribution");
// ACTION TYPES
exports.TIMEPICKER_UPDATE = 'TIMEPICKER_UPDATE';
exports.TIMEPICKER_DEFAULTS = {
    rangeFrom: 'now-24h',
    rangeTo: 'now',
    refreshPaused: 'true',
    refreshInterval: '0'
};
function calculateTimePickerDefaults() {
    const parsed = {
        from: datemath_1.default.parse(exports.TIMEPICKER_DEFAULTS.rangeFrom),
        // roundUp: true is required for the quick select relative date values to work properly
        to: datemath_1.default.parse(exports.TIMEPICKER_DEFAULTS.rangeTo, { roundUp: true })
    };
    const result = {};
    if (parsed.from) {
        result.start = parsed.from.toISOString();
    }
    if (parsed.to) {
        result.end = parsed.to.toISOString();
    }
    return result;
}
const INITIAL_STATE = calculateTimePickerDefaults();
// "urlParams" contains path and query parameters from the url, that can be easily consumed from
// any (container) component with access to the store
// Example:
// url: /opbeans-backend/Brewing%20Bot?transactionId=1321
// serviceName: opbeans-backend (path param)
// transactionType: Brewing%20Bot (path param)
// transactionId: 1321 (query param)
function urlParamsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case location_1.LOCATION_UPDATE: {
            const { processorEvent, serviceName, transactionName, transactionType, errorGroupId } = getPathParams(action.location.pathname);
            const { traceId, transactionId, detailTab, flyoutDetailTab, waterfallItemId, spanId, page, sortDirection, sortField, kuery } = url_helpers_1.toQuery(action.location.search);
            return removeUndefinedProps({
                ...state,
                // query params
                sortDirection,
                sortField,
                page: toNumber(page) || 0,
                transactionId: toString(transactionId),
                traceId: toString(traceId),
                waterfallItemId: toString(waterfallItemId),
                detailTab: toString(detailTab),
                flyoutDetailTab: toString(flyoutDetailTab),
                spanId: toNumber(spanId),
                kuery: url_helpers_1.legacyDecodeURIComponent(kuery),
                // path params
                processorEvent,
                serviceName,
                transactionType: url_helpers_1.legacyDecodeURIComponent(transactionType),
                transactionName: url_helpers_1.legacyDecodeURIComponent(transactionName),
                errorGroupId
            });
        }
        case exports.TIMEPICKER_UPDATE:
            return {
                ...state,
                start: action.time.min,
                end: action.time.max
            };
        default:
            return state;
    }
}
exports.urlParamsReducer = urlParamsReducer;
function toNumber(value) {
    if (value !== undefined) {
        return parseInt(value, 10);
    }
}
exports.toNumber = toNumber;
function toString(str) {
    if (str === '' ||
        str === 'null' ||
        str === 'undefined' ||
        Array.isArray(str)) {
        return;
    }
    return str;
}
function toBoolean(value) {
    return value === 'true';
}
exports.toBoolean = toBoolean;
function getPathAsArray(pathname) {
    return lodash_1.compact(pathname.split('/'));
}
function removeUndefinedProps(obj) {
    return lodash_1.pick(obj, value => value !== undefined);
}
function getPathParams(pathname) {
    const paths = getPathAsArray(pathname);
    const pageName = paths[1];
    switch (pageName) {
        case 'transactions':
            return {
                processorEvent: 'transaction',
                serviceName: paths[0],
                transactionType: paths[2],
                transactionName: paths[3]
            };
        case 'errors':
            return {
                processorEvent: 'error',
                serviceName: paths[0],
                errorGroupId: paths[2]
            };
        case 'metrics':
            return {
                processorEvent: 'metric',
                serviceName: paths[0]
            };
        default:
            return {};
    }
}
// ACTION CREATORS
function updateTimePicker(time) {
    return { type: exports.TIMEPICKER_UPDATE, time };
}
exports.updateTimePicker = updateTimePicker;
// Selectors
exports.getUrlParams = reselect_1.createSelector((state) => state.urlParams, serviceDetails_1.getDefaultTransactionType, transactionDistribution_1.getDefaultDistributionSample, (urlParams, transactionType, { traceId, transactionId }) => {
    return {
        transactionType,
        transactionId,
        traceId,
        ...urlParams
    };
});
