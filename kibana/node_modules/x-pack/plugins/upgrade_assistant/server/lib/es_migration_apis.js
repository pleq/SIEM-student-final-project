"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const reindexing_1 = require("./reindexing");
const apm_1 = require("./apm");
async function getUpgradeAssistantStatus(callWithRequest, req, isCloudEnabled, apmIndices) {
    const [deprecations, apmIndexDeprecations] = await Promise.all([
        (await callWithRequest(req, 'transport.request', {
            path: '/_migration/deprecations',
            method: 'GET',
        })),
        apm_1.getDeprecatedApmIndices(callWithRequest, req, apmIndices),
    ]);
    const cluster = getClusterDeprecations(deprecations, isCloudEnabled);
    const indices = getCombinedIndexInfos(deprecations, apmIndexDeprecations);
    const criticalWarnings = cluster.concat(indices).filter(d => d.level === 'critical');
    return {
        readyForUpgrade: criticalWarnings.length === 0,
        cluster,
        indices,
    };
}
exports.getUpgradeAssistantStatus = getUpgradeAssistantStatus;
// Reformats the index deprecations to an array of deprecation warnings extended with an index field.
const getCombinedIndexInfos = (deprecations, apmIndexDeprecations) => {
    const apmIndices = apmIndexDeprecations.reduce((acc, dep) => acc.add(dep.index), new Set());
    return (Object.keys(deprecations.index_settings)
        // prevent APM indices from showing up for general re-indexing
        .filter(indexName => !apmIndices.has(indexName))
        .reduce((indexDeprecations, indexName) => {
        return indexDeprecations.concat(deprecations.index_settings[indexName].map(d => ({
            ...d,
            index: indexName,
            reindex: /Index created before/.test(d.message) && !apmIndices.has(indexName),
            needsDefaultFields: /Number of fields exceeds automatic field expansion limit/.test(d.message),
        })));
    }, [])
        // Filter out warnings for system indices until we know more about what changes are required for the
        // next upgrade in a future minor version. Note, we're still including APM depercations below.
        .filter(deprecation => !reindexing_1.isSystemIndex(deprecation.index))
        .concat(apmIndexDeprecations));
};
const getClusterDeprecations = (deprecations, isCloudEnabled) => {
    const combined = deprecations.cluster_settings
        .concat(deprecations.ml_settings)
        .concat(deprecations.node_settings);
    if (isCloudEnabled) {
        // In Cloud, this is changed at upgrade time. Filter it out to improve upgrade UX.
        return combined.filter(d => d.message !== 'Security realm settings structure changed');
    }
    else {
        return combined;
    }
};
