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
const i18n_2 = require("x-pack/plugins/apm/common/i18n");
const formatters_1 = require("../../../../../../../utils/formatters");
const StickyProperties_1 = require("../../../../../../shared/StickyProperties");
function formatType(type) {
    switch (type) {
        case 'db':
            return 'DB';
        case 'hard-navigation':
            return i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.spanType.navigationTimingLabel', {
                defaultMessage: 'Navigation timing'
            });
        default:
            return type;
    }
}
function formatSubtype(subtype) {
    switch (subtype) {
        case 'mysql':
            return 'MySQL';
        default:
            return subtype;
    }
}
function getSpanTypes(span) {
    const { type, subtype, action } = span.span;
    const [primaryType, subtypeFromType, actionFromType] = type.split('.'); // This is to support 6.x data
    return {
        spanType: formatType(primaryType),
        spanSubtype: formatSubtype(subtype || subtypeFromType),
        spanAction: action || actionFromType
    };
}
function StickySpanProperties({ span, totalDuration }) {
    if (!totalDuration) {
        return null;
    }
    const spanName = span.span.name;
    const spanDuration = span.span.duration.us;
    const { spanType, spanSubtype, spanAction } = getSpanTypes(span);
    const stickyProperties = [
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.nameLabel', {
                defaultMessage: 'Name'
            }),
            fieldName: elasticsearch_fieldnames_1.SPAN_NAME,
            val: spanName || i18n_2.NOT_AVAILABLE_LABEL,
            truncated: true,
            width: '50%'
        },
        {
            fieldName: elasticsearch_fieldnames_1.SPAN_DURATION,
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.durationLabel', {
                defaultMessage: 'Duration'
            }),
            val: formatters_1.asMillis(spanDuration),
            width: '50%'
        },
        {
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.percentOfTransactionLabel', {
                defaultMessage: '% of transaction'
            }),
            val: formatters_1.asPercent(spanDuration, totalDuration),
            width: '50%'
        },
        {
            fieldName: elasticsearch_fieldnames_1.SPAN_TYPE,
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.typeLabel', {
                defaultMessage: 'Type'
            }),
            val: spanType,
            truncated: true,
            width: '15%'
        }
    ];
    if (spanSubtype) {
        stickyProperties.push({
            fieldName: elasticsearch_fieldnames_1.SPAN_SUBTYPE,
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.subtypeLabel', {
                defaultMessage: 'Subtype'
            }),
            val: spanSubtype,
            truncated: true,
            width: '15%'
        });
    }
    if (spanAction) {
        stickyProperties.push({
            fieldName: elasticsearch_fieldnames_1.SPAN_ACTION,
            label: i18n_1.i18n.translate('xpack.apm.transactionDetails.spanFlyout.actionLabel', {
                defaultMessage: 'Action'
            }),
            val: spanAction,
            truncated: true,
            width: '15%'
        });
    }
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.StickySpanProperties = StickySpanProperties;
