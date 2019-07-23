'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.natsLogsSpecProvider = natsLogsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _filebeat_instructions = require('../../../common/tutorials/filebeat_instructions');

function natsLogsSpecProvider(server, context) {
  const moduleName = 'nats';
  const geoipRequired = false;
  const uaRequired = false;
  const platforms = ['DEB', 'RPM'];
  return {
    id: 'natsLogs',
    name: _i18n.i18n.translate('kbn.server.tutorials.natsLogs.nameTitle', {
      defaultMessage: 'Nats logs'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.LOGGING,
    isBeta: true,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.natsLogs.shortDescription', {
      defaultMessage: 'Collect and parse logs created by Nats.'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.natsLogs.longDescription', {
      defaultMessage: 'The `nats` Filebeat module parses logs created by Nats. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-nats.html'
      }
    }),
    // euiIconType: 'logoNats',
    artifacts: {
      dashboards: [{
        id: 'Filebeat-nats-overview-ecs',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.natsLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Nats logs dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-nats.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/nats_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, geoipRequired, uaRequired, context),
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