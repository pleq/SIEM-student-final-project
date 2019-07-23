"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const react_1 = tslib_1.__importStar(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const idx_1 = require("x-pack/plugins/apm/common/idx");
const variables_1 = require("../../../style/variables");
const FileDetails = styled_components_1.default.div `
  color: ${eui_theme_light_json_1.default.euiColorMediumShade};
  padding: ${variables_1.px(variables_1.units.half)};
  font-family: ${variables_1.fontFamilyCode};
  font-size: ${variables_1.fontSize};
`;
const LibraryFrameFileDetail = styled_components_1.default.span `
  color: ${eui_theme_light_json_1.default.euiColorDarkShade};
`;
const AppFrameFileDetail = styled_components_1.default.span `
  font-weight: bold;
  color: ${eui_theme_light_json_1.default.euiColorFullShade};
`;
const FrameHeading = ({ stackframe, isLibraryFrame }) => {
    const FileDetail = isLibraryFrame
        ? LibraryFrameFileDetail
        : AppFrameFileDetail;
    const lineNumber = idx_1.idx(stackframe, _ => _.line.number) || 0;
    return (react_1.default.createElement(FileDetails, null,
        react_1.default.createElement(FileDetail, null, stackframe.filename),
        " in",
        ' ',
        react_1.default.createElement(FileDetail, null, stackframe.function),
        lineNumber > 0 && (react_1.default.createElement(react_1.Fragment, null,
            ' at ',
            react_1.default.createElement(FileDetail, null,
                "line ",
                stackframe.line.number)))));
};
exports.FrameHeading = FrameHeading;
