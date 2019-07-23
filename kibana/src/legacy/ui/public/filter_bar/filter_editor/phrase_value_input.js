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
import { EuiFormRow } from '@elastic/eui';
import { injectI18n } from '@kbn/i18n/react';
import { uniq } from 'lodash';
import React from 'react';
import { GenericComboBox } from './generic_combo_box';
import { PhraseSuggestor } from './phrase_suggestor';
import { ValueInputType } from './value_input_type';
var PhraseValueInputUI = /** @class */ (function (_super) {
    tslib_1.__extends(PhraseValueInputUI, _super);
    function PhraseValueInputUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PhraseValueInputUI.prototype.render = function () {
        return (React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'common.ui.filterEditor.valueInputLabel',
                defaultMessage: 'Value',
            }) }, this.isSuggestingValues() ? (this.renderWithSuggestions()) : (React.createElement(ValueInputType, { placeholder: this.props.intl.formatMessage({
                id: 'common.ui.filterEditor.valueInputPlaceholder',
                defaultMessage: 'Enter a value',
            }), value: this.props.value, onChange: this.props.onChange, type: this.props.field ? this.props.field.type : 'string' }))));
    };
    PhraseValueInputUI.prototype.renderWithSuggestions = function () {
        var suggestions = this.state.suggestions;
        var _a = this.props, value = _a.value, intl = _a.intl, onChange = _a.onChange;
        var options = value ? uniq(tslib_1.__spread([value], suggestions)) : suggestions;
        return (React.createElement(StringComboBox, { placeholder: intl.formatMessage({
                id: 'common.ui.filterEditor.valueSelectPlaceholder',
                defaultMessage: 'Select a value',
            }), options: options, getLabel: function (option) { return option; }, selectedOptions: value ? [value] : [], onChange: function (_a) {
                var _b = tslib_1.__read(_a, 1), _c = _b[0], newValue = _c === void 0 ? '' : _c;
                return onChange(newValue);
            }, onSearchChange: this.onSearchChange, singleSelection: { asPlainText: true }, onCreateOption: onChange, isClearable: false, "data-test-subj": "filterParamsComboBox phraseParamsComboxBox" }));
    };
    return PhraseValueInputUI;
}(PhraseSuggestor));
function StringComboBox(props) {
    return GenericComboBox(props);
}
export var PhraseValueInput = injectI18n(PhraseValueInputUI);
