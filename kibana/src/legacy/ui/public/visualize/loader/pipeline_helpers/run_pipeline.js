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
var _this = this;
import * as tslib_1 from "tslib";
// @ts-ignore
import { fromExpression } from '@kbn/interpreter/common';
// @ts-ignore
import { getInterpreter } from 'plugins/interpreter/interpreter';
export var runPipeline = function (expression, context, handlers) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var ast, interpreter, pipelineResponse;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ast = fromExpression(expression);
                return [4 /*yield*/, getInterpreter()];
            case 1:
                interpreter = (_a.sent()).interpreter;
                return [4 /*yield*/, interpreter.interpretAst(ast, context, handlers)];
            case 2:
                pipelineResponse = _a.sent();
                return [2 /*return*/, pipelineResponse];
        }
    });
}); };
