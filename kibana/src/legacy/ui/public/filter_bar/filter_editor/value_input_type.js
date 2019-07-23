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
import { EuiFieldNumber, EuiFieldText, EuiSelect } from '@elastic/eui';
import { injectI18n } from '@kbn/i18n/react';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { validateParams } from './lib/filter_editor_utils';
var ValueInputTypeUI = /** @class */ (function (_super) {
    tslib_1.__extends(ValueInputTypeUI, _super);
    function ValueInputTypeUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onBoolChange = function (event) {
            var boolValue = event.target.value === 'true';
            _this.props.onChange(boolValue);
        };
        _this.onChange = function (event) {
            var params = event.target.value;
            _this.props.onChange(params);
        };
        return _this;
    }
    ValueInputTypeUI.prototype.render = function () {
        var value = this.props.value;
        var inputElement;
        switch (this.props.type) {
            case 'string':
                inputElement = (React.createElement(EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange }));
                break;
            case 'number':
                inputElement = (React.createElement(EuiFieldNumber, { placeholder: this.props.placeholder, value: typeof value === 'string' ? parseFloat(value) : value, onChange: this.onChange }));
                break;
            case 'date':
                inputElement = (React.createElement(EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange, isInvalid: !isEmpty(value) && !validateParams(value, this.props.type) }));
                break;
            case 'ip':
                inputElement = (React.createElement(EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange, isInvalid: !isEmpty(value) && !validateParams(value, this.props.type) }));
                break;
            case 'boolean':
                inputElement = (React.createElement(EuiSelect, { options: [
                        { value: undefined, text: this.props.placeholder },
                        {
                            value: 'true',
                            text: this.props.intl.formatMessage({
                                id: 'common.ui.filterEditor.trueOptionLabel',
                                defaultMessage: 'true',
                            }),
                        },
                        {
                            value: 'false',
                            text: this.props.intl.formatMessage({
                                id: 'common.ui.filterEditor.falseOptionLabel',
                                defaultMessage: 'false',
                            }),
                        },
                    ], value: value, onChange: this.onBoolChange }));
                break;
            default:
                break;
        }
        return inputElement;
    };
    return ValueInputTypeUI;
}(Component));
export var ValueInputType = injectI18n(ValueInputTypeUI);
