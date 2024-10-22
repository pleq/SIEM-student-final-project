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
import { EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
function getEuiIconType(type) {
    switch (type) {
        case 'field':
            return 'kqlField';
        case 'value':
            return 'kqlValue';
        case 'recentSearch':
            return 'search';
        case 'conjunction':
            return 'kqlSelector';
        case 'operator':
            return 'kqlOperand';
        default:
            throw new Error("Unknown type: " + type);
    }
}
export var SuggestionComponent = function (props) {
    return (React.createElement("div", { className: classNames({
            kbnTypeahead__item: true,
            active: props.selected,
        }), role: "option", onClick: function () { return props.onClick(props.suggestion); }, onMouseEnter: props.onMouseEnter, ref: props.innerRef, id: props.ariaId, "aria-selected": props.selected },
        React.createElement("div", { className: 'kbnSuggestionItem kbnSuggestionItem--' + props.suggestion.type },
            React.createElement("div", { className: "kbnSuggestionItem__type" },
                React.createElement(EuiIcon, { type: getEuiIconType(props.suggestion.type) })),
            React.createElement("div", { className: "kbnSuggestionItem__text" }, props.suggestion.text),
            React.createElement("div", { className: "kbnSuggestionItem__description" }, props.suggestion.description))));
};
