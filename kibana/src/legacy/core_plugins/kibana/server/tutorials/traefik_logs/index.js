'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traefikLogsSpecProvider = traefikLogsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _filebeat_instructions = require('../../../common/tutorials/filebeat_instructions');

function traefikLogsSpecProvider(server, context) {
  const moduleName = 'traefik';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'traefikLogs',
    name: _i18n.i18n.translate('kbn.server.tutorials.traefikLogs.nameTitle', {
      defaultMessage: 'Traefik logs'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.LOGGING,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.traefikLogs.shortDescription', {
      defaultMessage: 'Collect and parse access logs created by the Traefik Proxy.'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.traefikLogs.longDescription', {
      defaultMessage: 'The `traefik` Filebeat module parses access logs created by Traefik. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-traefik.html'
      }
    }),
    //euiIconType: 'logoTraefik',
    artifacts: {
      dashboards: [{
        id: 'Filebeat-Traefik-Dashboard-ecs',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.traefikLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Traefik logs dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-traefik.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/traefik_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
} /*
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