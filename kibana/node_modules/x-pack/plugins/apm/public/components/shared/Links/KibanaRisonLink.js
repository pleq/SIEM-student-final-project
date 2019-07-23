"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_1 = require("react-redux");
const rison_helpers_1 = require("./rison_helpers");
/**
 * NOTE: Use this component directly if you have to use a link that is
 * going to be rendered outside of React, e.g. in the Kibana global toast loader.
 *
 * You must remember to pass in location in that case.
 */
const UnconnectedKibanaRisonLink = ({ location, pathname, hash, query, ...props }) => {
    const href = rison_helpers_1.getRisonHref({
        location,
        pathname,
        hash,
        query
    });
    return react_1.default.createElement(eui_1.EuiLink, Object.assign({}, props, { href: href }));
};
exports.UnconnectedKibanaRisonLink = UnconnectedKibanaRisonLink;
const withLocation = react_redux_1.connect(({ location }) => ({ location }), {});
const KibanaRisonLink = withLocation(UnconnectedKibanaRisonLink);
exports.KibanaRisonLink = KibanaRisonLink;
