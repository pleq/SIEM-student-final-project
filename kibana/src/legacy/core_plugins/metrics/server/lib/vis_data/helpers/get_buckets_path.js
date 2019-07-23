'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _metric_types = require('./metric_types');

var _to_percentile_number = require('./to_percentile_number');

const percentileTest = /\[[0-9\.]+\]$/; /*
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

exports.default = (id, metrics) => {
  const metric = metrics.find(m => (0, _lodash.startsWith)(id, m.id));
  let bucketsPath = String(id);

  switch (metric.type) {
    case _metric_types.METRIC_TYPES.DERIVATIVE:
      bucketsPath += '[normalized_value]';
      break;
    // For percentiles we need to breakout the percentile key that the user
    // specified. This information is stored in the key using the following pattern
    // {metric.id}[{percentile}]
    case _metric_types.METRIC_TYPES.PERCENTILE:
      if (percentileTest.test(bucketsPath)) break;
      const percent = metric.percentiles[0];
      bucketsPath += `[${(0, _to_percentile_number.toPercentileNumber)(percent.value)}]`;
      break;
    case _metric_types.METRIC_TYPES.PERCENTILE_RANK:
      bucketsPath += `[${(0, _to_percentile_number.toPercentileNumber)(metric.value)}]`;
      break;
    case _metric_types.METRIC_TYPES.STD_DEVIATION:
    case _metric_types.METRIC_TYPES.VARIANCE:
    case _metric_types.METRIC_TYPES.SUM_OF_SQUARES:
      if (/^std_deviation/.test(metric.type) && ~['upper', 'lower'].indexOf(metric.mode)) {
        bucketsPath += `[std_${metric.mode}]`;
      } else {
        bucketsPath += `[${metric.type}]`;
      }
      break;
  }

  return bucketsPath;
};

module.exports = exports['default'];