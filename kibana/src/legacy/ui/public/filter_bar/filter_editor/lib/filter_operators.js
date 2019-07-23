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
import { i18n } from '@kbn/i18n';
export var isOperator = {
    message: i18n.translate('common.ui.filterEditor.isOperatorOptionLabel', {
        defaultMessage: 'is',
    }),
    type: 'phrase',
    negate: false,
};
export var isNotOperator = {
    message: i18n.translate('common.ui.filterEditor.isNotOperatorOptionLabel', {
        defaultMessage: 'is not',
    }),
    type: 'phrase',
    negate: true,
};
export var isOneOfOperator = {
    message: i18n.translate('common.ui.filterEditor.isOneOfOperatorOptionLabel', {
        defaultMessage: 'is one of',
    }),
    type: 'phrases',
    negate: false,
    fieldTypes: ['string', 'number', 'date', 'ip', 'geo_point', 'geo_shape'],
};
export var isNotOneOfOperator = {
    message: i18n.translate('common.ui.filterEditor.isNotOneOfOperatorOptionLabel', {
        defaultMessage: 'is not one of',
    }),
    type: 'phrases',
    negate: true,
    fieldTypes: ['string', 'number', 'date', 'ip', 'geo_point', 'geo_shape'],
};
export var isBetweenOperator = {
    message: i18n.translate('common.ui.filterEditor.isBetweenOperatorOptionLabel', {
        defaultMessage: 'is between',
    }),
    type: 'range',
    negate: false,
    fieldTypes: ['number', 'date', 'ip'],
};
export var isNotBetweenOperator = {
    message: i18n.translate('common.ui.filterEditor.isNotBetweenOperatorOptionLabel', {
        defaultMessage: 'is not between',
    }),
    type: 'range',
    negate: true,
    fieldTypes: ['number', 'date', 'ip'],
};
export var existsOperator = {
    message: i18n.translate('common.ui.filterEditor.existsOperatorOptionLabel', {
        defaultMessage: 'exists',
    }),
    type: 'exists',
    negate: false,
};
export var doesNotExistOperator = {
    message: i18n.translate('common.ui.filterEditor.doesNotExistOperatorOptionLabel', {
        defaultMessage: 'does not exist',
    }),
    type: 'exists',
    negate: true,
};
export var FILTER_OPERATORS = [
    isOperator,
    isNotOperator,
    isOneOfOperator,
    isNotOneOfOperator,
    isBetweenOperator,
    isNotBetweenOperator,
    existsOperator,
    doesNotExistOperator,
];
