"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const lodash_1 = require("lodash");
const idx_1 = require("x-pack/plugins/apm/common/idx");
function getTransactionItem(transaction, errorsPerTransaction) {
    return {
        id: transaction.transaction.id,
        parentId: transaction.parent && transaction.parent.id,
        serviceName: transaction.service.name,
        name: transaction.transaction.name,
        duration: transaction.transaction.duration.us,
        timestamp: transaction.timestamp.us,
        offset: 0,
        skew: 0,
        docType: 'transaction',
        transaction,
        errorCount: errorsPerTransaction[transaction.transaction.id] || 0
    };
}
function getSpanItem(span) {
    return {
        id: span.span.id,
        parentId: span.parent && span.parent.id,
        serviceName: span.service.name,
        name: span.span.name,
        duration: span.span.duration.us,
        timestamp: span.timestamp.us,
        offset: 0,
        skew: 0,
        docType: 'span',
        span
    };
}
function getClockSkew(item, parentItem) {
    if (!parentItem) {
        return 0;
    }
    switch (item.docType) {
        // don't calculate skew for spans. Just use parent's skew
        case 'span':
            return parentItem.skew;
        // transaction is the inital entry in a service. Calculate skew for this, and it will be propogated to all child spans
        case 'transaction': {
            const parentStart = parentItem.timestamp + parentItem.skew;
            const parentEnd = parentStart + parentItem.duration;
            // determine if child starts before the parent
            const offsetStart = parentStart - item.timestamp;
            // determine if child starts after the parent has ended
            const offsetEnd = item.timestamp - parentEnd;
            // child transaction starts before parent OR
            // child transaction starts after parent has ended
            if (offsetStart > 0 || offsetEnd > 0) {
                const latency = Math.max(parentItem.duration - item.duration, 0) / 2;
                return offsetStart + latency;
                // child transaction starts withing parent duration and no adjustment is needed
            }
            else {
                return 0;
            }
        }
    }
}
exports.getClockSkew = getClockSkew;
function getOrderedWaterfallItems(childrenByParentId, entryTransactionItem) {
    const visitedWaterfallItemSet = new Set();
    function getSortedChildren(item, parentItem) {
        if (visitedWaterfallItemSet.has(item)) {
            return [];
        }
        visitedWaterfallItemSet.add(item);
        const children = lodash_1.sortBy(childrenByParentId[item.id] || [], 'timestamp');
        item.childIds = children.map(child => child.id);
        item.offset = item.timestamp - entryTransactionItem.timestamp;
        item.skew = getClockSkew(item, parentItem);
        const deepChildren = lodash_1.flatten(children.map(child => getSortedChildren(child, item)));
        return [item, ...deepChildren];
    }
    return getSortedChildren(entryTransactionItem);
}
exports.getOrderedWaterfallItems = getOrderedWaterfallItems;
function getTraceRoot(childrenByParentId) {
    const item = lodash_1.first(childrenByParentId.root);
    if (item && item.docType === 'transaction') {
        return item.transaction;
    }
}
function getServices(items) {
    const serviceNames = items.map(item => item.serviceName);
    return lodash_1.uniq(serviceNames);
}
function getServiceColors(services) {
    const assignedColors = [
        eui_theme_light_json_1.default.euiColorVis1,
        eui_theme_light_json_1.default.euiColorVis0,
        eui_theme_light_json_1.default.euiColorVis3,
        eui_theme_light_json_1.default.euiColorVis2,
        eui_theme_light_json_1.default.euiColorVis6,
        eui_theme_light_json_1.default.euiColorVis7,
        eui_theme_light_json_1.default.euiColorVis5
    ];
    return lodash_1.zipObject(services, assignedColors);
}
function getDuration(items) {
    if (items.length === 0) {
        return 0;
    }
    const timestampStart = items[0].timestamp;
    const timestampEnd = Math.max(...items.map(item => item.timestamp + item.duration + item.skew));
    return timestampEnd - timestampStart;
}
function createGetTransactionById(itemsById) {
    return (id) => {
        if (!id) {
            return undefined;
        }
        const item = itemsById[id];
        if (idx_1.idx(item, _ => _.docType) === 'transaction') {
            return item.transaction;
        }
    };
}
function getWaterfall(trace, errorsPerTransaction, entryTransactionId) {
    if (lodash_1.isEmpty(trace) || !entryTransactionId) {
        return {
            services: [],
            duration: 0,
            orderedItems: [],
            itemsById: {},
            getTransactionById: () => undefined,
            errorCountByTransactionId: errorsPerTransaction,
            serviceColors: {}
        };
    }
    const waterfallItems = trace.map(traceItem => {
        const docType = traceItem.processor.event;
        switch (docType) {
            case 'span':
                return getSpanItem(traceItem);
            case 'transaction':
                return getTransactionItem(traceItem, errorsPerTransaction);
        }
    });
    const childrenByParentId = lodash_1.groupBy(waterfallItems, item => item.parentId ? item.parentId : 'root');
    const entryTransactionItem = waterfallItems.find(waterfallItem => waterfallItem.docType === 'transaction' &&
        waterfallItem.id === entryTransactionId);
    const itemsById = lodash_1.indexBy(waterfallItems, 'id');
    const orderedItems = entryTransactionItem
        ? getOrderedWaterfallItems(childrenByParentId, entryTransactionItem)
        : [];
    const traceRoot = getTraceRoot(childrenByParentId);
    const duration = getDuration(orderedItems);
    const traceRootDuration = traceRoot && traceRoot.transaction.duration.us;
    const services = getServices(orderedItems);
    const getTransactionById = createGetTransactionById(itemsById);
    const serviceColors = getServiceColors(services);
    return {
        traceRoot,
        traceRootDuration,
        duration,
        services,
        orderedItems,
        itemsById,
        getTransactionById,
        errorCountByTransactionId: errorsPerTransaction,
        serviceColors
    };
}
exports.getWaterfall = getWaterfall;
