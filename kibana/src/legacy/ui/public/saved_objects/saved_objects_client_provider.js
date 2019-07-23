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
import chrome from '../chrome';
// Provide an angular wrapper around savedObjectClient so all actions get resolved in an Angular Promise
// If you do not need the promise to execute in an angular digest cycle then you should not use this
// and get savedObjectClient directly from chrome.
export function SavedObjectsClientProvider(Promise) {
    var savedObjectsClient = chrome.getSavedObjectsClient();
    return {
        create: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.create.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        bulkCreate: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.bulkCreate.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        delete: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.delete.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        find: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.find.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        get: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.get.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        bulkGet: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.bulkGet.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
        update: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(savedObjectsClient.update.apply(savedObjectsClient, tslib_1.__spread(args)));
        },
    };
}
