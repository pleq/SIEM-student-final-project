"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const breadcrumbs_1 = require("ui/management/breadcrumbs");
function getListBreadcrumbs() {
    return [
        breadcrumbs_1.MANAGEMENT_BREADCRUMB,
        {
            text: 'Spaces',
            href: '#/management/spaces/list',
        },
    ];
}
exports.getListBreadcrumbs = getListBreadcrumbs;
function getCreateBreadcrumbs() {
    return [
        ...getListBreadcrumbs(),
        {
            text: 'Create',
        },
    ];
}
exports.getCreateBreadcrumbs = getCreateBreadcrumbs;
function getEditBreadcrumbs(space) {
    return [
        ...getListBreadcrumbs(),
        {
            text: space ? space.name : '...',
        },
    ];
}
exports.getEditBreadcrumbs = getEditBreadcrumbs;
