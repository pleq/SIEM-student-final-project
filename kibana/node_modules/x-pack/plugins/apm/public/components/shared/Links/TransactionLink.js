"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const KibanaLink_1 = require("./KibanaLink");
const url_helpers_1 = require("./url_helpers");
/**
 * Return the path and query used to build a trace link
 */
function getLinkProps(transaction) {
    const serviceName = transaction.service.name;
    const transactionType = transaction.transaction.type;
    const traceId = transaction.trace.id;
    const transactionId = transaction.transaction.id;
    const name = transaction.transaction.name;
    const encodedName = url_helpers_1.legacyEncodeURIComponent(name);
    return {
        hash: `/${serviceName}/transactions/${transactionType}/${encodedName}`,
        query: {
            traceId,
            transactionId
        }
    };
}
exports.getLinkProps = getLinkProps;
exports.TransactionLink = ({ transaction, children }) => {
    if (!transaction) {
        return null;
    }
    const linkProps = getLinkProps(transaction);
    if (!linkProps) {
        // TODO: Should this case return unlinked children, null, or something else?
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return react_1.default.createElement(KibanaLink_1.KibanaLink, Object.assign({}, linkProps), children);
};
