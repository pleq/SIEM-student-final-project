"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AGENT_URL_ROOT = 'https://www.elastic.co/guide/en/apm/agent';
const customUrls = {
    'js-base': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-set-custom-context`,
    'js-react': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-set-custom-context`,
    java: undefined,
    nodejs: `${AGENT_URL_ROOT}/nodejs/2.x/agent-api.html#apm-set-custom-context`,
    python: `${AGENT_URL_ROOT}/python/4.x/api.html#api-set-custom-context`,
    ruby: `${AGENT_URL_ROOT}/ruby/2.x/context.html#_adding_custom_context`
};
const AGENT_DOC_URLS = {
    user: {
        'js-base': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-set-user-context`,
        'js-react': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-set-user-context`,
        java: `${AGENT_URL_ROOT}/java/1.x/public-api.html#api-transaction-set-user`,
        nodejs: `${AGENT_URL_ROOT}/nodejs/2.x/agent-api.html#apm-set-user-context`,
        python: `${AGENT_URL_ROOT}/python/4.x/api.html#api-set-user-context`,
        ruby: `${AGENT_URL_ROOT}/ruby/2.x/context.html#_providing_info_about_the_user`
    },
    labels: {
        'js-base': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-add-tags`,
        'js-react': `${AGENT_URL_ROOT}/js-base/4.x/api.html#apm-add-tags`,
        java: `${AGENT_URL_ROOT}/java/1.x/public-api.html#api-transaction-add-tag`,
        nodejs: `${AGENT_URL_ROOT}/nodejs/2.x/agent-api.html#apm-set-tag`,
        python: `${AGENT_URL_ROOT}/python/4.x/api.html#api-tag`,
        ruby: `${AGENT_URL_ROOT}/ruby/2.x/context.html#_adding_tags`
    },
    'transaction.custom': customUrls,
    'error.custom': customUrls
};
function getAgentDocUrlForTab(tabKey, agentName) {
    const agentUrls = AGENT_DOC_URLS[tabKey];
    if (agentUrls && agentName) {
        return agentUrls[agentName];
    }
}
exports.getAgentDocUrlForTab = getAgentDocUrlForTab;
