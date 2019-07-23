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
import { EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiPopover } from '@elastic/eui';
import { buildEmptyFilter, disableFilter, enableFilter, pinFilter, toggleFilterDisabled, toggleFilterNegated, unpinFilter, } from '@kbn/es-query';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import classNames from 'classnames';
import React, { Component } from 'react';
import chrome from 'ui/chrome';
import { FilterOptions } from 'ui/search_bar/components/filter_options';
import { FilterEditor } from './filter_editor';
import { FilterItem } from './filter_item';
var config = chrome.getUiSettingsClient();
var FilterBarUI = /** @class */ (function (_super) {
    tslib_1.__extends(FilterBarUI, _super);
    function FilterBarUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isAddFilterPopoverOpen: false,
        };
        _this.onAdd = function (filter) {
            _this.onCloseAddFilterPopover();
            var filters = tslib_1.__spread(_this.props.filters, [filter]);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onRemove = function (i) {
            var filters = tslib_1.__spread(_this.props.filters);
            filters.splice(i, 1);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onUpdate = function (i, filter) {
            var filters = tslib_1.__spread(_this.props.filters);
            filters[i] = filter;
            _this.props.onFiltersUpdated(filters);
        };
        _this.onEnableAll = function () {
            var filters = _this.props.filters.map(enableFilter);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onDisableAll = function () {
            var filters = _this.props.filters.map(disableFilter);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onPinAll = function () {
            var filters = _this.props.filters.map(pinFilter);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onUnpinAll = function () {
            var filters = _this.props.filters.map(unpinFilter);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onToggleAllNegated = function () {
            var filters = _this.props.filters.map(toggleFilterNegated);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onToggleAllDisabled = function () {
            var filters = _this.props.filters.map(toggleFilterDisabled);
            _this.props.onFiltersUpdated(filters);
        };
        _this.onRemoveAll = function () {
            _this.props.onFiltersUpdated([]);
        };
        _this.onOpenAddFilterPopover = function () {
            _this.setState({
                isAddFilterPopoverOpen: true,
            });
        };
        _this.onCloseAddFilterPopover = function () {
            _this.setState({
                isAddFilterPopoverOpen: false,
            });
        };
        return _this;
    }
    FilterBarUI.prototype.render = function () {
        var classes = classNames('globalFilterBar', this.props.className);
        return (React.createElement(EuiFlexGroup, { className: "globalFilterGroup", gutterSize: "none", alignItems: "flexStart", responsive: false },
            React.createElement(EuiFlexItem, { className: "globalFilterGroup__branch", grow: false },
                React.createElement(FilterOptions, { onEnableAll: this.onEnableAll, onDisableAll: this.onDisableAll, onPinAll: this.onPinAll, onUnpinAll: this.onUnpinAll, onToggleAllNegated: this.onToggleAllNegated, onToggleAllDisabled: this.onToggleAllDisabled, onRemoveAll: this.onRemoveAll })),
            React.createElement(EuiFlexItem, null,
                React.createElement(EuiFlexGroup, { className: classes, wrap: true, responsive: false, gutterSize: "xs", alignItems: "center" },
                    this.renderItems(),
                    this.renderAddFilter()))));
    };
    FilterBarUI.prototype.renderItems = function () {
        var _this = this;
        return this.props.filters.map(function (filter, i) { return (React.createElement(EuiFlexItem, { key: i, grow: false },
            React.createElement(FilterItem, { id: "" + i, filter: filter, onUpdate: function (newFilter) { return _this.onUpdate(i, newFilter); }, onRemove: function () { return _this.onRemove(i); }, indexPatterns: _this.props.indexPatterns }))); });
    };
    FilterBarUI.prototype.renderAddFilter = function () {
        var isPinned = config.get('filters:pinnedByDefault');
        var _a = tslib_1.__read(this.props.indexPatterns, 1), indexPattern = _a[0];
        var index = indexPattern && indexPattern.id;
        var newFilter = buildEmptyFilter(isPinned, index);
        var button = (React.createElement(EuiButtonEmpty, { size: "xs", onClick: this.onOpenAddFilterPopover, "data-test-subj": "addFilter" },
            "+",
            ' ',
            React.createElement(FormattedMessage, { id: "common.ui.filterBar.addFilterButtonLabel", defaultMessage: "Add filter" })));
        return (React.createElement(EuiFlexItem, { grow: false },
            React.createElement(EuiPopover, { id: "addFilterPopover", button: button, isOpen: this.state.isAddFilterPopoverOpen, closePopover: this.onCloseAddFilterPopover, anchorPosition: "downLeft", withTitle: true, panelPaddingSize: "none", ownFocus: true },
                React.createElement(EuiFlexItem, { grow: false },
                    React.createElement("div", { style: { width: 400 } },
                        React.createElement(FilterEditor, { filter: newFilter, indexPatterns: this.props.indexPatterns, onSubmit: this.onAdd, onCancel: this.onCloseAddFilterPopover }))))));
    };
    return FilterBarUI;
}(Component));
export var FilterBar = injectI18n(FilterBarUI);
