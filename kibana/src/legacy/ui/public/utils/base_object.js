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
import angular from 'angular';
import _ from 'lodash';
// @ts-ignore -- awaiting https://github.com/w33ble/rison-node/issues/1
import rison from 'rison-node';
var BaseObject = /** @class */ (function () {
    // Set the attributes or default to an empty object
    function BaseObject(attributes) {
        if (attributes === void 0) { attributes = {}; }
        // Set the attributes or default to an empty object
        _.assign(this, attributes);
    }
    BaseObject.prototype.toObject = function () {
        // return just the data.
        return _.omit(this, function (value, key) {
            return key.charAt(0) === '$' || key.charAt(0) === '_' || _.isFunction(value);
        });
    };
    BaseObject.prototype.toRISON = function () {
        // Use Angular to remove the private vars, and JSON.stringify to serialize
        return rison.encode(JSON.parse(angular.toJson(this)));
    };
    BaseObject.prototype.toJSON = function () {
        return this.toObject();
    };
    return BaseObject;
}());
export { BaseObject };
