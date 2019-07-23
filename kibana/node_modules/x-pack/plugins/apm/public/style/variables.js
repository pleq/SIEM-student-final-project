"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Units
exports.unit = 16;
exports.units = {
    unit: exports.unit,
    eighth: exports.unit / 8,
    quarter: exports.unit / 4,
    half: exports.unit / 2,
    minus: exports.unit * 0.75,
    plus: exports.unit * 1.5,
    double: exports.unit * 2,
    triple: exports.unit * 3,
    quadruple: exports.unit * 4
};
function px(value) {
    return `${value}px`;
}
exports.px = px;
function pct(value) {
    return `${value}%`;
}
exports.pct = pct;
// Styling
exports.borderRadius = '5px';
// Colors (from dark to light)
exports.colors = {
    black: '#000000',
    yellow: '#FCF2E6',
    // custom APM palette
    apmLightBlue: '#80bcd2'
};
// Fonts
exports.fontFamily = '"Open Sans", Helvetica, Arial, sans-serif';
exports.fontFamilyCode = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
// Font sizes
exports.fontSize = '14px';
exports.fontSizes = {
    tiny: '10px',
    small: '12px',
    large: '16px',
    xlarge: '20px',
    xxlarge: '30px'
};
function truncate(width) {
    return `
      max-width: ${width};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
}
exports.truncate = truncate;
// height of specific elements
exports.topNavHeight = '29px';
