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
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
exports.renderUptimeKibanaGlobalHelp = () => (react_2.default.createElement(eui_1.EuiLink, { "aria-label": i18n_1.i18n.translate('xpack.uptime.header.helpLinkAriaLabel', {
        defaultMessage: 'Go to our discuss page',
    }), href: "https://discuss.elastic.co/c/uptime", target: "_blank" },
    react_2.default.createElement(react_1.FormattedMessage, { id: "xpack.uptime.header.helpLinkText", defaultMessage: "Give Uptime feedback", description: "The link is to a support form called 'Discuss', where users can submit feedback." })));
