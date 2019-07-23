"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_fieldnames_1 = require("../../../common/elasticsearch_fieldnames");
const transaction_groups_1 = require("../transaction_groups");
async function getTopTraces(setup) {
    const { start, end } = setup;
    const bodyQuery = {
        bool: {
            must: {
                // this criterion safeguards against data that lacks a transaction
                // parent ID but still is not a "trace" by way of not having a
                // trace ID (e.g. old data before parent ID was implemented, etc)
                exists: {
                    field: elasticsearch_fieldnames_1.TRACE_ID
                }
            },
            must_not: {
                // no parent ID alongside a trace ID means this transaction is a
                // "root" transaction, i.e. a trace
                exists: {
                    field: elasticsearch_fieldnames_1.PARENT_ID
                }
            },
            filter: [
                {
                    range: {
                        '@timestamp': {
                            gte: start,
                            lte: end,
                            format: 'epoch_millis'
                        }
                    }
                },
                { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'transaction' } }
            ],
            should: [{ term: { [elasticsearch_fieldnames_1.TRANSACTION_SAMPLED]: true } }]
        }
    };
    return transaction_groups_1.getTransactionGroups(setup, bodyQuery);
}
exports.getTopTraces = getTopTraces;
