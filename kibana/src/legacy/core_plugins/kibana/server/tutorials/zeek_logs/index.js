'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zeekLogsSpecProvider = zeekLogsSpecProvider;

var _i18n = require('@kbn/i18n');

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _filebeat_instructions = require('../../../common/tutorials/filebeat_instructions');

function zeekLogsSpecProvider(server, context) {
  const moduleName = 'zeek';
  const platforms = ['OSX', 'DEB', 'RPM'];
  return {
    id: 'zeekLogs',
    name: _i18n.i18n.translate('kbn.server.tutorials.zeekLogs.nameTitle', {
      defaultMessage: 'Zeek logs'
    }),
    category: _tutorial_category.TUTORIAL_CATEGORY.SECURITY,
    shortDescription: _i18n.i18n.translate('kbn.server.tutorials.zeekLogs.shortDescription', {
      defaultMessage: 'Collect the logs created by Zeek/Bro.'
    }),
    longDescription: _i18n.i18n.translate('kbn.server.tutorials.zeekLogs.longDescription', {
      defaultMessage: 'The `zeek` Filebeat module collects the logs from \
[Zeek](https://www.zeek.org//documentation/index.html). \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-zeek.html'
      }
    }),
    //TODO: euiIconType: 'logoZeek',
    artifacts: {
      dashboards: [{
        id: '7cbb5410-3700-11e9-aa6d-ff445a78330c',
        linkLabel: _i18n.i18n.translate('kbn.server.tutorials.zeekLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Zeek logs dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-zeek.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/zeek_logs/screenshot.png',
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