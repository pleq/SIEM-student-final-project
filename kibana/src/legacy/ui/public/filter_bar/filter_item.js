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
import { EuiContextMenu, EuiPopover } from '@elastic/eui';
import { isFilterPinned, toggleFilterDisabled, toggleFilterNegated, toggleFilterPinned, } from '@kbn/es-query';
import { injectI18n } from '@kbn/i18n/react';
import classNames from 'classnames';
import React, { Component } from 'react';
import { FilterEditor } from './filter_editor';
import { FilterView } from './filter_view';
var FilterItemUI = /** @class */ (function (_super) {
    tslib_1.__extends(FilterItemUI, _super);
    function FilterItemUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPopoverOpen: false,
        };
        _this.closePopover = function () {
            _this.setState({
                isPopoverOpen: false,
            });
        };
        _this.togglePopover = function () {
            _this.setState({
                isPopoverOpen: !_this.state.isPopoverOpen,
            });
        };
        _this.onSubmit = function (filter) {
            _this.closePopover();
            _this.props.onUpdate(filter);
        };
        _this.onTogglePinned = function () {
            var filter = toggleFilterPinned(_this.props.filter);
            _this.props.onUpdate(filter);
        };
        _this.onToggleNegated = function () {
            var filter = toggleFilterNegated(_this.props.filter);
            _this.props.onUpdate(filter);
        };
        _this.onToggleDisabled = function () {
            var filter = toggleFilterDisabled(_this.props.filter);
            _this.props.onUpdate(filter);
        };
        return _this;
    }
    FilterItemUI.prototype.render = function () {
        var _this = this;
        var _a = this.props, filter = _a.filter, id = _a.id;
        var _b = filter.meta, negate = _b.negate, disabled = _b.disabled;
        var classes = classNames('globalFilterItem', {
            'globalFilterItem-isDisabled': disabled,
            'globalFilterItem-isPinned': isFilterPinned(filter),
            'globalFilterItem-isExcluded': negate,
        }, this.props.className);
        var dataTestSubjKey = filter.meta.key ? "filter-key-" + filter.meta.key : '';
        var dataTestSubjValue = filter.meta.value ? "filter-value-" + filter.meta.value : '';
        var dataTestSubjDisabled = "filter-" + (this.props.filter.meta.disabled ? 'disabled' : 'enabled');
        var badge = (React.createElement(FilterView, { filter: filter, className: classes, iconOnClick: function () { return _this.props.onRemove(); }, onClick: this.togglePopover, "data-test-subj": "filter " + dataTestSubjDisabled + " " + dataTestSubjKey + " " + dataTestSubjValue }));
        var panelTree = [
            {
                id: 0,
                items: [
                    {
                        name: isFilterPinned(filter)
                            ? this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.unpinFilterButtonLabel',
                                defaultMessage: 'Unpin',
                            })
                            : this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.pinFilterButtonLabel',
                                defaultMessage: 'Pin across all apps',
                            }),
                        icon: 'pin',
                        onClick: function () {
                            _this.closePopover();
                            _this.onTogglePinned();
                        },
                        'data-test-subj': 'pinFilter',
                    },
                    {
                        name: this.props.intl.formatMessage({
                            id: 'common.ui.filterBar.editFilterButtonLabel',
                            defaultMessage: 'Edit filter',
                        }),
                        icon: 'pencil',
                        panel: 1,
                        'data-test-subj': 'editFilter',
                    },
                    {
                        name: negate
                            ? this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.includeFilterButtonLabel',
                                defaultMessage: 'Include results',
                            })
                            : this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.excludeFilterButtonLabel',
                                defaultMessage: 'Exclude results',
                            }),
                        icon: negate ? 'plusInCircle' : 'minusInCircle',
                        onClick: function () {
                            _this.closePopover();
                            _this.onToggleNegated();
                        },
                        'data-test-subj': 'negateFilter',
                    },
                    {
                        name: disabled
                            ? this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.enableFilterButtonLabel',
                                defaultMessage: 'Re-enable',
                            })
                            : this.props.intl.formatMessage({
                                id: 'common.ui.filterBar.disableFilterButtonLabel',
                                defaultMessage: 'Temporarily disable',
                            }),
                        icon: "" + (disabled ? 'eye' : 'eyeClosed'),
                        onClick: function () {
                            _this.closePopover();
                            _this.onToggleDisabled();
                        },
                        'data-test-subj': 'disableFilter',
                    },
                    {
                        name: this.props.intl.formatMessage({
                            id: 'common.ui.filterBar.deleteFilterButtonLabel',
                            defaultMessage: 'Delete',
                        }),
                        icon: 'trash',
                        onClick: function () {
                            _this.closePopover();
                            _this.props.onRemove();
                        },
                        'data-test-subj': 'deleteFilter',
                    },
                ],
            },
            {
                id: 1,
                width: 400,
                content: (React.createElement("div", null,
                    React.createElement(FilterEditor, { filter: filter, indexPatterns: this.props.indexPatterns, onSubmit: this.onSubmit, onCancel: this.closePopover }))),
            },
        ];
        return (React.createElement(EuiPopover, { id: "popoverFor_filter" + id, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, button: badge, anchorPosition: "downLeft", withTitle: true, panelPaddingSize: "none" },
            React.createElement(EuiContextMenu, { initialPanelId: 0, panels: panelTree })));
    };
    return FilterItemUI;
}(Component));
export var FilterItem = injectI18n(FilterItemUI);
