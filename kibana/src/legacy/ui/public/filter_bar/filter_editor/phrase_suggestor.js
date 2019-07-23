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
import { Component } from 'react';
import chrome from 'ui/chrome';
import { getSuggestions } from 'ui/value_suggestions';
var config = chrome.getUiSettingsClient();
/**
 * Since both "phrase" and "phrases" filter inputs suggest values (if enabled and the field is
 * aggregatable), we pull out the common logic for requesting suggestions into this component
 * which both of them extend.
 */
var PhraseSuggestor = /** @class */ (function (_super) {
    tslib_1.__extends(PhraseSuggestor, _super);
    function PhraseSuggestor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            suggestions: [],
            isLoading: false,
        };
        _this.onSearchChange = function (value) {
            _this.updateSuggestions("" + value);
        };
        return _this;
    }
    PhraseSuggestor.prototype.componentDidMount = function () {
        this.updateSuggestions();
    };
    PhraseSuggestor.prototype.isSuggestingValues = function () {
        var shouldSuggestValues = config.get('filterEditor:suggestValues');
        var field = this.props.field;
        return shouldSuggestValues && field && field.aggregatable && field.type === 'string';
    };
    PhraseSuggestor.prototype.updateSuggestions = function (value) {
        if (value === void 0) { value = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, indexPattern, field, suggestions;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, indexPattern = _a.indexPattern, field = _a.field;
                        if (!field || !this.isSuggestingValues()) {
                            return [2 /*return*/];
                        }
                        this.setState({ isLoading: true });
                        return [4 /*yield*/, getSuggestions(indexPattern.title, field, value)];
                    case 1:
                        suggestions = _b.sent();
                        this.setState({ suggestions: suggestions, isLoading: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    return PhraseSuggestor;
}(Component));
export { PhraseSuggestor };
