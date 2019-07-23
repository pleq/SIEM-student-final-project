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
import { EuiButtonIcon, EuiContextMenu, EuiPopover, EuiPopoverTitle } from '@elastic/eui';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import { Component } from 'react';
import React from 'react';
var FilterOptionsUI = /** @class */ (function (_super) {
    tslib_1.__extends(FilterOptionsUI, _super);
    function FilterOptionsUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPopoverOpen: false,
        };
        _this.togglePopover = function () {
            _this.setState(function (prevState) { return ({
                isPopoverOpen: !prevState.isPopoverOpen,
            }); });
        };
        _this.closePopover = function () {
            _this.setState({ isPopoverOpen: false });
        };
        return _this;
    }
    FilterOptionsUI.prototype.render = function () {
        var _this = this;
        var panelTree = {
            id: 0,
            items: [
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.enableAllFiltersButtonLabel',
                        defaultMessage: 'Enable all',
                    }),
                    icon: 'eye',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onEnableAll();
                    },
                    'data-test-subj': 'enableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.disableAllFiltersButtonLabel',
                        defaultMessage: 'Disable all',
                    }),
                    icon: 'eyeClosed',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onDisableAll();
                    },
                    'data-test-subj': 'disableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.pinAllFiltersButtonLabel',
                        defaultMessage: 'Pin all',
                    }),
                    icon: 'pin',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onPinAll();
                    },
                    'data-test-subj': 'pinAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.unpinAllFiltersButtonLabel',
                        defaultMessage: 'Unpin all',
                    }),
                    icon: 'pin',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onUnpinAll();
                    },
                    'data-test-subj': 'unpinAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.invertNegatedFiltersButtonLabel',
                        defaultMessage: 'Invert inclusion',
                    }),
                    icon: 'invert',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onToggleAllNegated();
                    },
                    'data-test-subj': 'invertInclusionAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.invertDisabledFiltersButtonLabel',
                        defaultMessage: 'Invert enabled/disabled',
                    }),
                    icon: 'eye',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onToggleAllDisabled();
                    },
                    'data-test-subj': 'invertEnableDisableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'common.ui.searchBar.deleteAllFiltersButtonLabel',
                        defaultMessage: 'Remove all',
                    }),
                    icon: 'trash',
                    onClick: function () {
                        _this.closePopover();
                        _this.props.onRemoveAll();
                    },
                    'data-test-subj': 'removeAllFilters',
                },
            ],
        };
        return (React.createElement(EuiPopover, { id: "popoverForAllFilters", className: "globalFilterGroup__allFiltersPopover", isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, button: React.createElement(EuiButtonIcon, { onClick: this.togglePopover, color: "text", iconType: "gear", "aria-label": this.props.intl.formatMessage({
                    id: 'common.ui.searchBar.changeAllFiltersButtonLabel',
                    defaultMessage: 'Change all filters',
                }), title: this.props.intl.formatMessage({
                    id: 'common.ui.searchBar.changeAllFiltersButtonLabel',
                    defaultMessage: 'Change all filters',
                }), "data-test-subj": "showFilterActions" }), anchorPosition: "rightUp", panelPaddingSize: "none", withTitle: true },
            React.createElement(EuiPopoverTitle, null,
                React.createElement(FormattedMessage, { id: "common.ui.searchBar.changeAllFiltersTitle", defaultMessage: "Change all filters" })),
            React.createElement(EuiContextMenu, { initialPanelId: 0, panels: [panelTree] })));
    };
    return FilterOptionsUI;
}(Component));
export var FilterOptions = injectI18n(FilterOptionsUI);
