"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const url_helpers_1 = require("x-pack/plugins/apm/public/components/shared/Links/url_helpers");
const variables_1 = require("../../../../style/variables");
const PropertiesTable_1 = require("../../../shared/PropertiesTable");
const tabConfig_1 = require("../../../shared/PropertiesTable/tabConfig");
const WaterfallContainer_1 = require("./WaterfallContainer");
const TableContainer = styled_components_1.default.div `
  padding: ${variables_1.px(variables_1.units.plus)} ${variables_1.px(variables_1.units.plus)} 0;
`;
const timelineTab = {
    key: 'timeline',
    label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.timelineLabel', {
        defaultMessage: 'Timeline'
    })
};
function TransactionTabs({ location, transaction, urlParams, waterfall }) {
    const tabs = [timelineTab, ...tabConfig_1.getTabsFromObject(transaction)];
    const currentTab = tabConfig_1.getCurrentTab(tabs, urlParams.detailTab);
    const agentName = transaction.agent.name;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(eui_1.EuiTabs, null, tabs.map(({ key, label }) => {
            return (react_1.default.createElement(eui_1.EuiTab, { onClick: () => {
                    url_helpers_1.history.replace({
                        ...location,
                        search: url_helpers_1.fromQuery({
                            ...url_helpers_1.toQuery(location.search),
                            detailTab: key
                        })
                    });
                }, isSelected: currentTab.key === key, key: key }, label));
        })),
        react_1.default.createElement(eui_1.EuiSpacer, null),
        currentTab.key === timelineTab.key ? (react_1.default.createElement(WaterfallContainer_1.WaterfallContainer, { transaction: transaction, location: location, urlParams: urlParams, waterfall: waterfall })) : (react_1.default.createElement(TableContainer, null,
            react_1.default.createElement(PropertiesTable_1.PropertiesTable, { propData: lodash_1.get(transaction, currentTab.key), propKey: currentTab.key, agentName: agentName })))));
}
exports.TransactionTabs = TransactionTabs;
