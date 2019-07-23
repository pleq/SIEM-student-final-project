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
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import chrome from 'ui/chrome';
import { EuiBasicTable, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiLink, } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
var SavedObjectFinder = /** @class */ (function (_super) {
    tslib_1.__extends(SavedObjectFinder, _super);
    function SavedObjectFinder(props) {
        var _this = _super.call(this, props) || this;
        _this.isComponentMounted = false;
        _this.debouncedFetch = _.debounce(function (filter) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var resp, _a, savedObjectType, visTypes;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, chrome.getSavedObjectsClient().find({
                            type: this.props.savedObjectType,
                            fields: ['title', 'visState'],
                            search: filter ? filter + "*" : undefined,
                            page: 1,
                            perPage: chrome.getUiSettingsClient().get('savedObjects:listingLimit'),
                            searchFields: ['title^3', 'description'],
                            defaultSearchOperator: 'AND',
                        })];
                    case 1:
                        resp = _b.sent();
                        _a = this.props, savedObjectType = _a.savedObjectType, visTypes = _a.visTypes;
                        if (savedObjectType === 'visualization' &&
                            !chrome.getUiSettingsClient().get('visualize:enableLabs') &&
                            visTypes) {
                            resp.savedObjects = resp.savedObjects.filter(function (savedObject) {
                                if (typeof savedObject.attributes.visState !== 'string') {
                                    return false;
                                }
                                var typeName = JSON.parse(savedObject.attributes.visState).type;
                                var visType = visTypes.byName[typeName];
                                return visType.stage !== 'experimental';
                            });
                        }
                        if (!this.isComponentMounted) {
                            return [2 /*return*/];
                        }
                        // We need this check to handle the case where search results come back in a different
                        // order than they were sent out. Only load results for the most recent search.
                        if (filter === this.state.filter) {
                            this.setState({
                                isFetchingItems: false,
                                items: resp.savedObjects.map(function (_a) {
                                    var title = _a.attributes.title, id = _a.id, type = _a.type;
                                    return {
                                        title: typeof title === 'string' ? title : '',
                                        id: id,
                                        type: type,
                                    };
                                }),
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 300);
        _this.onTableChange = function (_a) {
            var page = _a.page, _b = _a.sort, sort = _b === void 0 ? {} : _b;
            var sortField = sort.field;
            var sortDirection = sort.direction;
            // 3rd sorting state that is not captured by sort - native order (no sort)
            // when switching from desc to asc for the same field - use native order
            if (_this.state.sortField === sortField &&
                _this.state.sortDirection === 'desc' &&
                sortDirection === 'asc') {
                sortField = undefined;
                sortDirection = undefined;
            }
            _this.setState({
                page: page.index,
                perPage: page.size,
                sortField: sortField,
                sortDirection: sortDirection,
            });
        };
        // server-side paging not supported
        // 1) saved object client does not support sorting by title because title is only mapped as analyzed
        // 2) can not search on anything other than title because all other fields are stored in opaque JSON strings,
        //    for example, visualizations need to be search by isLab but this is not possible in Elasticsearch side
        //    with the current mappings
        _this.getPageOfItems = function () {
            // do not sort original list to preserve elasticsearch ranking order
            var items = _this.state.items.slice();
            var sortField = _this.state.sortField;
            if (sortField) {
                items.sort(function (a, b) {
                    var fieldA = _.get(a, sortField, '');
                    var fieldB = _.get(b, sortField, '');
                    var order = 1;
                    if (_this.state.sortDirection === 'desc') {
                        order = -1;
                    }
                    return order * fieldA.toLowerCase().localeCompare(fieldB.toLowerCase());
                });
            }
            // If begin is greater than the length of the sequence, an empty array is returned.
            var startIndex = _this.state.page * _this.state.perPage;
            // If end is greater than the length of the sequence, slice extracts through to the end of the sequence (arr.length).
            var lastIndex = startIndex + _this.state.perPage;
            return items.slice(startIndex, lastIndex);
        };
        _this.fetchItems = function () {
            _this.setState({
                isFetchingItems: true,
            }, _this.debouncedFetch.bind(null, _this.state.filter));
        };
        _this.state = {
            items: [],
            isFetchingItems: false,
            page: 0,
            perPage: props.initialPageSize || props.fixedPageSize || 15,
            filter: '',
        };
        return _this;
    }
    SavedObjectFinder.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
        this.debouncedFetch.cancel();
    };
    SavedObjectFinder.prototype.componentDidMount = function () {
        this.isComponentMounted = true;
        this.fetchItems();
    };
    SavedObjectFinder.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            this.renderSearchBar(),
            this.renderTable()));
    };
    SavedObjectFinder.prototype.renderSearchBar = function () {
        var _this = this;
        return (React.createElement(EuiFlexGroup, null,
            React.createElement(EuiFlexItem, { grow: true },
                React.createElement(EuiFieldSearch, { placeholder: i18n.translate('common.ui.savedObjects.finder.searchPlaceholder', {
                        defaultMessage: 'Search…',
                    }), fullWidth: true, value: this.state.filter, onChange: function (e) {
                        _this.setState({
                            filter: e.target.value,
                        }, _this.fetchItems);
                    }, "data-test-subj": "savedObjectFinderSearchInput" })),
            this.props.callToActionButton && (React.createElement(EuiFlexItem, { grow: false }, this.props.callToActionButton))));
    };
    SavedObjectFinder.prototype.renderTable = function () {
        var _this = this;
        var pagination = {
            pageIndex: this.state.page,
            pageSize: this.state.perPage,
            totalItemCount: this.state.items.length,
            hidePerPageOptions: Boolean(this.props.fixedPageSize),
            pageSizeOptions: [5, 10, 15],
        };
        // TODO there should be a Type in EUI for that, replace if it exists
        var sorting = {};
        if (this.state.sortField) {
            sorting.sort = {
                field: this.state.sortField,
                direction: this.state.sortDirection,
            };
        }
        var tableColumns = [
            {
                field: 'title',
                name: i18n.translate('common.ui.savedObjects.finder.titleLabel', {
                    defaultMessage: 'Title',
                }),
                sortable: true,
                render: function (title, record) {
                    var _a = _this.props, onChoose = _a.onChoose, makeUrl = _a.makeUrl;
                    if (!onChoose && !makeUrl) {
                        return React.createElement("span", null, title);
                    }
                    return (React.createElement(EuiLink, { onClick: onChoose
                            ? function () {
                                onChoose(record.id, record.type);
                            }
                            : undefined, href: makeUrl ? makeUrl(record.id) : undefined, "data-test-subj": "savedObjectTitle" + title.split(' ').join('-') }, title));
                },
            },
        ];
        var items = this.state.items.length === 0 ? [] : this.getPageOfItems();
        return (React.createElement(EuiBasicTable, { items: items, loading: this.state.isFetchingItems, columns: tableColumns, pagination: pagination, sorting: sorting, onChange: this.onTableChange, noItemsMessage: this.props.noItemsMessage }));
    };
    SavedObjectFinder.propTypes = {
        callToActionButton: PropTypes.node,
        onChoose: PropTypes.func,
        makeUrl: PropTypes.func,
        noItemsMessage: PropTypes.node,
        savedObjectType: PropTypes.oneOf(['visualization', 'search', 'index-pattern']).isRequired,
        visTypes: PropTypes.object,
        initialPageSize: PropTypes.oneOf([5, 10, 15]),
        fixedPageSize: PropTypes.number,
    };
    return SavedObjectFinder;
}(React.Component));
export { SavedObjectFinder };
