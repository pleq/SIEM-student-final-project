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
import chrome from 'ui/chrome';
import { getFromSavedObject } from 'ui/index_patterns/static_utils';
export function getIndexPattern(savedVis) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config, savedObjectsClient, defaultIndex, indexPatternObjects, _a, indexPattern, savedObject;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (savedVis.vis.type.name !== 'metrics') {
                        return [2 /*return*/, savedVis.vis.indexPattern];
                    }
                    config = chrome.getUiSettingsClient();
                    savedObjectsClient = chrome.getSavedObjectsClient();
                    defaultIndex = config.get('defaultIndex');
                    if (!savedVis.vis.params.index_pattern) return [3 /*break*/, 2];
                    return [4 /*yield*/, savedObjectsClient.find({
                            type: 'index-pattern',
                            fields: ['title', 'fields'],
                            search: "\"" + savedVis.vis.params.index_pattern + "\"",
                            searchFields: ['title'],
                        })];
                case 1:
                    indexPatternObjects = _b.sent();
                    _a = tslib_1.__read(indexPatternObjects.savedObjects.map(getFromSavedObject), 1), indexPattern = _a[0];
                    return [2 /*return*/, indexPattern];
                case 2: return [4 /*yield*/, savedObjectsClient.get('index-pattern', defaultIndex)];
                case 3:
                    savedObject = _b.sent();
                    return [2 /*return*/, getFromSavedObject(savedObject)];
            }
        });
    });
}
