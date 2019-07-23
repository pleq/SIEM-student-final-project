"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
const idx_1 = require("x-pack/plugins/apm/common/idx");
async function getTransaction(transactionId, traceId, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const filter = [
        { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'transaction' } },
        { term: { [elasticsearch_fieldnames_1.TRANSACTION_ID]: transactionId } },
        { term: { [elasticsearch_fieldnames_1.TRACE_ID]: traceId } },
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
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 1,
            query: {
                bool: {
                    filter
                }
            }
        }
    };
    const resp = await client('search', params);
    return idx_1.idx(resp, _ => _.hits.hits[0]._source);
}
exports.getTransaction = getTransaction;
