"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const i18n_1 = require("x-pack/plugins/apm/common/i18n");
const variables_1 = require("../../../style/variables");
const tabConfig_1 = require("./tabConfig");
const Table = styled_components_1.default.table `
  font-family: ${variables_1.fontFamilyCode};
  font-size: ${variables_1.fontSize};
  width: 100%;
`;
const Row = styled_components_1.default.tr `
  border-bottom: ${variables_1.px(1)} solid ${eui_theme_light_json_1.default.euiColorLightShade};
  &:last-child {
    border: 0;
  }
`;
const Cell = styled_components_1.default.td `
  vertical-align: top;
  padding: ${variables_1.px(variables_1.units.half)} 0;
  line-height: 1.5;

  ${Row}:first-child> & {
    padding-top: 0;
  }

  ${Row}:last-child> & {
    padding-bottom: 0;
  }

  &:first-child {
    width: ${variables_1.px(variables_1.units.unit * 12)};
    font-weight: bold;
  }
`;
const EmptyValue = styled_components_1.default.span `
  color: ${eui_theme_light_json_1.default.euiColorMediumShade};
`;
function FormattedKey({ k, value }) {
    if (value == null) {
        return react_1.default.createElement(EmptyValue, null, k);
    }
    return react_1.default.createElement(react_1.default.Fragment, null, k);
}
exports.FormattedKey = FormattedKey;
function FormattedValue({ value }) {
    if (lodash_1.isObject(value)) {
        return react_1.default.createElement("pre", null, JSON.stringify(value, null, 4));
    }
    else if (lodash_1.isBoolean(value) || lodash_1.isNumber(value)) {
        return react_1.default.createElement(react_1.default.Fragment, null, String(value));
    }
    else if (!value) {
        return react_1.default.createElement(EmptyValue, null, i18n_1.NOT_AVAILABLE_LABEL);
    }
    return react_1.default.createElement(react_1.default.Fragment, null, value);
}
exports.FormattedValue = FormattedValue;
function NestedValue({ parentKey, value, depth }) {
    const MAX_LEVEL = 3;
    if (depth < MAX_LEVEL && lodash_1.isObject(value)) {
        return (react_1.default.createElement(NestedKeyValueTable, { data: value, parentKey: parentKey, depth: depth + 1 }));
    }
    return react_1.default.createElement(FormattedValue, { value: value });
}
exports.NestedValue = NestedValue;
function NestedKeyValueTable({ data, parentKey, depth }) {
    return (react_1.default.createElement(Table, null,
        react_1.default.createElement("tbody", null, tabConfig_1.sortKeysByConfig(data, parentKey).map(key => (react_1.default.createElement(Row, { key: key },
            react_1.default.createElement(Cell, null,
                react_1.default.createElement(FormattedKey, { k: key, value: data[key] })),
            react_1.default.createElement(Cell, null,
                react_1.default.createElement(NestedValue, { parentKey: key, value: data[key], depth: depth }))))))));
}
exports.NestedKeyValueTable = NestedKeyValueTable;
