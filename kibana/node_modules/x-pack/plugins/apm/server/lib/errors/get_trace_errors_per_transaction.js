"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
async function getTraceErrorsPerTransaction(traceId, setup) {
    const { start, end, client, config } = setup;
    const params = {
        index: [config.get('apm_oss.errorIndices')],
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [elasticsearch_fieldnames_1.TRACE_ID]: traceId } },
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
                transactions: {
                    terms: {
                        field: 'transaction.id'
                    }
                }
            }
        }
    };
    const resp = await client('search', params);
    return resp.aggregations.transactions.buckets.reduce((acc, bucket) => ({
        ...acc,
        [bucket.key]: bucket.doc_count
    }), {});
}
exports.getTraceErrorsPerTransaction = getTraceErrorsPerTransaction;
