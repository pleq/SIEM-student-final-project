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
import { memoize } from 'lodash';
export function getSuggestionsProvider(config, fetch) {
    var _this = this;
    var requestSuggestions = memoize(function (index, field, query, boolFilter) {
        if (boolFilter === void 0) { boolFilter = []; }
        return fetch({
            pathname: "/api/kibana/suggestions/values/" + index,
            method: 'POST',
            body: JSON.stringify({ query: query, field: field.name, boolFilter: boolFilter }),
        });
    }, resolver);
    return function (index, field, query, boolFilter) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var shouldSuggestValues;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldSuggestValues = config.get('filterEditor:suggestValues');
                    if (field.type === 'boolean') {
                        return [2 /*return*/, [true, false]];
                    }
                    else if (!shouldSuggestValues || !field.aggregatable || field.type !== 'string') {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, requestSuggestions(index, field, query, boolFilter)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
}
function resolver(index, field, query, boolFilter) {
    // Only cache results for a minute
    var ttl = Math.floor(Date.now() / 1000 / 60);
    return [ttl, query, index, field.name, JSON.stringify(boolFilter)].join('|');
}
