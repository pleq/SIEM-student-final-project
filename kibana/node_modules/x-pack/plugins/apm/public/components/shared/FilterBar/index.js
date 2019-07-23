"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
// @ts-ignore
const KueryBar_1 = require("../KueryBar");
const DatePicker_1 = require("./DatePicker");
function FilterBar() {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(KueryBar_1.KueryBar, null)),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(DatePicker_1.DatePicker, null))));
}
exports.FilterBar = FilterBar;
