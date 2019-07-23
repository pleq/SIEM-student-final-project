/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as tslib_1 from "tslib";
import dateMath from '@elastic/datemath';
import { buildExistsFilter, buildPhraseFilter, buildPhrasesFilter, buildRangeFilter, } from '@kbn/es-query';
import { omit } from 'lodash';
import { isFilterable } from 'ui/index_patterns/static_utils';
import Ipv4Address from 'ui/utils/ipv4_address';
import { FILTER_OPERATORS } from './filter_operators';
export function getIndexPatternFromFilter(filter, indexPatterns) {
    return indexPatterns.find(function (indexPattern) { return indexPattern.id === filter.meta.index; });
}
export function getFieldFromFilter(filter, indexPattern) {
    return indexPattern.fields.find(function (field) { return field.name === filter.meta.key; });
}
export function getOperatorFromFilter(filter) {
    return FILTER_OPERATORS.find(function (operator) {
        return filter.meta.type === operator.type && filter.meta.negate === operator.negate;
    });
}
export function getQueryDslFromFilter(filter) {
    return omit(filter, ['$state', 'meta']);
}
export function getFilterableFields(indexPattern) {
    return indexPattern.fields.filter(isFilterable);
}
export function getOperatorOptions(field) {
    return FILTER_OPERATORS.filter(function (operator) {
        return !operator.fieldTypes || operator.fieldTypes.includes(field.type);
    });
}
export function getFilterParams(filter) {
    switch (filter.meta.type) {
        case 'phrase':
            return filter.meta.params.query;
        case 'phrases':
            return filter.meta.params;
        case 'range':
            return {
                from: filter.meta.params.gte,
                to: filter.meta.params.lt,
            };
    }
}
export function validateParams(params, type) {
    switch (type) {
        case 'date':
            var moment = typeof params === 'string' ? dateMath.parse(params) : null;
            return Boolean(typeof params === 'string' && moment && moment.isValid());
        case 'ip':
            try {
                return Boolean(new Ipv4Address(params));
            }
            catch (e) {
                return false;
            }
        default:
            return true;
    }
}
export function isFilterValid(indexPattern, field, operator, params) {
    if (!indexPattern || !field || !operator) {
        return false;
    }
    switch (operator.type) {
        case 'phrase':
            return validateParams(params, field.type);
        case 'phrases':
            if (!Array.isArray(params) || !params.length) {
                return false;
            }
            return params.every(function (phrase) { return validateParams(phrase, field.type); });
        case 'range':
            if (typeof params !== 'object') {
                return false;
            }
            return validateParams(params.from, field.type) || validateParams(params.to, field.type);
        case 'exists':
            return true;
        default:
            throw new Error("Unknown operator type: " + operator.type);
    }
}
export function buildFilter(indexPattern, field, operator, params, alias, store) {
    var filter = buildBaseFilter(indexPattern, field, operator, params);
    filter.meta.alias = alias;
    filter.meta.negate = operator.negate;
    filter.$state = { store: store };
    return filter;
}
function buildBaseFilter(indexPattern, field, operator, params) {
    switch (operator.type) {
        case 'phrase':
            return buildPhraseFilter(field, params, indexPattern);
        case 'phrases':
            return buildPhrasesFilter(field, params, indexPattern);
        case 'range':
            var newParams = { gte: params.from, lt: params.to };
            return buildRangeFilter(field, newParams, indexPattern);
        case 'exists':
            return buildExistsFilter(field, indexPattern);
        default:
            throw new Error("Unknown operator type: " + operator.type);
    }
}
export function buildCustomFilter(index, queryDsl, disabled, negate, alias, store) {
    var meta = { index: index, type: 'custom', disabled: disabled, negate: negate, alias: alias };
    var filter = tslib_1.__assign({}, queryDsl, { meta: meta });
    filter.$state = { store: store };
    return filter;
}
