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
const react_1 = tslib_1.__importStar(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const url_1 = tslib_1.__importDefault(require("url"));
const variables_1 = require("../../../style/variables");
const Container = styled_components_1.default.div `
  margin: ${variables_1.px(variables_1.units.minus)} 0;
`;
exports.GlobalHelpExtension = () => {
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Container, null,
            react_1.default.createElement(eui_1.EuiLink, { href: "https://discuss.elastic.co/c/apm", target: "_blank", rel: "noopener" }, i18n_1.i18n.translate('xpack.apm.feedbackMenu.provideFeedbackTitle', {
                defaultMessage: 'Provide feedback for APM'
            }))),
        react_1.default.createElement(Container, null,
            react_1.default.createElement(eui_1.EuiLink, { href: url_1.default.format({
                    pathname: chrome_1.default.addBasePath('/app/kibana'),
                    hash: '/management/elasticsearch/upgrade_assistant'
                }) }, i18n_1.i18n.translate('xpack.apm.helpMenu.upgradeAssistantLink', {
                defaultMessage: 'Upgrade assistant'
            })))));
};
