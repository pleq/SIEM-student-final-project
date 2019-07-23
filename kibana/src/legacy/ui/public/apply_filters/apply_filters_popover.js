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
import { EuiButton, EuiButtonEmpty, EuiForm, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiOverlayMask, EuiSwitch, } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import React, { Component } from 'react';
import { getFilterDisplayText } from '../filter_bar/filter_view';
var ApplyFiltersPopover = /** @class */ (function (_super) {
    tslib_1.__extends(ApplyFiltersPopover, _super);
    function ApplyFiltersPopover(props) {
        var _this = _super.call(this, props) || this;
        _this.isFilterSelected = function (i) {
            return _this.state.isFilterSelected[i];
        };
        _this.toggleFilterSelected = function (i) {
            var isFilterSelected = tslib_1.__spread(_this.state.isFilterSelected);
            isFilterSelected[i] = !isFilterSelected[i];
            _this.setState({ isFilterSelected: isFilterSelected });
        };
        _this.onSubmit = function () {
            var selectedFilters = _this.props.filters.filter(function (filter, i) { return _this.state.isFilterSelected[i]; });
            _this.props.onSubmit(selectedFilters);
        };
        _this.state = {
            isFilterSelected: props.filters.map(function () { return true; }),
        };
        return _this;
    }
    ApplyFiltersPopover.prototype.render = function () {
        var _this = this;
        if (this.props.filters.length === 0) {
            return '';
        }
        var form = (React.createElement(EuiForm, null, this.props.filters.map(function (filter, i) { return (React.createElement(EuiFormRow, { key: i },
            React.createElement(EuiSwitch, { label: getFilterDisplayText(filter), checked: _this.isFilterSelected(i), onChange: function () { return _this.toggleFilterSelected(i); } }))); })));
        return (React.createElement(EuiOverlayMask, null,
            React.createElement(EuiModal, { onClose: this.props.onCancel },
                React.createElement(EuiModalHeader, null,
                    React.createElement(EuiModalHeaderTitle, null,
                        React.createElement(FormattedMessage, { id: "common.ui.applyFilters.popupHeader", defaultMessage: "Select filters to apply" }))),
                React.createElement(EuiModalBody, null, form),
                React.createElement(EuiModalFooter, null,
                    React.createElement(EuiButtonEmpty, { onClick: this.props.onCancel },
                        React.createElement(FormattedMessage, { id: "common.ui.applyFiltersPopup.cancelButtonLabel", defaultMessage: "Cancel" })),
                    React.createElement(EuiButton, { onClick: this.onSubmit, fill: true },
                        React.createElement(FormattedMessage, { id: "common.ui.applyFiltersPopup.saveButtonLabel", defaultMessage: "Save" }))))));
    };
    ApplyFiltersPopover.defaultProps = {
        filters: [],
    };
    return ApplyFiltersPopover;
}(Component));
export { ApplyFiltersPopover };
