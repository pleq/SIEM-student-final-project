"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const version_1 = require("x-pack/plugins/upgrade_assistant/common/version");
const types_1 = require("../../../common/types");
const apm_1 = require("../apm");
exports.DEFAULT_TYPE_NAME = '_doc';
/**
 * Validates, and updates deprecated settings and mappings to be applied to the
 * new updated index.
 */
exports.transformFlatSettings = (flatSettings) => {
    const settings = transformSettings(flatSettings.settings);
    const mappings = transformMappings(flatSettings.mappings);
    return { settings, mappings };
};
/**
 * Provides the assumed source of the index name stripping any prefixing
 * introduced by the upgrade assistant
 *
 * Examples:
 *   .reindex-v7-foo => .foo
 *   reindex-v7-foo => foo
 *
 * @param indexName
 */
exports.sourceNameForIndex = (indexName) => {
    const matches = indexName.match(/^([\.])?(.*)$/) || [];
    const internal = matches[1] || '';
    const baseName = matches[2];
    // in 5.6 the upgrade assistant appended to the index, in 6.7+ we prepend to
    // avoid conflicts with index patterns/templates/etc
    const reindexedMatcher = new RegExp(`(-reindexed-v5$|reindexed-v${version_1.PREV_MAJOR_VERSION}-)`, 'g');
    const cleanBaseName = baseName.replace(reindexedMatcher, '');
    return `${internal}${cleanBaseName}`;
};
/**
 * Provides the index name to re-index into
 *
 * .foo -> .reindexed-v7-foo
 * foo => reindexed-v7-foo
 */
exports.generateNewIndexName = (indexName) => {
    const sourceName = exports.sourceNameForIndex(indexName);
    const currentVersion = `reindexed-v${version_1.CURRENT_MAJOR_VERSION}`;
    return indexName.startsWith('.')
        ? `.${currentVersion}-${sourceName.substr(1)}`
        : `${currentVersion}-${sourceName}`;
};
/**
 * Returns an array of warnings that should be displayed to user before reindexing begins.
 * @param flatSettings
 */
exports.getReindexWarnings = (flatSettings, apmIndexPatterns = []) => {
    const indexName = flatSettings.settings['index.provided_name'];
    const typeName = Object.getOwnPropertyNames(flatSettings.mappings)[0];
    const apmReindexWarning = apm_1.isLegacyApmIndex(indexName, apmIndexPatterns, flatSettings.mappings[typeName]);
    const typeNameWarning = usesCustomTypeName(flatSettings);
    const warnings = [
        [types_1.ReindexWarning.apmReindex, apmReindexWarning],
        [types_1.ReindexWarning.customTypeName, typeNameWarning],
    ];
    return warnings.filter(([_, applies]) => applies).map(([warning, _]) => warning);
};
const usesCustomTypeName = (flatSettings) => {
    // In 7+ it's not possible to have more than one type anyways, so always grab the first
    // (and only) key.
    const typeName = Object.getOwnPropertyNames(flatSettings.mappings)[0];
    return typeName && typeName !== exports.DEFAULT_TYPE_NAME;
};
const removeUnsettableSettings = (settings) => lodash_1.omit(settings, [
    'index.uuid',
    'index.blocks.write',
    'index.creation_date',
    'index.legacy',
    'index.mapping.single_type',
    'index.provided_name',
    'index.routing.allocation.initial_recovery._id',
    'index.version.created',
    'index.version.upgraded',
]);
// Use `flow` to pipe the settings through each function.
const transformSettings = lodash_1.flow(removeUnsettableSettings);
const updateFixableMappings = (mappings) => {
    // TODO: change type to _doc
    return mappings;
};
const transformMappings = lodash_1.flow(updateFixableMappings);
