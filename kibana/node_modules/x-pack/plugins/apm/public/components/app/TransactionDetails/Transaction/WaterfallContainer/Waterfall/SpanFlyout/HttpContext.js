"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const variables_1 = require("../../../../../../../style/variables");
const eui_1 = require("@elastic/eui");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const idx_1 = require("x-pack/plugins/apm/common/idx");
const ContextUrl = styled_components_1.default.div `
  padding: ${variables_1.px(variables_1.units.half)} ${variables_1.px(variables_1.unit)};
  background: ${eui_theme_light_json_1.default.euiColorLightestShade};
  border-radius: ${variables_1.borderRadius};
  border: 1px solid ${eui_theme_light_json_1.default.euiColorLightShade};
  font-family: ${variables_1.fontFamilyCode};
  font-size: ${variables_1.fontSize};
`;
function HttpContext({ httpContext }) {
    const url = idx_1.idx(httpContext, _ => _.url.original);
    if (!url) {
        return null;
    }
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null, "HTTP URL")),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(ContextUrl, null, url),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
}
exports.HttpContext = HttpContext;
