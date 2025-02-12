'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = query;

var _get_bucket_size = require('../../helpers/get_bucket_size');

var _get_bucket_size2 = _interopRequireDefault(_get_bucket_size);

var _get_timerange = require('../../helpers/get_timerange');

var _get_timerange2 = _interopRequireDefault(_get_timerange);

var _esQuery = require('@kbn/es-query');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function query(req, panel, annotation, esQueryConfig, indexPattern) {
  return next => doc => {
    const timeField = annotation.time_field;
    const { bucketSize } = (0, _get_bucket_size2.default)(req, 'auto');
    const { from, to } = (0, _get_timerange2.default)(req);

    doc.size = 0;
    const queries = !annotation.ignore_global_filters ? req.payload.query : [];
    const filters = !annotation.ignore_global_filters ? req.payload.filters : [];
    doc.query = (0, _esQuery.buildEsQuery)(indexPattern, queries, filters, esQueryConfig);
    const timerange = {
      range: {
        [timeField]: {
          gte: from.toISOString(),
          lte: to.subtract(bucketSize, 'seconds').toISOString(),
          format: 'strict_date_optional_time'
        }
      }
    };
    doc.query.bool.must.push(timerange);

    if (annotation.query_string) {
      doc.query.bool.must.push({
        query_string: {
          query: annotation.query_string,
          analyze_wildcard: true
        }
      });
    }

    if (!annotation.ignore_panel_filters && panel.filter) {
      doc.query.bool.must.push({
        query_string: {
          query: panel.filter,
          analyze_wildcard: true
        }
      });
    }

    if (annotation.fields) {
      const fields = annotation.fields.split(/[,\s]+/) || [];
      fields.forEach(field => {
        doc.query.bool.must.push({ exists: { field } });
      });
    }

    return next(doc);
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