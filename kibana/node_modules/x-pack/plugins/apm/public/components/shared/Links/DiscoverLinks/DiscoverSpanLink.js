"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
const DiscoverLink_1 = require("./DiscoverLink");
function getDiscoverQuery(span) {
    const query = `${elasticsearch_fieldnames_1.SPAN_ID}:"${span.span.id}"`;
    return {
        _a: {
            interval: 'auto',
            query: {
                language: 'lucene',
                query
            }
        }
    };
}
exports.DiscoverSpanLink = ({ span, children }) => {
    return react_1.default.createElement(DiscoverLink_1.DiscoverLink, { query: getDiscoverQuery(span), children: children });
};
