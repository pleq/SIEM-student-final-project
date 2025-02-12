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
import _ from 'lodash';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Visualization } from '../components/visualization';
function renderVisualization(element, vis, visData, visParams, uiState, params) {
    return new Promise(function (resolve) {
        var listenOnChange = _.get(params, 'listenOnChange', false);
        render(React.createElement(Visualization, { vis: vis, visData: visData, visParams: visParams, uiState: uiState, listenOnChange: listenOnChange, onInit: resolve }), element);
    });
}
function destroy(element) {
    if (element) {
        unmountComponentAtNode(element);
    }
}
export var visualizationLoader = {
    render: renderVisualization,
    destroy: destroy,
};
