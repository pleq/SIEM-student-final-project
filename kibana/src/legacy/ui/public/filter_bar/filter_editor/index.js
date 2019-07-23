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
import { EuiButton, EuiButtonEmpty, 
// @ts-ignore
EuiCodeEditor, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiPopoverTitle, EuiSpacer, EuiSwitch, } from '@elastic/eui';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import { get } from 'lodash';
import React, { Component } from 'react';
import { GenericComboBox } from './generic_combo_box';
import { buildCustomFilter, buildFilter, getFieldFromFilter, getFilterableFields, getFilterParams, getIndexPatternFromFilter, getOperatorFromFilter, getOperatorOptions, getQueryDslFromFilter, isFilterValid, } from './lib/filter_editor_utils';
import { PhraseValueInput } from './phrase_value_input';
import { PhrasesValuesInput } from './phrases_values_input';
import { RangeValueInput } from './range_value_input';
var FilterEditorUI = /** @class */ (function (_super) {
    tslib_1.__extends(FilterEditorUI, _super);
    function FilterEditorUI(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleCustomEditor = function () {
            var isCustomEditorOpen = !_this.state.isCustomEditorOpen;
            _this.setState({ isCustomEditorOpen: isCustomEditorOpen });
        };
        _this.onIndexPatternChange = function (_a) {
            var _b = tslib_1.__read(_a, 1), selectedIndexPattern = _b[0];
            var selectedField = undefined;
            var selectedOperator = undefined;
            var params = undefined;
            _this.setState({ selectedIndexPattern: selectedIndexPattern, selectedField: selectedField, selectedOperator: selectedOperator, params: params });
        };
        _this.onFieldChange = function (_a) {
            var _b = tslib_1.__read(_a, 1), selectedField = _b[0];
            var selectedOperator = undefined;
            var params = undefined;
            _this.setState({ selectedField: selectedField, selectedOperator: selectedOperator, params: params });
        };
        _this.onOperatorChange = function (_a) {
            var _b = tslib_1.__read(_a, 1), selectedOperator = _b[0];
            // Only reset params when the operator type changes
            var params = get(_this.state.selectedOperator, 'type') === get(selectedOperator, 'type')
                ? _this.state.params
                : undefined;
            _this.setState({ selectedOperator: selectedOperator, params: params });
        };
        _this.onCustomLabelSwitchChange = function (event) {
            var useCustomLabel = event.target.checked;
            var customLabel = event.target.checked ? '' : null;
            _this.setState({ useCustomLabel: useCustomLabel, customLabel: customLabel });
        };
        _this.onCustomLabelChange = function (event) {
            var customLabel = event.target.value;
            _this.setState({ customLabel: customLabel });
        };
        _this.onParamsChange = function (params) {
            _this.setState({ params: params });
        };
        _this.onQueryDslChange = function (queryDsl) {
            _this.setState({ queryDsl: queryDsl });
        };
        _this.onSubmit = function () {
            var _a = _this.state, indexPattern = _a.selectedIndexPattern, field = _a.selectedField, operator = _a.selectedOperator, params = _a.params, useCustomLabel = _a.useCustomLabel, customLabel = _a.customLabel, isCustomEditorOpen = _a.isCustomEditorOpen, queryDsl = _a.queryDsl;
            var store = _this.props.filter.$state.store;
            var alias = useCustomLabel ? customLabel : null;
            if (isCustomEditorOpen) {
                var _b = _this.props.filter.meta, index = _b.index, disabled = _b.disabled, negate = _b.negate;
                var newIndex = index || _this.props.indexPatterns[0].id;
                var body = JSON.parse(queryDsl);
                var filter = buildCustomFilter(newIndex, body, disabled, negate, alias, store);
                _this.props.onSubmit(filter);
            }
            else if (indexPattern && field && operator) {
                var filter = buildFilter(indexPattern, field, operator, params, alias, store);
                _this.props.onSubmit(filter);
            }
        };
        _this.state = {
            selectedIndexPattern: _this.getIndexPatternFromFilter(),
            selectedField: _this.getFieldFromFilter(),
            selectedOperator: _this.getSelectedOperator(),
            params: getFilterParams(props.filter),
            useCustomLabel: props.filter.meta.alias !== null,
            customLabel: props.filter.meta.alias,
            queryDsl: JSON.stringify(getQueryDslFromFilter(props.filter), null, 2),
            isCustomEditorOpen: _this.isUnknownFilterType(),
        };
        return _this;
    }
    FilterEditorUI.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(EuiPopoverTitle, null,
                React.createElement(EuiFlexGroup, { alignItems: "baseline" },
                    React.createElement(EuiFlexItem, null,
                        React.createElement(FormattedMessage, { id: "common.ui.filterEditor.editFilterPopupTitle", defaultMessage: "Edit filter" })),
                    React.createElement(EuiFlexItem, { grow: false },
                        React.createElement(EuiButtonEmpty, { size: "xs", onClick: this.toggleCustomEditor }, this.state.isCustomEditorOpen ? (React.createElement(FormattedMessage, { id: "common.ui.filterEditor.editFilterValuesButtonLabel", defaultMessage: "Edit filter values" })) : (React.createElement(FormattedMessage, { id: "common.ui.filterEditor.editQueryDslButtonLabel", defaultMessage: "Edit as Query DSL" })))))),
            React.createElement("div", { className: "globalFilterItem__editorForm" },
                React.createElement(EuiForm, null,
                    this.renderIndexPatternInput(),
                    this.state.isCustomEditorOpen ? this.renderCustomEditor() : this.renderRegularEditor(),
                    React.createElement(EuiSpacer, { size: "m" }),
                    React.createElement(EuiSwitch, { id: "filterEditorCustomLabelSwitch", label: this.props.intl.formatMessage({
                            id: 'common.ui.filterEditor.createCustomLabelSwitchLabel',
                            defaultMessage: 'Create custom label?',
                        }), checked: this.state.useCustomLabel, onChange: this.onCustomLabelSwitchChange }),
                    this.state.useCustomLabel && (React.createElement("div", null,
                        React.createElement(EuiSpacer, { size: "m" }),
                        React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                                id: 'common.ui.filterEditor.createCustomLabelInputLabel',
                                defaultMessage: 'Custom label',
                            }) },
                            React.createElement(EuiFieldText, { value: "" + this.state.customLabel, onChange: this.onCustomLabelChange })))),
                    React.createElement(EuiSpacer, { size: "m" }),
                    React.createElement(EuiFlexGroup, { direction: "rowReverse", alignItems: "center" },
                        React.createElement(EuiFlexItem, { grow: false },
                            React.createElement(EuiButton, { fill: true, onClick: this.onSubmit, isDisabled: !this.isFilterValid(), "data-test-subj": "saveFilter" },
                                React.createElement(FormattedMessage, { id: "common.ui.filterEditor.saveButtonLabel", defaultMessage: "Save" }))),
                        React.createElement(EuiFlexItem, { grow: false },
                            React.createElement(EuiButtonEmpty, { flush: "right", onClick: this.props.onCancel, "data-test-subj": "cancelSaveFilter" },
                                React.createElement(FormattedMessage, { id: "common.ui.filterEditor.cancelButtonLabel", defaultMessage: "Cancel" }))),
                        React.createElement(EuiFlexItem, null))))));
    };
    FilterEditorUI.prototype.renderIndexPatternInput = function () {
        if (this.props.indexPatterns.length <= 1) {
            return '';
        }
        var selectedIndexPattern = this.state.selectedIndexPattern;
        return (React.createElement(EuiFlexGroup, null,
            React.createElement(EuiFlexItem, null,
                React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                        id: 'common.ui.filterEditor.indexPatternSelectLabel',
                        defaultMessage: 'Index Pattern',
                    }) },
                    React.createElement(IndexPatternComboBox, { placeholder: this.props.intl.formatMessage({
                            id: 'common.ui.filterBar.indexPatternSelectPlaceholder',
                            defaultMessage: 'Select an index pattern',
                        }), options: this.props.indexPatterns, selectedOptions: selectedIndexPattern ? [selectedIndexPattern] : [], getLabel: function (indexPattern) { return indexPattern.title; }, onChange: this.onIndexPatternChange, singleSelection: { asPlainText: true }, isClearable: false })))));
    };
    FilterEditorUI.prototype.renderRegularEditor = function () {
        return (React.createElement("div", null,
            React.createElement(EuiFlexGroup, null,
                React.createElement(EuiFlexItem, { style: { maxWidth: '188px' } }, this.renderFieldInput()),
                React.createElement(EuiFlexItem, { style: { maxWidth: '188px' } }, this.renderOperatorInput())),
            React.createElement(EuiSpacer, { size: "m" }),
            React.createElement("div", { "data-test-subj": "filterParams" }, this.renderParamsEditor())));
    };
    FilterEditorUI.prototype.renderFieldInput = function () {
        var _a = this.state, selectedIndexPattern = _a.selectedIndexPattern, selectedField = _a.selectedField;
        var fields = selectedIndexPattern ? getFilterableFields(selectedIndexPattern) : [];
        return (React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'common.ui.filterEditor.fieldSelectLabel',
                defaultMessage: 'Field',
            }) },
            React.createElement(FieldComboBox, { id: "fieldInput", isDisabled: !selectedIndexPattern, placeholder: this.props.intl.formatMessage({
                    id: 'common.ui.filterEditor.fieldSelectPlaceholder',
                    defaultMessage: 'Select a field',
                }), options: fields, selectedOptions: selectedField ? [selectedField] : [], getLabel: function (field) { return field.name; }, onChange: this.onFieldChange, singleSelection: { asPlainText: true }, isClearable: false, "data-test-subj": "filterFieldSuggestionList" })));
    };
    FilterEditorUI.prototype.renderOperatorInput = function () {
        var _a = this.state, selectedField = _a.selectedField, selectedOperator = _a.selectedOperator;
        var operators = selectedField ? getOperatorOptions(selectedField) : [];
        return (React.createElement(EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'common.ui.filterEditor.operatorSelectLabel',
                defaultMessage: 'Operator',
            }) },
            React.createElement(OperatorComboBox, { isDisabled: !selectedField, placeholder: this.props.intl.formatMessage({
                    id: 'common.ui.filterEditor.operatorSelectPlaceholder',
                    defaultMessage: 'Select an operator',
                }), options: operators, selectedOptions: selectedOperator ? [selectedOperator] : [], getLabel: function (_a) {
                    var message = _a.message;
                    return message;
                }, onChange: this.onOperatorChange, singleSelection: { asPlainText: true }, isClearable: false, "data-test-subj": "filterOperatorList" })));
    };
    FilterEditorUI.prototype.renderCustomEditor = function () {
        return (React.createElement(EuiFormRow, { label: "Value" },
            React.createElement(EuiCodeEditor, { value: this.state.queryDsl, onChange: this.onQueryDslChange, mode: "json", width: "100%", height: "250px" })));
    };
    FilterEditorUI.prototype.renderParamsEditor = function () {
        var indexPattern = this.state.selectedIndexPattern;
        if (!indexPattern || !this.state.selectedOperator) {
            return '';
        }
        switch (this.state.selectedOperator.type) {
            case 'exists':
                return '';
            case 'phrase':
                return (React.createElement(PhraseValueInput, { indexPattern: indexPattern, field: this.state.selectedField, value: this.state.params, onChange: this.onParamsChange, "data-test-subj": "phraseValueInput" }));
            case 'phrases':
                return (React.createElement(PhrasesValuesInput, { indexPattern: indexPattern, field: this.state.selectedField, values: this.state.params, onChange: this.onParamsChange }));
            case 'range':
                return (React.createElement(RangeValueInput, { field: this.state.selectedField, value: this.state.params, onChange: this.onParamsChange }));
        }
    };
    FilterEditorUI.prototype.isUnknownFilterType = function () {
        var type = this.props.filter.meta.type;
        return !!type && !['phrase', 'phrases', 'range', 'exists'].includes(type);
    };
    FilterEditorUI.prototype.getIndexPatternFromFilter = function () {
        return getIndexPatternFromFilter(this.props.filter, this.props.indexPatterns);
    };
    FilterEditorUI.prototype.getFieldFromFilter = function () {
        var indexPattern = this.getIndexPatternFromFilter();
        return indexPattern && getFieldFromFilter(this.props.filter, indexPattern);
    };
    FilterEditorUI.prototype.getSelectedOperator = function () {
        return getOperatorFromFilter(this.props.filter);
    };
    FilterEditorUI.prototype.isFilterValid = function () {
        var _a = this.state, isCustomEditorOpen = _a.isCustomEditorOpen, queryDsl = _a.queryDsl, indexPattern = _a.selectedIndexPattern, field = _a.selectedField, operator = _a.selectedOperator, params = _a.params;
        if (isCustomEditorOpen) {
            try {
                return Boolean(JSON.parse(queryDsl));
            }
            catch (e) {
                return false;
            }
        }
        return isFilterValid(indexPattern, field, operator, params);
    };
    return FilterEditorUI;
}(Component));
function IndexPatternComboBox(props) {
    return GenericComboBox(props);
}
function FieldComboBox(props) {
    return GenericComboBox(props);
}
function OperatorComboBox(props) {
    return GenericComboBox(props);
}
export var FilterEditor = injectI18n(FilterEditorUI);
