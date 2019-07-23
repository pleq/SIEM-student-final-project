"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
function getTabsFromObject(obj) {
    return exports.TAB_CONFIG.filter(({ key, required }) => required || lodash_2.has(obj, key)).map(({ key, label }) => ({ key, label }));
}
exports.getTabsFromObject = getTabsFromObject;
exports.sortKeysByConfig = (object, currentKey) => {
    const indexedPropertyConfig = lodash_1.indexBy(exports.TAB_CONFIG, 'key');
    const presorted = lodash_1.get(indexedPropertyConfig, `${currentKey}.presortedKeys`, []);
    return lodash_1.uniq([...presorted, ...Object.keys(object).sort()]);
};
function getCurrentTab(tabs = [], currentTabKey) {
    const selectedTab = tabs.find(({ key }) => key === currentTabKey);
    return selectedTab ? selectedTab : lodash_2.first(tabs) || {};
}
exports.getCurrentTab = getCurrentTab;
exports.TAB_CONFIG = [
    {
        key: 'http',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.httpLabel', {
            defaultMessage: 'HTTP'
        }),
        required: false,
        presortedKeys: []
    },
    {
        key: 'host',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.hostLabel', {
            defaultMessage: 'Host'
        }),
        required: false,
        presortedKeys: ['hostname', 'architecture', 'platform']
    },
    {
        key: 'service',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.serviceLabel', {
            defaultMessage: 'Service'
        }),
        required: false,
        presortedKeys: ['runtime', 'framework', 'version']
    },
    {
        key: 'process',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.processLabel', {
            defaultMessage: 'Process'
        }),
        required: false,
        presortedKeys: ['pid', 'title', 'args']
    },
    {
        key: 'agent',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.agentLabel', {
            defaultMessage: 'Agent'
        }),
        required: false,
        presortedKeys: []
    },
    {
        key: 'url',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.urlLabel', {
            defaultMessage: 'URL'
        }),
        required: false,
        presortedKeys: []
    },
    {
        key: 'container',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.containerLabel', {
            defaultMessage: 'Container'
        }),
        required: false,
        presortedKeys: []
    },
    {
        key: 'user',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.userLabel', {
            defaultMessage: 'User'
        }),
        required: true,
        presortedKeys: ['id', 'username', 'email']
    },
    {
        key: 'labels',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.labelsLabel', {
            defaultMessage: 'Labels'
        }),
        required: true,
        presortedKeys: []
    },
    {
        key: 'transaction.custom',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.transactionCustomLabel', {
            defaultMessage: 'Custom'
        }),
        required: false,
        presortedKeys: []
    },
    {
        key: 'error.custom',
        label: i18n_1.i18n.translate('xpack.apm.propertiesTable.tabs.errorCustomLabel', {
            defaultMessage: 'Custom'
        }),
        required: false,
        presortedKeys: []
    }
];
