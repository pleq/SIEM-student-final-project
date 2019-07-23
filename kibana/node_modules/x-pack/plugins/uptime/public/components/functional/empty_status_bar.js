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
const react_1 = tslib_1.__importDefault(require("react"));
exports.EmptyStatusBar = ({ message, monitorId }) => (react_1.default.createElement(eui_1.EuiPanel, null,
    react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "l" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, !message
            ? i18n_1.i18n.translate('xpack.uptime.emptyStatusBar.defaultMessage', {
                defaultMessage: 'No data found for monitor id {monitorId}',
                description: 'This is the default message we display in a status bar when there is no data available for an uptime monitor.',
                values: { monitorId },
            })
            : message))));
