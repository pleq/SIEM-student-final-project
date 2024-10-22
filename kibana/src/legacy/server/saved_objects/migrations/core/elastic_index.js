"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This module contains various functions for querying and manipulating
 * elasticsearch indices.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const settings = { number_of_shards: 1, auto_expand_replicas: '0-1' };
/**
 * A slight enhancement to indices.get, that adds indexName, and validates that the
 * index mappings are somewhat what we expect.
 */
async function fetchInfo(callCluster, index) {
    const result = await callCluster('indices.get', {
        ignore: [404],
        index,
    });
    if (result.status === 404) {
        return {
            aliases: {},
            exists: false,
            indexName: index,
            mappings: { dynamic: 'strict', properties: {} },
        };
    }
    const [indexName, indexInfo] = Object.entries(result)[0];
    return assertIsSupportedIndex({ ...indexInfo, exists: true, indexName });
}
exports.fetchInfo = fetchInfo;
/**
 * Creates a reader function that serves up batches of documents from the index. We aren't using
 * an async generator, as that feature currently breaks Kibana's tooling.
 *
 * @param {CallCluster} callCluster - The elastic search connection
 * @param {string} - The index to be read from
 * @param {opts}
 * @prop {number} batchSize - The number of documents to read at a time
 * @prop {string} scrollDuration - The scroll duration used for scrolling through the index
 */
function reader(callCluster, index, { batchSize = 10, scrollDuration = '15m' }) {
    const scroll = scrollDuration;
    let scrollId;
    const nextBatch = () => scrollId !== undefined
        ? callCluster('scroll', { scroll, scrollId })
        : callCluster('search', { body: { size: batchSize }, index, scroll });
    const close = async () => scrollId && (await callCluster('clearScroll', { scrollId }));
    return async function read() {
        const result = await nextBatch();
        assertResponseIncludeAllShards(result);
        const docs = result.hits.hits;
        scrollId = result._scroll_id;
        if (!docs.length) {
            await close();
        }
        return docs;
    };
}
exports.reader = reader;
/**
 * Writes the specified documents to the index, throws an exception
 * if any of the documents fail to save.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {RawDoc[]} docs
 */
async function write(callCluster, index, docs) {
    const result = await callCluster('bulk', {
        body: docs.reduce((acc, doc) => {
            acc.push({
                index: {
                    _id: doc._id,
                    _index: index,
                },
            });
            acc.push(doc._source);
            return acc;
        }, []),
    });
    const err = lodash_1.default.find(result.items, 'index.error.reason');
    if (!err) {
        return;
    }
    const exception = new Error(err.index.error.reason);
    exception.detail = err;
    throw exception;
}
exports.write = write;
/**
 * Checks to see if the specified index is up to date. It does this by checking
 * that the index has the expected mappings and by counting
 * the number of documents that have a property which has migrations defined for it,
 * but which has not had those migrations applied. We don't want to cache the
 * results of this function (e.g. in context or somewhere), as it is important that
 * it performs the check *each* time it is called, rather than memoizing itself,
 * as this is used to determine if migrations are complete.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {MigrationVersion} migrationVersion - The latest versions of the migrations
 */
async function migrationsUpToDate(callCluster, index, migrationVersion, retryCount = 10) {
    try {
        const indexInfo = await fetchInfo(callCluster, index);
        if (!lodash_1.default.get(indexInfo, 'mappings.properties.migrationVersion')) {
            return false;
        }
        // If no migrations are actually defined, we're up to date!
        if (Object.keys(migrationVersion).length <= 0) {
            return true;
        }
        const response = await callCluster('count', {
            body: {
                query: {
                    bool: {
                        should: Object.entries(migrationVersion).map(([type, latestVersion]) => ({
                            bool: {
                                must: [
                                    { exists: { field: type } },
                                    { bool: { must_not: { term: { [`migrationVersion.${type}`]: latestVersion } } } },
                                ],
                            },
                        })),
                    },
                },
            },
            index,
        });
        assertResponseIncludeAllShards(response);
        return response.count === 0;
    }
    catch (e) {
        // retry for Service Unavailable
        if (e.status !== 503 || retryCount === 0) {
            throw e;
        }
        await new Promise(r => setTimeout(r, 1000));
        return await migrationsUpToDate(callCluster, index, migrationVersion, retryCount - 1);
    }
}
exports.migrationsUpToDate = migrationsUpToDate;
async function createIndex(callCluster, index, mappings) {
    await callCluster('indices.create', {
        body: { mappings, settings },
        index,
    });
}
exports.createIndex = createIndex;
async function deleteIndex(callCluster, index) {
    await callCluster('indices.delete', { index });
}
exports.deleteIndex = deleteIndex;
/**
 * Converts an index to an alias. The `alias` parameter is the desired alias name which currently
 * is a concrete index. This function will reindex `alias` into a new index, delete the `alias`
 * index, and then create an alias `alias` that points to the new index.
 *
 * @param {CallCluster} callCluster - The connection to ElasticSearch
 * @param {FullIndexInfo} info - Information about the mappings and name of the new index
 * @param {string} alias - The name of the index being converted to an alias
 */
async function convertToAlias(callCluster, info, alias, batchSize) {
    await callCluster('indices.create', {
        body: { mappings: info.mappings, settings },
        index: info.indexName,
    });
    await reindex(callCluster, alias, info.indexName, batchSize);
    await claimAlias(callCluster, info.indexName, alias, [{ remove_index: { index: alias } }]);
}
exports.convertToAlias = convertToAlias;
/**
 * Points the specified alias to the specified index. This is an exclusive
 * alias, meaning that it will only point to one index at a time, so we
 * remove any other indices from the alias.
 *
 * @param {CallCluster} callCluster
 * @param {string} index
 * @param {string} alias
 * @param {AliasAction[]} aliasActions - Optional actions to be added to the updateAliases call
 */
async function claimAlias(callCluster, index, alias, aliasActions = []) {
    const result = await callCluster('indices.getAlias', { ignore: [404], name: alias });
    const aliasInfo = result.status === 404 ? {} : result;
    const removeActions = Object.keys(aliasInfo).map(key => ({ remove: { index: key, alias } }));
    await callCluster('indices.updateAliases', {
        body: {
            actions: aliasActions.concat(removeActions).concat({ add: { index, alias } }),
        },
    });
    await callCluster('indices.refresh', { index });
}
exports.claimAlias = claimAlias;
/**
 * This is a rough check to ensure that the index being migrated satisfies at least
 * some rudimentary expectations. Past Kibana indices had multiple root documents, etc
 * and the migration system does not (yet?) handle those indices. They need to be upgraded
 * via v5 -> v6 upgrade tools first. This file contains index-agnostic logic, and this
 * check is itself index-agnostic, though the error hint is a bit Kibana specific.
 *
 * @param {FullIndexInfo} indexInfo
 */
function assertIsSupportedIndex(indexInfo) {
    const mappings = indexInfo.mappings;
    const isV7Index = !!mappings.properties;
    if (!isV7Index) {
        throw new Error(`Index ${indexInfo.indexName} belongs to a version of Kibana ` +
            `that cannot be automatically migrated. Reset it or use the X-Pack upgrade assistant.`);
    }
    return indexInfo;
}
/**
 * Provides protection against reading/re-indexing against an index with missing
 * shards which could result in data loss. This shouldn't be common, as the Saved
 * Object indices should only ever have a single shard. This is more to handle
 * instances where customers manually expand the shards of an index.
 */
function assertResponseIncludeAllShards({ _shards }) {
    if (!lodash_1.default.has(_shards, 'total') || !lodash_1.default.has(_shards, 'successful')) {
        return;
    }
    const failed = _shards.total - _shards.successful;
    if (failed > 0) {
        throw new Error(`Re-index failed :: ${failed} of ${_shards.total} shards failed. ` +
            `Check Elasticsearch cluster health for more information.`);
    }
}
/**
 * Reindexes from source to dest, polling for the reindex completion.
 */
async function reindex(callCluster, source, dest, batchSize) {
    // We poll instead of having the request wait for completion, as for large indices,
    // the request times out on the Elasticsearch side of things. We have a relatively tight
    // polling interval, as the request is fairly efficent, and we don't
    // want to block index migrations for too long on this.
    const pollInterval = 250;
    const { task } = await callCluster('reindex', {
        body: {
            dest: { index: dest },
            source: { index: source, size: batchSize },
        },
        refresh: true,
        waitForCompletion: false,
    });
    let completed = false;
    while (!completed) {
        await new Promise(r => setTimeout(r, pollInterval));
        completed = await callCluster('tasks.get', {
            taskId: task,
        }).then(result => {
            if (result.error) {
                const e = result.error;
                throw new Error(`Re-index failed [${e.type}] ${e.reason} :: ${JSON.stringify(e)}`);
            }
            return result.completed;
        });
    }
}
