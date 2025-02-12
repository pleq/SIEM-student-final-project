'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRelationships = findRelationships;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

async function findRelationships(type, id, options = {}) {
  const {
    size,
    savedObjectsClient,
    savedObjectTypes
  } = options;

  const { references = [] } = await savedObjectsClient.get(type, id);
  const bulkGetOpts = references.map(ref => ({ id: ref.id, type: ref.type }));

  const [referencedObjects, referencedResponse] = await Promise.all([bulkGetOpts.length > 0 ? savedObjectsClient.bulkGet(bulkGetOpts) : Promise.resolve({ saved_objects: [] }), savedObjectsClient.find({
    hasReference: { type, id },
    perPage: size,
    fields: ['title'],
    type: savedObjectTypes
  })]);

  const relationshipObjects = [].concat(referencedObjects.saved_objects.map(extractCommonProperties), referencedResponse.saved_objects.map(extractCommonProperties));

  return relationshipObjects.reduce((result, relationshipObject) => {
    const objectsForType = result[relationshipObject.type] || [];
    const { type } = relationshipObject,
          relationshipObjectWithoutType = _objectWithoutProperties(relationshipObject, ['type']);
    result[type] = objectsForType.concat(relationshipObjectWithoutType);
    return result;
  }, {});
}

function extractCommonProperties(savedObject) {
  return {
    id: savedObject.id,
    type: savedObject.type,
    title: savedObject.attributes.title
  };
}