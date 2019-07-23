"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const variables_1 = require("../../../style/variables");
const agents_1 = require("../../../utils/documentation/agents");
const NestedKeyValueTable_1 = require("./NestedKeyValueTable");
const TableContainer = styled_components_1.default.div `
  padding-bottom: ${variables_1.px(variables_1.units.double)};
`;
const TableInfo = styled_components_1.default.div `
  padding: ${variables_1.px(variables_1.unit)} 0 0;
  text-align: center;
  font-size: ${variables_1.fontSize};
  color: ${eui_theme_light_json_1.default.euiColorDarkShade};
  line-height: 1.5;
`;
const TableInfoHeader = styled_components_1.default(TableInfo) `
  font-size: ${variables_1.fontSizes.large};
  color: ${eui_theme_light_json_1.default.euiColorDarkestShade};
`;
const EuiIconWithSpace = styled_components_1.default(eui_1.EuiIcon) `
  margin-right: ${variables_1.px(variables_1.units.half)};
`;
function getTabHelpText(tabKey) {
    switch (tabKey) {
        case 'user':
            return i18n_1.i18n.translate('xpack.apm.propertiesTable.userTab.agentFeatureText', {
                defaultMessage: 'You can configure your agent to add contextual information about your users.'
            });
        case 'labels':
            return i18n_1.i18n.translate('xpack.apm.propertiesTable.labelsTab.agentFeatureText', {
                defaultMessage: 'You can configure your agent to add filterable tags on transactions.'
            });
        case 'transaction.custom':
        case 'error.custom':
            return i18n_1.i18n.translate('xpack.apm.propertiesTable.customTab.agentFeatureText', {
                defaultMessage: 'You can configure your agent to add custom contextual information on transactions.'
            });
    }
}
function TabHelpMessage({ tabKey, agentName }) {
    if (!tabKey) {
        return null;
    }
    const docsUrl = agents_1.getAgentDocUrlForTab(tabKey, agentName);
    if (!docsUrl) {
        return null;
    }
    return (react_1.default.createElement(TableInfo, null,
        react_1.default.createElement(EuiIconWithSpace, { type: "iInCircle" }),
        getTabHelpText(tabKey),
        ' ',
        react_1.default.createElement(eui_2.EuiLink, { target: "_blank", rel: "noopener", href: docsUrl }, i18n_1.i18n.translate('xpack.apm.propertiesTable.agentFeature.learnMoreLinkLabel', { defaultMessage: 'Learn more in the documentation.' }))));
}
exports.TabHelpMessage = TabHelpMessage;
function PropertiesTable({ propData, propKey, agentName }) {
    return (react_1.default.createElement(TableContainer, null,
        propData ? (react_1.default.createElement(NestedKeyValueTable_1.NestedKeyValueTable, { data: propData, parentKey: propKey, depth: 1 })) : (react_1.default.createElement(TableInfoHeader, null, i18n_1.i18n.translate('xpack.apm.propertiesTable.agentFeature.noDataAvailableLabel', { defaultMessage: 'No data available' }))),
        react_1.default.createElement(TabHelpMessage, { tabKey: propKey, agentName: agentName })));
}
exports.PropertiesTable = PropertiesTable;
