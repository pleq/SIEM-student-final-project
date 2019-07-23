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
const i18n_2 = require("x-pack/plugins/apm/common/i18n");
const idx_1 = require("x-pack/plugins/apm/common/idx");
const KibanaLink_1 = require("x-pack/plugins/apm/public/components/shared/Links/KibanaLink");
const url_helpers_1 = require("x-pack/plugins/apm/public/components/shared/Links/url_helpers");
const elasticsearch_fieldnames_1 = require("../../../../../common/elasticsearch_fieldnames");
const formatters_1 = require("../../../../utils/formatters");
const StickyProperties_1 = require("../../../shared/StickyProperties");
function StickyTransactionProperties({ transaction, totalDuration, errorCount }) {
    const timestamp = transaction['@timestamp'];
    const url = idx_1.idx(transaction, _ => _.context.page.url) ||
        idx_1.idx(transaction, _ => _.url.full) ||
        i18n_2.NOT_AVAILABLE_LABEL;
    const duration = transaction.transaction.duration.us;
    const errorsOverviewLink = (react_1.default.createElement(KibanaLink_1.KibanaLink, { pathname: '/app/apm', hash: `/${idx_1.idx(transaction, _ => _.service.name)}/errors`, query: {
            kuery: url_helpers_1.legacyEncodeURIComponent(`trace.id : "${transaction.trace.id}" and transaction.id : "${transaction.transaction.id}"`)
        } }, i18n_1.i18n.translate('xpack.apm.transactionDetails.errorsOverviewLink', {
        values: { errorCount: errorCount || 0 },
        defaultMessage: '{errorCount, plural, one {View 1 error} other {View # errors}}'
    })));
    const noErrorsText = i18n_1.i18n.translate('xpack.apm.transactionDetails.errorsNone', {
        defaultMessage: 'None'
    });
    const stickyProperties = [
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.timestampLabel', {
                defaultMessage: 'Timestamp'
            }),
            fieldName: '@timestamp',
            val: timestamp,
            truncated: true,
            width: '50%'
        },
        {
            fieldName: elasticsearch_fieldnames_1.URL_FULL,
            label: 'URL',
            val: url,
            truncated: true,
            width: '50%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.durationLabel', {
                defaultMessage: 'Duration'
            }),
            fieldName: elasticsearch_fieldnames_1.TRANSACTION_DURATION,
            val: formatters_1.asTime(duration),
            width: '25%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.percentOfTraceLabel', {
                defaultMessage: '% of trace'
            }),
            val: formatters_1.asPercent(duration, totalDuration, i18n_2.NOT_AVAILABLE_LABEL),
            width: '25%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.resultLabel', {
                defaultMessage: 'Result'
            }),
            fieldName: elasticsearch_fieldnames_1.TRANSACTION_RESULT,
            val: idx_1.idx(transaction, _ => _.transaction.result) || i18n_2.NOT_AVAILABLE_LABEL,
            width: '25%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.userIdLabel', {
                defaultMessage: 'User ID'
            }),
            fieldName: elasticsearch_fieldnames_1.USER_ID,
            val: idx_1.idx(transaction, _ => _.user.id) || i18n_2.NOT_AVAILABLE_LABEL,
            truncated: true,
            width: '25%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.errorsOverviewLabel', {
                defaultMessage: 'Errors'
            }),
            val: errorCount ? errorsOverviewLink : noErrorsText,
            width: '25%'
        }
    ];
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.StickyTransactionProperties = StickyTransactionProperties;
