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
import { buildPipeline, runPipeline } from './pipeline_helpers';
var PipelineDataLoader = /** @class */ (function () {
    function PipelineDataLoader(vis) {
        this.vis = vis;
    }
    PipelineDataLoader.prototype.fetch = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.vis;
                        return [4 /*yield*/, buildPipeline(this.vis, params)];
                    case 1:
                        _a.pipelineExpression = _b.sent();
                        return [4 /*yield*/, runPipeline(this.vis.pipelineExpression, {}, {
                                getInitialContext: function () { return ({
                                    query: params.query,
                                    timeRange: params.timeRange,
                                    filters: params.filters
                                        ? params.filters.filter(function (filter) { return !filter.meta.disabled; })
                                        : undefined,
                                }); },
                                inspectorAdapters: params.inspectorAdapters,
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return PipelineDataLoader;
}());
export { PipelineDataLoader };
