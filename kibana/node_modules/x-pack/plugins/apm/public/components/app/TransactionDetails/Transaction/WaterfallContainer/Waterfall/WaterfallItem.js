"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const eui_1 = require("@elastic/eui");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const formatters_1 = require("x-pack/plugins/apm/public/utils/formatters");
const variables_1 = require("../../../../../../style/variables");
const Container = styled_components_1.default('div') `
  position: relative;
  display: block;
  user-select: none;
  padding-top: ${variables_1.px(variables_1.units.half)};
  padding-bottom: ${variables_1.px(variables_1.units.plus)};
  margin-right: ${props => variables_1.px(props.timelineMargins.right)};
  margin-left: ${props => variables_1.px(props.timelineMargins.left)};
  border-top: 1px solid ${eui_theme_light_json_1.default.euiColorLightShade};
  background-color: ${props => props.isSelected ? eui_theme_light_json_1.default.euiColorLightestShade : 'initial'};
  cursor: pointer;
  &:hover {
    background-color: ${eui_theme_light_json_1.default.euiColorLightestShade};
  }
`;
const ItemBar = styled_components_1.default('div') `
  box-sizing: border-box;
  position: relative;
  height: ${variables_1.px(variables_1.unit)};
  min-width: 2px;
  background-color: ${props => props.color};
`;
const ItemText = styled_components_1.default.span `
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  height: ${variables_1.px(variables_1.units.plus)};

  /* add margin to all direct descendants */
  & > * {
    margin-right: ${variables_1.px(variables_1.units.half)};
    white-space: nowrap;
  }
`;
function PrefixIcon({ item }) {
    if (item.docType === 'span') {
        // icon for database spans
        const isDbType = item.span.span.type.startsWith('db');
        if (isDbType) {
            return react_1.default.createElement(eui_1.EuiIcon, { type: "database" });
        }
        // omit icon for other spans
        return null;
    }
    // icon for RUM agent transactions
    const isRumAgent = item.transaction.agent.name === 'js-base';
    if (isRumAgent) {
        return react_1.default.createElement(eui_1.EuiIcon, { type: "globe" });
    }
    // icon for other transactions
    return react_1.default.createElement(eui_1.EuiIcon, { type: "merge" });
}
function Duration({ item }) {
    return (react_1.default.createElement(eui_1.EuiText, { color: "subdued", size: "xs" }, formatters_1.asTime(item.duration)));
}
function HttpStatusCode({ item }) {
    // http status code for transactions of type 'request'
    const httpStatusCode = item.docType === 'transaction' &&
        item.transaction.transaction.type === 'request'
        ? item.transaction.transaction.result
        : undefined;
    if (!httpStatusCode) {
        return null;
    }
    return react_1.default.createElement(eui_1.EuiText, { size: "xs" }, httpStatusCode);
}
function NameLabel({ item }) {
    if (item.docType === 'span') {
        return react_1.default.createElement(eui_1.EuiText, { size: "s" }, item.name);
    }
    return (react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
        react_1.default.createElement("h5", null, item.name)));
}
function WaterfallItem({ timelineMargins, totalDuration, item, color, isSelected, onClick }) {
    if (!totalDuration) {
        return null;
    }
    const width = (item.duration / totalDuration) * 100;
    const left = ((item.offset + item.skew) / totalDuration) * 100;
    return (react_1.default.createElement(Container, { type: item.docType, timelineMargins: timelineMargins, isSelected: isSelected, onClick: onClick },
        react_1.default.createElement(ItemBar // using inline styles instead of props to avoid generating a css class for each item
        , { style: { left: `${left}%`, width: `${width}%` }, color: color, type: item.docType }),
        react_1.default.createElement(ItemText // using inline styles instead of props to avoid generating a css class for each item
        , { style: { minWidth: `${Math.max(100 - left, 0)}%` } },
            react_1.default.createElement(PrefixIcon, { item: item }),
            react_1.default.createElement(HttpStatusCode, { item: item }),
            react_1.default.createElement(NameLabel, { item: item }),
            react_1.default.createElement(Duration, { item: item }))));
}
exports.WaterfallItem = WaterfallItem;
