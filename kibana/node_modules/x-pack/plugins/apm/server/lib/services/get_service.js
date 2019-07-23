"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const idx_1 = require("x-pack/plugins/apm/common/idx");
const elasticsearch_fieldnames_1 = require("../../../common/elasticsearch_fieldnames");
async function getService(serviceName, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [elasticsearch_fieldnames_1.SERVICE_NAME]: serviceName } },
        {
            range: {
                '@timestamp': {
                    gte: start,
                    lte: end,
                    format: 'epoch_millis'
                }
            }
        }
    ];
    if (esFilterQuery) {
        filter.push(esFilterQuery);
    }
    const params = {
        index: [
            config.get('apm_oss.errorIndices'),
            config.get('apm_oss.transactionIndices')
        ],
        body: {
            size: 0,
            query: {
                bool: {
                    filter
                }
            },
            aggs: {
                types: {
                    terms: { field: elasticsearch_fieldnames_1.TRANSACTION_TYPE, size: 100 }
                },
                agents: {
                    terms: { field: elasticsearch_fieldnames_1.SERVICE_AGENT_NAME, size: 1 }
                }
            }
        }
    };
    const { aggregations } = await client('search', params);
    const buckets = idx_1.idx(aggregations, _ => _.types.buckets) || [];
    const types = buckets.map(bucket => bucket.key);
    const agentName = idx_1.idx(aggregations, _ => _.agents.buckets[0].key);
    return {
        serviceName,
        types,
        agentName
    };
}
exports.getService = getService;
