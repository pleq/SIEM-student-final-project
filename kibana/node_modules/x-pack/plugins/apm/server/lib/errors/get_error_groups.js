"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const idx_1 = require("x-pack/plugins/apm/common/idx");
const elasticsearch_fieldnames_1 = require("../../../common/elasticsearch_fieldnames");
async function getErrorGroups({ serviceName, sortField, sortDirection = 'desc', setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const params = {
        index: config.get('apm_oss.errorIndices'),
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [elasticsearch_fieldnames_1.SERVICE_NAME]: serviceName } },
                        { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'error' } },
                        {
                            range: {
                                '@timestamp': {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            },
            aggs: {
                error_groups: {
                    terms: {
                        field: elasticsearch_fieldnames_1.ERROR_GROUP_ID,
                        size: 500,
                        order: { _count: sortDirection }
                    },
                    aggs: {
                        sample: {
                            top_hits: {
                                _source: [
                                    elasticsearch_fieldnames_1.ERROR_LOG_MESSAGE,
                                    elasticsearch_fieldnames_1.ERROR_EXC_MESSAGE,
                                    elasticsearch_fieldnames_1.ERROR_EXC_HANDLED,
                                    elasticsearch_fieldnames_1.ERROR_CULPRIT,
                                    elasticsearch_fieldnames_1.ERROR_GROUP_ID,
                                    '@timestamp'
                                ],
                                sort: [{ '@timestamp': 'desc' }],
                                size: 1
                            }
                        }
                    }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    // sort buckets by last occurrence of error
    if (sortField === 'latestOccurrenceAt') {
        params.body.aggs.error_groups.terms.order = {
            max_timestamp: sortDirection
        };
        params.body.aggs.error_groups.aggs.max_timestamp = {
            max: { field: '@timestamp' }
        };
    }
    const resp = await client('search', params);
    const buckets = idx_1.idx(resp, _ => _.aggregations.error_groups.buckets) || [];
    const hits = buckets.map(bucket => {
        const source = bucket.sample.hits.hits[0]._source;
        const message = idx_1.idx(source, _ => _.error.log.message) ||
            idx_1.idx(source, _ => _.error.exception[0].message);
        return {
            message,
            occurrenceCount: bucket.doc_count,
            culprit: idx_1.idx(source, _ => _.error.culprit),
            groupId: idx_1.idx(source, _ => _.error.grouping_key),
            latestOccurrenceAt: source['@timestamp'],
            handled: idx_1.idx(source, _ => _.error.exception[0].handled)
        };
    });
    return hits;
}
exports.getErrorGroups = getErrorGroups;
