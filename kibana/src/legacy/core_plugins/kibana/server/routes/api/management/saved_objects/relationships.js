'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRelationships = registerRelationships;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _relationships = require('../../../../lib/management/saved_objects/relationships');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function registerRelationships(server) {
  server.route({
    path: '/api/kibana/management/saved_objects/relationships/{type}/{id}',
    method: ['GET'],
    config: {
      validate: {
        params: _joi2.default.object().keys({
          type: _joi2.default.string(),
          id: _joi2.default.string()
        }),
        query: _joi2.default.object().keys({
          size: _joi2.default.number().default(10000)
        })
      }
    },

    handler: async req => {
      const type = req.params.type;
      const id = req.params.id;
      const size = req.query.size;
      const savedObjectsClient = req.getSavedObjectsClient();

      return await (0, _relationships.findRelationships)(type, id, {
        size,
        savedObjectsClient,
        // Pass in all types except space, spaces wrapper will throw error
        savedObjectTypes: server.savedObjects.types.filter(type => type !== 'space')
      });
    }
  });
}