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
// @ts-ignore
import { EuiFilterButton } from '@elastic/eui';
import { injectI18n } from '@kbn/i18n/react';
import classNames from 'classnames';
import React, { Component } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { FilterBar } from 'ui/filter_bar';
import { QueryBar } from 'ui/query_bar';
var SearchBarUI = /** @class */ (function (_super) {
    tslib_1.__extends(SearchBarUI, _super);
    function SearchBarUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filterBarRef = null;
        _this.filterBarWrapperRef = null;
        _this.state = {
            isFiltersVisible: true,
        };
        _this.setFilterBarHeight = function () {
            requestAnimationFrame(function () {
                var height = _this.filterBarRef && _this.state.isFiltersVisible ? _this.filterBarRef.clientHeight : 0;
                if (_this.filterBarWrapperRef) {
                    _this.filterBarWrapperRef.setAttribute('style', "height: " + height + "px");
                }
            });
        };
        // member-ordering rules conflict with use-before-declaration rules
        /* tslint:disable */
        _this.ro = new ResizeObserver(_this.setFilterBarHeight);
        /* tslint:enable */
        _this.toggleFiltersVisible = function () {
            _this.setState({
                isFiltersVisible: !_this.state.isFiltersVisible,
            });
        };
        return _this;
    }
    SearchBarUI.prototype.componentDidMount = function () {
        if (this.filterBarRef) {
            this.setFilterBarHeight();
            this.ro.observe(this.filterBarRef);
        }
    };
    SearchBarUI.prototype.componentDidUpdate = function () {
        if (this.filterBarRef) {
            this.setFilterBarHeight();
            this.ro.unobserve(this.filterBarRef);
        }
    };
    SearchBarUI.prototype.render = function () {
        var _this = this;
        var filtersAppliedText = this.props.intl.formatMessage({
            id: 'common.ui.searchBar.filtersButtonFiltersAppliedTitle',
            defaultMessage: 'filters applied.',
        });
        var clickToShowOrHideText = this.state.isFiltersVisible
            ? this.props.intl.formatMessage({
                id: 'common.ui.searchBar.filtersButtonClickToShowTitle',
                defaultMessage: 'Select to hide',
            })
            : this.props.intl.formatMessage({
                id: 'common.ui.searchBar.filtersButtonClickToHideTitle',
                defaultMessage: 'Select to show',
            });
        var filterTriggerButton = (React.createElement(EuiFilterButton, { onClick: this.toggleFiltersVisible, isSelected: this.state.isFiltersVisible, hasActiveFilters: this.state.isFiltersVisible, numFilters: this.props.filters.length > 0 ? this.props.filters.length : null, "aria-controls": "GlobalFilterGroup", "aria-expanded": !!this.state.isFiltersVisible, title: this.props.filters.length + " " + filtersAppliedText + " " + clickToShowOrHideText }, "Filters"));
        var classes = classNames('globalFilterGroup__wrapper', {
            'globalFilterGroup__wrapper-isVisible': this.state.isFiltersVisible,
        });
        return (React.createElement("div", { className: "globalQueryBar" },
            this.props.showQueryBar ? (React.createElement(QueryBar, { query: this.props.query, onSubmit: this.props.onQuerySubmit, appName: this.props.appName, indexPatterns: this.props.indexPatterns, store: this.props.store, prepend: this.props.showFilterBar ? filterTriggerButton : '', showDatePicker: this.props.showDatePicker, dateRangeFrom: this.props.dateRangeFrom, dateRangeTo: this.props.dateRangeTo, isRefreshPaused: this.props.isRefreshPaused, refreshInterval: this.props.refreshInterval, showAutoRefreshOnly: this.props.showAutoRefreshOnly, onRefreshChange: this.props.onRefreshChange })) : (''),
            this.props.showFilterBar ? (React.createElement("div", { id: "GlobalFilterGroup", ref: function (node) {
                    _this.filterBarWrapperRef = node;
                }, className: classes },
                React.createElement("div", { ref: function (node) {
                        _this.filterBarRef = node;
                    } },
                    React.createElement(FilterBar, { className: "globalFilterGroup__filterBar", filters: this.props.filters, onFiltersUpdated: this.props.onFiltersUpdated, indexPatterns: this.props.indexPatterns })))) : ('')));
    };
    SearchBarUI.defaultProps = {
        showQueryBar: true,
        showFilterBar: true,
    };
    return SearchBarUI;
}(Component));
export var SearchBar = injectI18n(SearchBarUI);
