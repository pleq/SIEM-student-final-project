'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureEsVersion = ensureEsVersion;

var _lodash = require('lodash');

var _semver = require('semver');

var _is_es_compatible_with_kibana = require('./is_es_compatible_with_kibana');

var _is_es_compatible_with_kibana2 = _interopRequireDefault(_is_es_compatible_with_kibana);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * tracks the node descriptions that get logged in warnings so
 * that we don't spam the log with the same message over and over.
 *
 * There are situations, like in testing or multi-tenancy, where
 * the server argument changes, so we must track the previous
 * node warnings per server
 */
const lastWarnedNodesForServer = new WeakMap(); /*
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

/**
 * ES and Kibana versions are locked, so Kibana should require that ES has the same version as
 * that defined in Kibana's package.json.
 */

function ensureEsVersion(server, kibanaVersion) {
  const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('admin');
  const isProd = server.config().get('env.prod');

  server.logWithMetadata(['plugin', 'debug'], 'Checking Elasticsearch version');
  return callWithInternalUser('nodes.info', {
    filterPath: ['nodes.*.version', 'nodes.*.http.publish_address', 'nodes.*.ip']
  }).then(function (info) {
    // Aggregate incompatible ES nodes.
    const incompatibleNodes = [];

    // Aggregate ES nodes which should prompt a Kibana upgrade.
    const warningNodes = [];

    (0, _lodash.forEach)(info.nodes, esNode => {
      if (!(0, _is_es_compatible_with_kibana2.default)(esNode.version, kibanaVersion)) {
        // Exit early to avoid collecting ES nodes with newer major versions in the `warningNodes`.
        return incompatibleNodes.push(esNode);
      }

      // It's acceptable if ES and Kibana versions are not the same so long as
      // they are not incompatible, but we should warn about it
      // In development we ignore, this can be expected when testing against snapshots
      // or across version qualifiers
      const exactMisMatch = esNode.version !== kibanaVersion;
      const looseMismatch = (0, _semver.coerce)(esNode.version).version !== (0, _semver.coerce)(kibanaVersion).version;
      if (isProd && exactMisMatch || looseMismatch) {
        warningNodes.push(esNode);
      }
    });

    function getHumanizedNodeNames(nodes) {
      return nodes.map(node => {
        const publishAddress = (0, _lodash.get)(node, 'http.publish_address') ? (0, _lodash.get)(node, 'http.publish_address') + ' ' : '';
        return 'v' + node.version + ' @ ' + publishAddress + '(' + node.ip + ')';
      });
    }

    if (warningNodes.length) {
      const simplifiedNodes = warningNodes.map(node => ({
        version: node.version,
        http: {
          publish_address: (0, _lodash.get)(node, 'http.publish_address')
        },
        ip: node.ip
      }));

      // Don't show the same warning over and over again.
      const warningNodeNames = getHumanizedNodeNames(simplifiedNodes).join(', ');
      if (lastWarnedNodesForServer.get(server) !== warningNodeNames) {
        lastWarnedNodesForServer.set(server, warningNodeNames);
        server.logWithMetadata(['warning'], `You're running Kibana ${kibanaVersion} with some different versions of ` + 'Elasticsearch. Update Kibana or Elasticsearch to the same ' + `version to prevent compatibility issues: ${warningNodeNames}`, {
          kibanaVersion,
          nodes: simplifiedNodes
        });
      }
    }

    if (incompatibleNodes.length) {
      const incompatibleNodeNames = getHumanizedNodeNames(incompatibleNodes);
      throw new Error(`This version of Kibana requires Elasticsearch v` + `${kibanaVersion} on all nodes. I found ` + `the following incompatible nodes in your cluster: ${incompatibleNodeNames.join(', ')}`);
    }

    return true;
  });
}