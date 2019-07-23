'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDateOnServerFormat = createDateOnServerFormat;

var _lodash = require('lodash');

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

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

function createDateOnServerFormat(FieldFormat) {
  var _class, _temp;

  return _temp = _class = class DateFormat extends FieldFormat {
    constructor(params, getConfig) {
      super(params);

      this.getConfig = getConfig;
      this._memoizedConverter = (0, _lodash.memoize)(val => {
        if (val == null) {
          return '-';
        }

        /* On the server, importing moment returns a new instance. Unlike on
         * the client side, it doesn't have the dateFormat:tz configuration
         * baked in.
         * We need to set the timezone manually here. The date is taken in as
         * UTC and converted into the desired timezone. */
        let date;
        if (this._timeZone === 'Browser') {
          // Assume a warning has been logged this can be unpredictable. It
          // would be too verbose to log anything here.
          date = _momentTimezone2.default.utc(val);
        } else {
          date = _momentTimezone2.default.utc(val).tz(this._timeZone);
        }

        if (date.isValid()) {
          return date.format(this._memoizedPattern);
        } else {
          return val;
        }
      });
    }

    getParamDefaults() {
      return {
        pattern: this.getConfig('dateFormat'),
        timezone: this.getConfig('dateFormat:tz')
      };
    }

    _convert(val) {
      // don't give away our ref to converter so we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');

      const timezoneChanged = this._timeZone !== timezone;
      const datePatternChanged = this._memoizedPattern !== pattern;
      if (timezoneChanged || datePatternChanged) {
        this._timeZone = timezone;
        this._memoizedPattern = pattern;
      }

      return this._memoizedConverter(val);
    }

  }, _class.id = 'date', _class.title = 'Date', _class.fieldType = 'date', _temp;
}