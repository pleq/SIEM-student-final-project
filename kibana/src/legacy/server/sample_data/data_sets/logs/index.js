'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logsSpecProvider = logsSpecProvider;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _i18n = require('@kbn/i18n');

var _saved_objects = require('./saved_objects');

var _field_mappings = require('./field_mappings');

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

function logsSpecProvider() {
  return {
    id: 'logs',
    name: _i18n.i18n.translate('server.sampleData.logsSpecTitle', {
      defaultMessage: 'Sample web logs'
    }),
    description: _i18n.i18n.translate('server.sampleData.logsSpecDescription', {
      defaultMessage: 'Sample data, visualizations, and dashboards for monitoring web logs.'
    }),
    previewImagePath: '/plugins/kibana/home/sample_data_resources/logs/dashboard.png',
    darkPreviewImagePath: '/plugins/kibana/home/sample_data_resources/logs/dashboard_dark.png',
    overviewDashboard: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
    defaultIndex: '90943e30-9a47-11e8-b64d-95841ca0b247',
    savedObjects: (0, _saved_objects.getSavedObjects)(),
    dataIndices: [{
      id: 'logs',
      dataPath: _path2.default.join(__dirname, './logs.json.gz'),
      fields: _field_mappings.fieldMappings,
      timeFields: ['timestamp'],
      currentTimeMarker: '2018-08-01T00:00:00',
      preserveDayOfWeekTimeOfDay: true
    }]
  };
}