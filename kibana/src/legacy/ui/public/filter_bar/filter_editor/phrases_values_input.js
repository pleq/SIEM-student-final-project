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
var PhrasesValuesInputUI = /** @class */ (function (_super) {
    tslib_1.__extends(PhrasesValuesInputUI, _super);
    function PhrasesValuesInputUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PhrasesValuesInputUI.prototype.render = function () {
        var suggestions = this.state.suggestions;
        var _a = this.props, values = _a.values, intl = _a.intl, onChange = _a.onChange;
        var options = values ? uniq(tslib_1.__spread(values, suggestions)) : suggestions;
        return (React.createElement(EuiFormRow, { label: intl.formatMessage({
                id: 'common.ui.filterEditor.valuesSelectLabel',
                defaultMessage: 'Values',
            }) },
            React.createElement(StringComboBox, { placeholder: intl.formatMessage({
                    id: 'common.ui.filterEditor.valuesSelectPlaceholder',
                    defaultMessage: 'Select values',
                }), options: options, getLabel: function (option) { return option; }, selectedOptions: values || [], onCreateOption: function (option) { return onChange(tslib_1.__spread((values || []), [option])); }, onChange: onChange, isClearable: false, "data-test-subj": "filterParamsComboBox phrasesParamsComboxBox" })));
    };
    return PhrasesValuesInputUI;
}(PhraseSuggestor));
function StringComboBox(props) {
    return GenericComboBox(props);
}
export var PhrasesValuesInput = injectI18n(PhrasesValuesInputUI);
