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
import { get, has, set } from 'lodash';
var SavedObject = /** @class */ (function () {
    function SavedObject(client, _a) {
        var id = _a.id, type = _a.type, version = _a.version, attributes = _a.attributes, error = _a.error, references = _a.references, migrationVersion = _a.migrationVersion;
        this.client = client;
        this.id = id;
        this.type = type;
        this.attributes = attributes || {};
        this.references = references || [];
        this._version = version;
        this.migrationVersion = migrationVersion;
        if (error) {
            this.error = error;
        }
    }
    SavedObject.prototype.get = function (key) {
        return get(this.attributes, key);
    };
    SavedObject.prototype.set = function (key, value) {
        return set(this.attributes, key, value);
    };
    SavedObject.prototype.has = function (key) {
        return has(this.attributes, key);
    };
    SavedObject.prototype.save = function () {
        if (this.id) {
            return this.client.update(this.type, this.id, this.attributes, {
                migrationVersion: this.migrationVersion,
                references: this.references,
            });
        }
        else {
            return this.client.create(this.type, this.attributes, {
                migrationVersion: this.migrationVersion,
                references: this.references,
            });
        }
    };
    SavedObject.prototype.delete = function () {
        return this.client.delete(this.type, this.id);
    };
    return SavedObject;
}());
export { SavedObject };
