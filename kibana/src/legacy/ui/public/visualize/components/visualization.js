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
import { get } from 'lodash';
import React from 'react';
import { memoizeLast } from '../../utils/memoize';
import { VisualizationChart } from './visualization_chart';
import { VisualizationNoResults } from './visualization_noresults';
import { VisualizationRequestError } from './visualization_requesterror';
function shouldShowNoResultsMessage(vis, visData) {
    var requiresSearch = get(vis, 'type.requiresSearch');
    var rows = get(visData, 'rows');
    var isZeroHits = get(visData, 'hits') === 0 || (rows && !rows.length);
    var shouldShowMessage = !get(vis, 'type.useCustomNoDataScreen');
    return Boolean(requiresSearch && isZeroHits && shouldShowMessage);
}
function shouldShowRequestErrorMessage(vis, visData) {
    var requestError = get(vis, 'requestError');
    var showRequestError = get(vis, 'showRequestError');
    return Boolean(!visData && requestError && showRequestError);
}
var Visualization = /** @class */ (function (_super) {
    tslib_1.__extends(Visualization, _super);
    function Visualization(props) {
        var _this = _super.call(this, props) || this;
        _this.showNoResultsMessage = memoizeLast(shouldShowNoResultsMessage);
        props.vis._setUiState(props.uiState);
        return _this;
    }
    Visualization.prototype.render = function () {
        var _a = this.props, vis = _a.vis, visData = _a.visData, visParams = _a.visParams, onInit = _a.onInit, uiState = _a.uiState, listenOnChange = _a.listenOnChange;
        var noResults = this.showNoResultsMessage(vis, visData);
        var requestError = shouldShowRequestErrorMessage(vis, visData);
        return (React.createElement("div", { className: "visualization" }, requestError ? (React.createElement(VisualizationRequestError, { onInit: onInit, error: vis.requestError })) : noResults ? (React.createElement(VisualizationNoResults, { onInit: onInit })) : (React.createElement(VisualizationChart, { vis: vis, visData: visData, visParams: visParams, onInit: onInit, uiState: uiState, listenOnChange: listenOnChange }))));
    };
    Visualization.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.uiState !== this.props.uiState) {
            throw new Error('Changing uiState on <Visualization/> is not supported!');
        }
        return true;
    };
    return Visualization;
}(React.Component));
export { Visualization };
