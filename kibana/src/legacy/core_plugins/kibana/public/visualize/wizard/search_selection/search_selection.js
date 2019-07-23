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
import { EuiModalBody, EuiModalHeader, EuiModalHeaderTitle, EuiSpacer, EuiTab, EuiTabs, } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import React from 'react';
import { SavedObjectFinder } from 'ui/saved_objects/components/saved_object_finder';
var INDEX_PATTERNS_TAB_ID = 'indexPatterns';
var SAVED_SEARCHES_TAB_ID = 'savedSearches';
var SearchSelection = /** @class */ (function (_super) {
    tslib_1.__extends(SearchSelection, _super);
    function SearchSelection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            selectedTabId: INDEX_PATTERNS_TAB_ID,
        };
        _this.fixedPageSize = 8;
        _this.onSelectedTabChanged = function (tab) {
            _this.setState({
                selectedTabId: tab.id,
            });
        };
        return _this;
    }
    SearchSelection.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(EuiModalHeader, null,
                React.createElement(EuiModalHeaderTitle, null,
                    React.createElement(FormattedMessage, { id: "kbn.visualize.newVisWizard.newVisTypeTitle", defaultMessage: "New {visTypeName}", values: { visTypeName: this.props.visType.title } }),
                    ' ',
                    "/",
                    ' ',
                    React.createElement(FormattedMessage, { id: "kbn.visualize.newVisWizard.chooseSourceTitle", defaultMessage: "Choose a source" }))),
            React.createElement(EuiModalBody, null,
                React.createElement(EuiTabs, { size: "m" }, this.renderTabs()),
                React.createElement(EuiSpacer, { size: "m" }),
                this.renderTab())));
    };
    SearchSelection.prototype.renderTabs = function () {
        var _this = this;
        var tabs = [
            {
                id: INDEX_PATTERNS_TAB_ID,
                name: i18n.translate('kbn.visualize.newVisWizard.indexPatternTabLabel', {
                    defaultMessage: 'Index pattern',
                }),
            },
            {
                id: SAVED_SEARCHES_TAB_ID,
                name: i18n.translate('kbn.visualize.newVisWizard.savedSearchTabLabel', {
                    defaultMessage: 'Saved search',
                }),
            },
        ];
        var selectedTabId = this.state.selectedTabId;
        return tabs.map(function (tab) { return (React.createElement(EuiTab, { onClick: function () { return _this.onSelectedTabChanged(tab); }, isSelected: tab.id === selectedTabId, key: tab.id, "data-test-subj": tab.id + "Tab" }, tab.name)); });
    };
    SearchSelection.prototype.renderTab = function () {
        if (this.state.selectedTabId === SAVED_SEARCHES_TAB_ID) {
            return (React.createElement(SavedObjectFinder, { key: "searchSavedObjectFinder", onChoose: this.props.onSearchSelected, noItemsMessage: i18n.translate('kbn.visualize.newVisWizard.savedSearchTab.notFoundLabel', { defaultMessage: 'No matching saved searches found.' }), savedObjectType: "search", fixedPageSize: this.fixedPageSize }));
        }
        return (React.createElement(SavedObjectFinder, { key: "visSavedObjectFinder", onChoose: this.props.onSearchSelected, noItemsMessage: i18n.translate('kbn.visualize.newVisWizard.indexPatternTab.notFoundLabel', {
                defaultMessage: 'No matching index patterns found.',
            }), savedObjectType: "index-pattern", fixedPageSize: this.fixedPageSize }));
    };
    return SearchSelection;
}(React.Component));
export { SearchSelection };
