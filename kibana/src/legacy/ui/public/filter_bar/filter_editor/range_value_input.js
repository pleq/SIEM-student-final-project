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
import { EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiIcon, EuiLink } from '@elastic/eui';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import { get } from 'lodash';
import { Component } from 'react';
import React from 'react';
import { getDocLink } from 'ui/documentation_links';
import { ValueInputType } from './value_input_type';
var RangeValueInputUI = /** @class */ (function (_super) {
    tslib_1.__extends(RangeValueInputUI, _super);
    function RangeValueInputUI(props) {
        var _this = _super.call(this, props) || this;
        _this.onFromChange = function (value) {
            if (typeof value !== 'string' && typeof value !== 'number') {
                throw new Error('Range params must be a string or number');
            }
            _this.props.onChange({ from: value, to: get(_this, 'props.value.to') });
        };
        _this.onToChange = function (value) {
            if (typeof value !== 'string' && typeof value !== 'number') {
                throw new Error('Range params must be a string or number');
            }
            _this.props.onChange({ from: get(_this, 'props.value.from'), to: value });
        };
        return _this;
    }
    RangeValueInputUI.prototype.render = function () {
        var type = this.props.field ? this.props.field.type : 'string';
        return (React.createElement("div", null,
            React.createElement(EuiFlexGroup, { style: { maxWidth: 600 } },
                React.createElement(EuiFlexItem, null,
                    React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                            id: 'common.ui.filterEditor.rangeStartInputLabel',
                            defaultMessage: 'From',
                        }) },
                        React.createElement(ValueInputType, { type: type, value: this.props.value ? this.props.value.from : undefined, onChange: this.onFromChange, placeholder: this.props.intl.formatMessage({
                                id: 'common.ui.filterEditor.rangeStartInputPlaceholder',
                                defaultMessage: 'Start of the range',
                            }) }))),
                React.createElement(EuiFlexItem, null,
                    React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                            id: 'common.ui.filterEditor.rangeEndInputLabel',
                            defaultMessage: 'To',
                        }) },
                        React.createElement(ValueInputType, { type: type, value: this.props.value ? this.props.value.to : undefined, onChange: this.onToChange, placeholder: this.props.intl.formatMessage({
                                id: 'common.ui.filterEditor.rangeEndInputPlaceholder',
                                defaultMessage: 'End of the range',
                            }) })))),
            type === 'date' ? (React.createElement(EuiLink, { target: "_window", href: getDocLink('date.dateMath') },
                React.createElement(FormattedMessage, { id: "common.ui.filterEditor.dateFormatHelpLinkLabel", defaultMessage: "Accepted date formats" }),
                ' ',
                React.createElement(EuiIcon, { type: "link" }))) : ('')));
    };
    return RangeValueInputUI;
}(Component));
export var RangeValueInput = injectI18n(RangeValueInputUI);
