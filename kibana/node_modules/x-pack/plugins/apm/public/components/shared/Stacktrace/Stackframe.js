"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const variables_1 = require("../../../style/variables");
const FrameHeading_1 = require("../Stacktrace/FrameHeading");
const Context_1 = require("./Context");
const Variables_1 = require("./Variables");
const CodeHeader = styled_components_1.default.div `
  border-bottom: 1px solid ${eui_theme_light_json_1.default.euiColorLightShade};
  border-radius: ${variables_1.borderRadius} ${variables_1.borderRadius} 0 0;
`;
const Container = styled_components_1.default.div `
  position: relative;
  font-family: ${variables_1.fontFamilyCode};
  font-size: ${variables_1.fontSize};
  border: 1px solid ${eui_theme_light_json_1.default.euiColorLightShade};
  border-radius: ${variables_1.borderRadius};
  background: ${props => props.isLibraryFrame
    ? eui_theme_light_json_1.default.euiColorEmptyShade
    : eui_theme_light_json_1.default.euiColorLightestShade};
`;
function Stackframe({ stackframe, codeLanguage, isLibraryFrame = false }) {
    if (!hasLineContext(stackframe)) {
        return (react_1.default.createElement(FrameHeading_1.FrameHeading, { stackframe: stackframe, isLibraryFrame: isLibraryFrame }));
    }
    return (react_1.default.createElement(Container, { isLibraryFrame: isLibraryFrame },
        react_1.default.createElement(CodeHeader, null,
            react_1.default.createElement(FrameHeading_1.FrameHeading, { stackframe: stackframe, isLibraryFrame: isLibraryFrame })),
        react_1.default.createElement(Context_1.Context, { stackframe: stackframe, codeLanguage: codeLanguage, isLibraryFrame: isLibraryFrame }),
        react_1.default.createElement(Variables_1.Variables, { vars: stackframe.vars })));
}
exports.Stackframe = Stackframe;
function hasLineContext(stackframe) {
    return stackframe.line.context != null;
}
