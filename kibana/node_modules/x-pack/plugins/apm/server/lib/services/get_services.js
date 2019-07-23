"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const idx_1 = require("x-pack/plugins/apm/common/idx");
const elasticsearch_fieldnames_1 = require("../../../common/elasticsearch_fieldnames");
async function getServices(setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        {
            bool: {
                should: [
                    { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'metric' } },
                    { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'transaction' } },
                    { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'error' } }
                ]
            }
        },
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
            config.get('apm_oss.metricsIndices'),
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
                services: {
                    terms: {
                        field: elasticsearch_fieldnames_1.SERVICE_NAME,
                        size: 500
                    },
                    aggs: {
                        avg: {
                            avg: { field: elasticsearch_fieldnames_1.TRANSACTION_DURATION }
                        },
                        agents: {
                            terms: { field: elasticsearch_fieldnames_1.SERVICE_AGENT_NAME, size: 1 }
                        },
                        events: {
                            terms: { field: elasticsearch_fieldnames_1.PROCESSOR_EVENT, size: 2 }
                        }
                    }
                }
            }
        }
    };
    const resp = await client('search', params);
    const aggs = resp.aggregations;
    const serviceBuckets = idx_1.idx(aggs, _ => _.services.buckets) || [];
    return serviceBuckets.map(bucket => {
        const eventTypes = bucket.events.buckets;
        const transactions = eventTypes.find(e => e.key === 'transaction');
        const totalTransactions = idx_1.idx(transactions, _ => _.doc_count) || 0;
        const errors = eventTypes.find(e => e.key === 'error');
        const totalErrors = idx_1.idx(errors, _ => _.doc_count) || 0;
        const deltaAsMinutes = (end - start) / 1000 / 60;
        const transactionsPerMinute = totalTransactions / deltaAsMinutes;
        const errorsPerMinute = totalErrors / deltaAsMinutes;
        return {
            serviceName: bucket.key,
            agentName: idx_1.idx(bucket, _ => _.agents.buckets[0].key),
            transactionsPerMinute,
            errorsPerMinute,
            avgResponseTime: bucket.avg.value
        };
    });
}
exports.getServices = getServices;
