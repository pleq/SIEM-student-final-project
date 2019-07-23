"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_request_1 = require("react-redux-request");
const waterfall_helpers_1 = require("../../components/app/TransactionDetails/Transaction/WaterfallContainer/Waterfall/waterfall_helpers/waterfall_helpers");
const traces_1 = require("../../services/rest/apm/traces");
exports.ID = 'waterfall';
function WaterfallRequest({ urlParams, render, traceId }) {
    const { start, end } = urlParams;
    if (!(traceId && start && end)) {
        return null;
    }
    return (react_1.default.createElement(react_redux_request_1.Request, { id: exports.ID, fn: traces_1.loadTrace, args: [{ traceId, start, end }], render: ({ args, data = { trace: [], errorsPerTransaction: {} }, status }) => {
            const waterfall = waterfall_helpers_1.getWaterfall(data.trace, data.errorsPerTransaction, urlParams.transactionId);
            return render({ args, data: waterfall, status });
        } }));
}
exports.WaterfallRequest = WaterfallRequest;
