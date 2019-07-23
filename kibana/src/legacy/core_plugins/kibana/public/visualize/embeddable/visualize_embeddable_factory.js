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
import { EmbeddableFactory } from 'ui/embeddable';
import { getVisualizeLoader } from 'ui/visualize/loader';
import { VisualizeEmbeddable } from './visualize_embeddable';
import { getIndexPattern } from 'ui/embeddable/get_index_pattern';
import { DisabledLabEmbeddable } from './disabled_lab_embeddable';
var VisualizeEmbeddableFactory = /** @class */ (function (_super) {
    tslib_1.__extends(VisualizeEmbeddableFactory, _super);
    function VisualizeEmbeddableFactory(savedVisualizations, config) {
        var _this = _super.call(this, { name: 'visualization' }) || this;
        _this.config = config;
        _this.savedVisualizations = savedVisualizations;
        return _this;
    }
    VisualizeEmbeddableFactory.prototype.getEditPath = function (panelId) {
        return this.savedVisualizations.urlFor(panelId);
    };
    /**
     *
     * @param {Object} panelMetadata. Currently just passing in panelState but it's more than we need, so we should
     * decouple this to only include data given to us from the embeddable when it's added to the dashboard. Generally
     * will be just the object id, but could be anything depending on the plugin.
     * @param {function} onEmbeddableStateChanged
     * @return {Promise.<{ metadata, onContainerStateChanged, render, destroy }>}
     */
    VisualizeEmbeddableFactory.prototype.create = function (panelMetadata, onEmbeddableStateChanged) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var visId, editUrl, loader, savedObject, isLabsEnabled, indexPattern;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        visId = panelMetadata.id;
                        editUrl = this.getEditPath(visId);
                        return [4 /*yield*/, getVisualizeLoader()];
                    case 1:
                        loader = _a.sent();
                        return [4 /*yield*/, this.savedVisualizations.get(visId)];
                    case 2:
                        savedObject = _a.sent();
                        isLabsEnabled = this.config.get('visualize:enableLabs');
                        if (!isLabsEnabled && savedObject.vis.type.stage === 'experimental') {
                            return [2 /*return*/, new DisabledLabEmbeddable(savedObject.title)];
                        }
                        return [4 /*yield*/, getIndexPattern(savedObject)];
                    case 3:
                        indexPattern = _a.sent();
                        return [2 /*return*/, new VisualizeEmbeddable({
                                onEmbeddableStateChanged: onEmbeddableStateChanged,
                                savedVisualization: savedObject,
                                editUrl: editUrl,
                                loader: loader,
                                indexPattern: indexPattern,
                            })];
                }
            });
        });
    };
    return VisualizeEmbeddableFactory;
}(EmbeddableFactory));
export { VisualizeEmbeddableFactory };
