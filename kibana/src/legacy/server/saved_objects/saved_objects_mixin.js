'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsMixin = savedObjectsMixin;

var _migrations = require('./migrations');

var _schema = require('./schema');

var _serialization = require('./serialization');

var _service = require('./service');

var _mappings = require('../mappings');

var _routes = require('./routes');

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

function savedObjectsMixin(kbnServer, server) {
  const migrator = new _migrations.KibanaMigrator({ kbnServer });

  server.decorate('server', 'kibanaMigrator', migrator);

  const warn = message => server.log(['warning', 'saved-objects'], message);
  // we use kibana.index which is technically defined in the kibana plugin, so if
  // we don't have the plugin (mainly tests) we can't initialize the saved objects
  if (!kbnServer.pluginSpecs.some(p => p.getId() === 'kibana')) {
    warn('Saved Objects uninitialized because the Kibana plugin is disabled.');
    return;
  }

  const prereqs = {
    getSavedObjectsClient: {
      assign: 'savedObjectsClient',
      method(req) {
        return req.getSavedObjectsClient();
      }
    }
  };
  server.route((0, _routes.createBulkCreateRoute)(prereqs));
  server.route((0, _routes.createBulkGetRoute)(prereqs));
  server.route((0, _routes.createCreateRoute)(prereqs));
  server.route((0, _routes.createDeleteRoute)(prereqs));
  server.route((0, _routes.createFindRoute)(prereqs));
  server.route((0, _routes.createGetRoute)(prereqs));
  server.route((0, _routes.createUpdateRoute)(prereqs));

  const schema = new _schema.SavedObjectsSchema(kbnServer.uiExports.savedObjectSchemas);
  const serializer = new _serialization.SavedObjectsSerializer(schema);
  const mappings = migrator.getActiveMappings();
  const allTypes = Object.keys((0, _mappings.getRootPropertiesObjects)(mappings));
  const visibleTypes = allTypes.filter(type => !schema.isHiddenType(type));

  const createRepository = (callCluster, extraTypes = []) => {
    if (typeof callCluster !== 'function') {
      throw new TypeError('Repository requires a "callCluster" function to be provided.');
    }
    // throw an exception if an extraType is not defined.
    extraTypes.forEach(type => {
      if (!allTypes.includes(type)) {
        throw new Error(`Missing mappings for saved objects type '${type}'`);
      }
    });
    const combinedTypes = visibleTypes.concat(extraTypes);
    const allowedTypes = [...new Set(combinedTypes)];

    return new _service.SavedObjectsRepository({
      index: server.config().get('kibana.index'),
      migrator,
      mappings,
      schema,
      serializer,
      allowedTypes,
      callCluster
    });
  };

  const provider = new _service.ScopedSavedObjectsClientProvider({
    index: server.config().get('kibana.index'),
    mappings,
    defaultClientFactory({ request }) {
      const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
      const callCluster = (...args) => callWithRequest(request, ...args);
      const repository = createRepository(callCluster);

      return new _service.SavedObjectsClient(repository);
    }
  });

  const service = {
    types: visibleTypes,
    SavedObjectsClient: _service.SavedObjectsClient,
    SavedObjectsRepository: _service.SavedObjectsRepository,
    getSavedObjectsRepository: createRepository,
    getScopedSavedObjectsClient: (...args) => provider.getClient(...args),
    setScopedSavedObjectsClientFactory: (...args) => provider.setClientFactory(...args),
    addScopedSavedObjectsClientWrapperFactory: (...args) => provider.addClientWrapperFactory(...args)
  };
  server.decorate('server', 'savedObjects', service);

  const savedObjectsClientCache = new WeakMap();
  server.decorate('request', 'getSavedObjectsClient', function () {
    const request = this;

    if (savedObjectsClientCache.has(request)) {
      return savedObjectsClientCache.get(request);
    }

    const savedObjectsClient = server.savedObjects.getScopedSavedObjectsClient(request);

    savedObjectsClientCache.set(request, savedObjectsClient);
    return savedObjectsClient;
  });
}