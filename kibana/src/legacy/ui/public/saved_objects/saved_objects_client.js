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
import * as tslib_1 from "tslib";
import { cloneDeep, pick, throttle } from 'lodash';
import { resolve as resolveUrl } from 'url';
import { isAutoCreateIndexError, showAutoCreateIndexErrorPage } from '../error_auto_create_index';
import { kfetch } from '../kfetch';
import { keysToCamelCaseShallow, keysToSnakeCaseShallow } from '../utils/case_conversion';
import { SavedObject } from './saved_object';
var join = function () {
    var uriComponents = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        uriComponents[_i] = arguments[_i];
    }
    return uriComponents
        .filter(function (comp) { return Boolean(comp); })
        .map(encodeURIComponent)
        .join('/');
};
/**
 * Interval that requests are batched for
 * @type {integer}
 */
var BATCH_INTERVAL = 100;
var API_BASE_URL = '/api/saved_objects/';
var SavedObjectsClient = /** @class */ (function () {
    function SavedObjectsClient() {
        var _this = this;
        /**
         * Throttled processing of get requests into bulk requests at 100ms interval
         */
        this.processBatchQueue = throttle(function () {
            var queue = cloneDeep(_this.batchQueue);
            _this.batchQueue = [];
            _this.bulkGet(queue)
                .then(function (_a) {
                var savedObjects = _a.savedObjects;
                queue.forEach(function (queueItem) {
                    var foundObject = savedObjects.find(function (savedObject) {
                        return savedObject.id === queueItem.id && savedObject.type === queueItem.type;
                    });
                    if (!foundObject) {
                        return queueItem.resolve(_this.createSavedObject(pick(queueItem, ['id', 'type'])));
                    }
                    queueItem.resolve(foundObject);
                });
            })
                .catch(function (err) {
                queue.forEach(function (queueItem) {
                    queueItem.reject(err);
                });
            });
        }, BATCH_INTERVAL, { leading: false });
        /**
         * Persists an object
         *
         * @param {string} type
         * @param {object} [attributes={}]
         * @param {object} [options={}]
         * @property {string} [options.id] - force id on creation, not recommended
         * @property {boolean} [options.overwrite=false]
         * @property {object} [options.migrationVersion]
         * @returns
         */
        this.create = function (type, attributes, options) {
            if (options === void 0) { options = {}; }
            if (!type || !attributes) {
                return Promise.reject(new Error('requires type and attributes'));
            }
            var path = _this.getPath([type, options.id]);
            var query = {
                overwrite: options.overwrite,
            };
            var createRequest = _this.request({
                method: 'POST',
                path: path,
                query: query,
                body: {
                    attributes: attributes,
                    migrationVersion: options.migrationVersion,
                    references: options.references,
                },
            });
            return createRequest
                .then(function (resp) { return _this.createSavedObject(resp); })
                .catch(function (error) {
                if (isAutoCreateIndexError(error)) {
                    showAutoCreateIndexErrorPage();
                }
                throw error;
            });
        };
        /**
         * Creates multiple documents at once
         *
         * @param {array} objects - [{ type, id, attributes, references, migrationVersion }]
         * @param {object} [options={}]
         * @property {boolean} [options.overwrite=false]
         * @returns The result of the create operation containing created saved objects.
         */
        this.bulkCreate = function (objects, options) {
            if (objects === void 0) { objects = []; }
            if (options === void 0) { options = {}; }
            var path = _this.getPath(['_bulk_create']);
            var query = pick(options, ['overwrite']);
            var request = _this.request({
                method: 'POST',
                path: path,
                query: query,
                body: objects,
            });
            return request.then(function (resp) {
                resp.saved_objects = resp.saved_objects.map(function (d) { return _this.createSavedObject(d); });
                return keysToCamelCaseShallow(resp);
            });
        };
        /**
         * Deletes an object
         *
         * @param type
         * @param id
         * @returns
         */
        this.delete = function (type, id) {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return _this.request({ method: 'DELETE', path: _this.getPath([type, id]) });
        };
        /**
         * Search for objects
         *
         * @param {object} [options={}]
         * @property {string} options.type
         * @property {string} options.search
         * @property {string} options.searchFields - see Elasticsearch Simple Query String
         *                                        Query field argument for more information
         * @property {integer} [options.page=1]
         * @property {integer} [options.perPage=20]
         * @property {array} options.fields
         * @property {object} [options.hasReference] - { type, id }
         * @returns A find result with objects matching the specified search.
         */
        this.find = function (options) {
            if (options === void 0) { options = {}; }
            var path = _this.getPath(['_find']);
            var query = keysToSnakeCaseShallow(options);
            var request = _this.request({
                method: 'GET',
                path: path,
                query: query,
            });
            return request.then(function (resp) {
                resp.saved_objects = resp.saved_objects.map(function (d) { return _this.createSavedObject(d); });
                return keysToCamelCaseShallow(resp);
            });
        };
        /**
         * Fetches a single object
         *
         * @param {string} type
         * @param {string} id
         * @returns The saved object for the given type and id.
         */
        this.get = function (type, id) {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return new Promise(function (resolve, reject) {
                _this.batchQueue.push({ type: type, id: id, resolve: resolve, reject: reject });
                _this.processBatchQueue();
            });
        };
        /**
         * Returns an array of objects by id
         *
         * @param {array} objects - an array ids, or an array of objects containing id and optionally type
         * @returns The saved objects with the given type and ids requested
         * @example
         *
         * bulkGet([
         *   { id: 'one', type: 'config' },
         *   { id: 'foo', type: 'index-pattern' }
         * ])
         */
        this.bulkGet = function (objects) {
            if (objects === void 0) { objects = []; }
            var path = _this.getPath(['_bulk_get']);
            var filteredObjects = objects.map(function (obj) { return pick(obj, ['id', 'type']); });
            var request = _this.request({
                method: 'POST',
                path: path,
                body: filteredObjects,
            });
            return request.then(function (resp) {
                resp.saved_objects = resp.saved_objects.map(function (d) { return _this.createSavedObject(d); });
                return keysToCamelCaseShallow(resp);
            });
        };
        this.batchQueue = [];
    }
    /**
     * Updates an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} attributes
     * @param {object} options
     * @prop {integer} options.version - ensures version matches that of persisted object
     * @prop {object} options.migrationVersion - The optional migrationVersion of this document
     * @returns
     */
    SavedObjectsClient.prototype.update = function (type, id, attributes, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, version = _b.version, migrationVersion = _b.migrationVersion, references = _b.references;
        if (!type || !id || !attributes) {
            return Promise.reject(new Error('requires type, id and attributes'));
        }
        var path = this.getPath([type, id]);
        var body = {
            attributes: attributes,
            migrationVersion: migrationVersion,
            references: references,
            version: version,
        };
        var request = this.request({
            method: 'PUT',
            path: path,
            body: body,
        });
        return request.then(function (resp) {
            return _this.createSavedObject(resp);
        });
    };
    SavedObjectsClient.prototype.createSavedObject = function (options) {
        return new SavedObject(this, options);
    };
    SavedObjectsClient.prototype.getPath = function (path) {
        return resolveUrl(API_BASE_URL, join.apply(void 0, tslib_1.__spread(path)));
    };
    SavedObjectsClient.prototype.request = function (_a) {
        var method = _a.method, path = _a.path, query = _a.query, body = _a.body;
        if (method === 'GET' && body) {
            return Promise.reject(new Error('body not permitted for GET requests'));
        }
        return kfetch({ method: method, pathname: path, query: query, body: JSON.stringify(body) });
    };
    return SavedObjectsClient;
}());
export { SavedObjectsClient };
