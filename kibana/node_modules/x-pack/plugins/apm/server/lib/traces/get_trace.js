"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const get_trace_errors_per_transaction_1 = require("../errors/get_trace_errors_per_transaction");
const get_trace_items_1 = require("./get_trace_items");
async function getTrace(traceId, setup) {
    return Promise.all([
        get_trace_items_1.getTraceItems(traceId, setup),
        get_trace_errors_per_transaction_1.getTraceErrorsPerTransaction(traceId, setup)
    ]).then(([trace, errorsPerTransaction]) => ({
        trace,
        errorsPerTransaction
    }));
}
exports.getTrace = getTrace;
