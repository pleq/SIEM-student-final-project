'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = percentile;

var _lodash = require('lodash');

var _get_splits = require('../../helpers/get_splits');

var _get_splits2 = _interopRequireDefault(_get_splits);

var _get_last_metric = require('../../helpers/get_last_metric');

var _get_last_metric2 = _interopRequireDefault(_get_last_metric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function percentile(bucket, panel, series) {
  return next => results => {
    const metric = (0, _get_last_metric2.default)(series);
    if (metric.type !== 'percentile') return next(results);

    const fakeResp = { aggregations: bucket };

    (0, _get_splits2.default)(fakeResp, panel, series).forEach(split => {

      // table allows only one percentile in a series (the last one will be chosen in case of several)
      const percentile = (0, _lodash.last)(metric.percentiles);
      let percentileKey = percentile.value ? percentile.value : 0;
      if (!/\./.test(percentileKey)) {
        percentileKey = `${percentileKey}.0`;
      }

      const data = split.timeseries.buckets.map(bucket => [bucket.key, bucket[metric.id].values[percentileKey]]);

      results.push({
        id: split.id,
        data
      });
    });
    return next(results);
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
module.exports = exports['default'];