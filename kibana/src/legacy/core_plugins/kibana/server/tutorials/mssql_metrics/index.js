'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mssqlMetricsSpecProvider = mssqlMetricsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _metricbeat_instructions = require('../../../common/tutorials/metricbeat_instructions');

function mssqlMetricsSpecProvider(server, context) {
  const moduleName = 'mssql';
  return {
    id: 'mssqlMetrics',
    name: _i18n.i18n.translate('kbn.server.tutorials.mssqlMetrics.nameTitle', {
      defaultMessage: 'Microsoft SQL Server Metrics'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.METRICS,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.mssqlMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from a Microsoft SQL Server instance'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.mssqlMetrics.longDescription', {
      defaultMessage: 'The `mssql` Metricbeat module fetches monitoring, log and performance metrics from a Microsoft SQL Server instance. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-mssql.html'
      }
    }),
    // euiIconType: 'logoMSSQL',
    isBeta: false,
    artifacts: {
      dashboards: [{
        id: 'a2ead240-18bb-11e9-9836-f37dedd3b411-ecs',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.mssqlMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Microsoft SQL Server metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-mssql.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/mssql_metrics/screenshot.png',
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