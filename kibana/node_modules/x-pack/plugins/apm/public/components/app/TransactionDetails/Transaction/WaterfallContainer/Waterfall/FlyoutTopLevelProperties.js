"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
const KibanaLink_1 = require("x-pack/plugins/apm/public/components/shared/Links/KibanaLink");
const TransactionLink_1 = require("x-pack/plugins/apm/public/components/shared/Links/TransactionLink");
const StickyProperties_1 = require("x-pack/plugins/apm/public/components/shared/StickyProperties");
function FlyoutTopLevelProperties({ transaction }) {
    if (!transaction) {
        return null;
    }
    const stickyProperties = [
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.serviceLabel', {
                defaultMessage: 'Service'
            }),
            fieldName: elasticsearch_fieldnames_1.SERVICE_NAME,
            val: (react_1.default.createElement(KibanaLink_1.KibanaLink, { hash: `/${transaction.service.name}` }, transaction.service.name)),
            width: '50%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.transactionLabel', {
                defaultMessage: 'Transaction'
            }),
            fieldName: elasticsearch_fieldnames_1.TRANSACTION_NAME,
            val: (react_1.default.createElement(TransactionLink_1.TransactionLink, { transaction: transaction }, transaction.transaction.name)),
            width: '50%'
        }
    ];
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.FlyoutTopLevelProperties = FlyoutTopLevelProperties;
