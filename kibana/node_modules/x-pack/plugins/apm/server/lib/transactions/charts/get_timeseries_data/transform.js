"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const i18n_1 = require("x-pack/plugins/apm/common/i18n");
const idx_1 = require("x-pack/plugins/apm/common/idx");
function timeseriesTransformer({ timeseriesResponse, bucketSize }) {
    const aggs = timeseriesResponse.aggregations;
    const overallAvgDuration = idx_1.idx(aggs, _ => _.overall_avg_duration.value);
    const responseTimeBuckets = idx_1.idx(aggs, _ => _.response_times.buckets);
    const { avg, p95, p99 } = getResponseTime(responseTimeBuckets);
    const transactionResultBuckets = idx_1.idx(aggs, _ => _.transaction_results.buckets);
    const tpmBuckets = getTpmBuckets(transactionResultBuckets, bucketSize);
    return {
        totalHits: timeseriesResponse.hits.total,
        responseTimes: {
            avg,
            p95,
            p99
        },
        tpmBuckets,
        overallAvgDuration
    };
}
exports.timeseriesTransformer = timeseriesTransformer;
function getTpmBuckets(transactionResultBuckets = [], bucketSize) {
    const buckets = transactionResultBuckets.map(({ key: resultKey, timeseries }) => {
        const dataPoints = timeseries.buckets.map(bucket => {
            return {
                x: bucket.key,
                y: lodash_1.round(bucket.doc_count * (60 / bucketSize), 1)
            };
        });
        // Handle empty string result keys
        const key = resultKey === '' ? i18n_1.NOT_AVAILABLE_LABEL : resultKey;
        return { key, dataPoints };
    });
    return lodash_1.sortBy(buckets, bucket => bucket.key.replace(/^HTTP (\d)xx$/, '00$1') // ensure that HTTP 3xx are sorted at the top
    );
}
exports.getTpmBuckets = getTpmBuckets;
function getResponseTime(responseTimeBuckets = []) {
    return responseTimeBuckets.reduce((acc, bucket) => {
        const { '95.0': p95, '99.0': p99 } = bucket.pct.values;
        acc.avg.push({ x: bucket.key, y: bucket.avg.value });
        acc.p95.push({ x: bucket.key, y: lodash_1.isNumber(p95) ? p95 : null });
        acc.p99.push({ x: bucket.key, y: lodash_1.isNumber(p99) ? p99 : null });
        return acc;
    }, {
        avg: [],
        p95: [],
        p99: []
    });
}
