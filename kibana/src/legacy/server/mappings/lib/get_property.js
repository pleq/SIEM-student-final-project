'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProperty = getProperty;

var _toPath = require('lodash/internal/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Recursively read properties from the mapping object of type "object"
 *  until the `path` is resolved.
 *  @param  {EsObjectMapping} mapping
 *  @param  {Array<string>} path
 *  @return {Objects|undefined}
 */
function getPropertyMappingFromObjectMapping(mapping, path) {
  const props = mapping && (mapping.properties || mapping.fields);

  if (!props) {
    return undefined;
  }

  if (path.length > 1) {
    return getPropertyMappingFromObjectMapping(props[path[0]], path.slice(1));
  } else {
    return props[path[0]];
  }
}

/**
 *  Get the mapping for a specific property within the root type of the EsMappingsDsl.
 *  @param  {EsMappingsDsl} mappings
 *  @param  {string|Array<string>} path
 *  @return {Object|undefined}
 */
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

function getProperty(mappings, path) {
  return getPropertyMappingFromObjectMapping(mappings, (0, _toPath2.default)(path));
}