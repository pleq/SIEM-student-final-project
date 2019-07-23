'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.natsMetricsSpecProvider = natsMetricsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _metricbeat_instructions = require('../../../common/tutorials/metricbeat_instructions');

function natsMetricsSpecProvider(server, context) {
  const moduleName = 'nats';
  return {
    id: 'natsMetrics',
    name: _i18n.i18n.translate('kbn.server.tutorials.natsMetrics.nameTitle', {
      defaultMessage: 'Nats metrics'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.METRICS,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.natsMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from the Nats server.'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.natsMetrics.longDescription', {
      defaultMessage: 'The `nats` Metricbeat module fetches monitoring metrics from Nats. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-nats.html'
      }
    }),
    // euiIconType: 'logoNats',
    artifacts: {
      dashboards: [{
        id: 'Metricbeat-Nats-Dashboard-ecs',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.natsMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Nats metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-nats.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/nats_metrics/screenshot.png',
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