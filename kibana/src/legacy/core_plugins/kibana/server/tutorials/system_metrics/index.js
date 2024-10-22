'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemMetricsSpecProvider = systemMetricsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _metricbeat_instructions = require('../../../common/tutorials/metricbeat_instructions');

function systemMetricsSpecProvider(server, context) {
  const moduleName = 'system';
  return {
    id: 'systemMetrics',
    name: _i18n.i18n.translate('kbn.server.tutorials.systemMetrics.nameTitle', {
      defaultMessage: 'System metrics'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.METRICS,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.systemMetrics.shortDescription', {
      defaultMessage: 'Collect CPU, memory, network, and disk statistics from the host.'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.systemMetrics.longDescription', {
      defaultMessage: 'The `system` Metricbeat module collects CPU, memory, network, and disk statistics from the host. \
It collects system wide statistics and statistics per process and filesystem. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-system.html'
      }
    }),
    artifacts: {
      dashboards: [{
        id: 'Metricbeat-system-overview-ecs',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.systemMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'System metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-system.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/system_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, null, null, null, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
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