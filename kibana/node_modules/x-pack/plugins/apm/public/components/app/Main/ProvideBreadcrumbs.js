"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const parse = (options) => {
    const { breadcrumb, match, location } = options;
    let value;
    if (typeof breadcrumb === 'function') {
        value = breadcrumb({ match, location });
    }
    else {
        value = breadcrumb;
    }
    return { value, match, location };
};
function getBreadcrumb({ location, currentPath, routes }) {
    return routes.reduce((found, { breadcrumb, ...route }) => {
        if (found) {
            return found;
        }
        if (!breadcrumb) {
            return null;
        }
        const match = react_router_dom_1.matchPath(currentPath, route);
        if (match) {
            return parse({
                breadcrumb,
                match,
                location
            });
        }
        return null;
    }, null);
}
exports.getBreadcrumb = getBreadcrumb;
function getBreadcrumbs({ routes, location }) {
    const breadcrumbs = [];
    const { pathname } = location;
    pathname
        .split('?')[0]
        .replace(/\/$/, '')
        .split('/')
        .reduce((acc, next) => {
        // `/1/2/3` results in match checks for `/1`, `/1/2`, `/1/2/3`.
        const currentPath = !next ? '/' : `${acc}/${next}`;
        const breadcrumb = getBreadcrumb({
            location,
            currentPath,
            routes
        });
        if (breadcrumb) {
            breadcrumbs.push(breadcrumb);
        }
        return currentPath === '/' ? '' : currentPath;
    }, '');
    return breadcrumbs;
}
exports.getBreadcrumbs = getBreadcrumbs;
function ProvideBreadcrumbsComponent({ routes = [], render, location, match, history }) {
    const breadcrumbs = getBreadcrumbs({ routes, location });
    return render({ breadcrumbs, location, match, history });
}
exports.ProvideBreadcrumbs = react_router_dom_1.withRouter(ProvideBreadcrumbsComponent);
