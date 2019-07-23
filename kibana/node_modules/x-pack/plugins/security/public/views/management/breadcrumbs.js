"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const breadcrumbs_1 = require("ui/management/breadcrumbs");
function getUsersBreadcrumbs() {
    return [
        breadcrumbs_1.MANAGEMENT_BREADCRUMB,
        {
            text: i18n_1.i18n.translate('xpack.security.users.breadcrumb', {
                defaultMessage: 'Users',
            }),
            href: '#/management/security/users',
        },
    ];
}
exports.getUsersBreadcrumbs = getUsersBreadcrumbs;
function getEditUserBreadcrumbs($route) {
    const { username } = $route.current.params;
    return [
        ...getUsersBreadcrumbs(),
        {
            text: username,
            href: `#/management/security/users/edit/${username}`,
        },
    ];
}
exports.getEditUserBreadcrumbs = getEditUserBreadcrumbs;
function getCreateUserBreadcrumbs() {
    return [
        ...getUsersBreadcrumbs(),
        {
            text: i18n_1.i18n.translate('xpack.security.users.createBreadcrumb', {
                defaultMessage: 'Create',
            }),
        },
    ];
}
exports.getCreateUserBreadcrumbs = getCreateUserBreadcrumbs;
function getRolesBreadcrumbs() {
    return [
        breadcrumbs_1.MANAGEMENT_BREADCRUMB,
        {
            text: i18n_1.i18n.translate('xpack.security.roles.breadcrumb', {
                defaultMessage: 'Roles',
            }),
            href: '#/management/security/roles',
        },
    ];
}
exports.getRolesBreadcrumbs = getRolesBreadcrumbs;
function getEditRoleBreadcrumbs($route) {
    const { name } = $route.current.params;
    return [
        ...getRolesBreadcrumbs(),
        {
            text: name,
            href: `#/management/security/roles/edit/${name}`,
        },
    ];
}
exports.getEditRoleBreadcrumbs = getEditRoleBreadcrumbs;
function getCreateRoleBreadcrumbs() {
    return [
        ...getUsersBreadcrumbs(),
        {
            text: i18n_1.i18n.translate('xpack.security.roles.createBreadcrumb', {
                defaultMessage: 'Create',
            }),
        },
    ];
}
exports.getCreateRoleBreadcrumbs = getCreateRoleBreadcrumbs;
