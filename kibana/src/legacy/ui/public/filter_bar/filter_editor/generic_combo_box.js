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
import { EuiComboBox } from '@elastic/eui';
import React from 'react';
/**
 * A generic combo box. Instead of accepting a set of options that contain a `label`, it accepts
 * any type of object. It also accepts a `getLabel` function that each object will be sent through
 * to get the label to be passed to the combo box. The `onChange` will trigger with the actual
 * selected objects, rather than an option object.
 */
export function GenericComboBox(props) {
    var options = props.options, selectedOptions = props.selectedOptions, getLabel = props.getLabel, onChange = props.onChange, otherProps = tslib_1.__rest(props, ["options", "selectedOptions", "getLabel", "onChange"]);
    var labels = options.map(getLabel);
    var euiOptions = labels.map(function (label) { return ({ label: label }); });
    var selectedEuiOptions = selectedOptions.map(function (option) {
        return euiOptions[options.indexOf(option)];
    });
    var onComboBoxChange = function (newOptions) {
        var newValues = newOptions.map(function (_a) {
            var label = _a.label;
            return options[labels.indexOf(label)];
        });
        onChange(newValues);
    };
    return (React.createElement(EuiComboBox, tslib_1.__assign({ options: euiOptions, selectedOptions: selectedEuiOptions, onChange: onComboBoxChange }, otherProps)));
}
