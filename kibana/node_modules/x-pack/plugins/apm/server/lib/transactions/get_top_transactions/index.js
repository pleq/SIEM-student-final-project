"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
const transaction_groups_1 = require("../../transaction_groups");
async function getTopTransactions({ setup, transactionType, serviceName }) {
    const { start, end } = setup;
    const filter = [
        { term: { [elasticsearch_fieldnames_1.SERVICE_NAME]: serviceName } },
        { term: { [elasticsearch_fieldnames_1.PROCESSOR_EVENT]: 'transaction' } },
        {
            range: {
                '@timestamp': { gte: start, lte: end, format: 'epoch_millis' }
            }
        }
    ];
    if (transactionType) {
        filter.push({
            term: { [elasticsearch_fieldnames_1.TRANSACTION_TYPE]: transactionType }
        });
    }
    const bodyQuery = {
        bool: {
            filter
        }
    };
    return transaction_groups_1.getTransactionGroups(setup, bodyQuery);
}
exports.getTopTransactions = getTopTransactions;
