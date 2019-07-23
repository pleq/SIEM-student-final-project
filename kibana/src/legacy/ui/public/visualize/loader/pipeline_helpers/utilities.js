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
import * as tslib_1 from "tslib";
import { i18n } from '@kbn/i18n';
import { identity } from 'lodash';
// @ts-ignore
import { FieldFormat } from '../../../../field_formats/field_format';
// @ts-ignore
import { tabifyGetColumns } from '../../../agg_response/tabify/_get_columns';
import chrome from '../../../chrome';
// @ts-ignore
import { fieldFormats } from '../../../registry/field_formats';
var config = chrome.getUiSettingsClient();
var getConfig = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return config.get.apply(config, tslib_1.__spread(args));
};
var getDefaultFieldFormat = function () { return ({ convert: identity }); };
var getFieldFormat = function (id, params) {
    var Format = fieldFormats.byId[id];
    if (Format) {
        return new Format(params, getConfig);
    }
    else {
        return getDefaultFieldFormat();
    }
};
export var getFormat = function (mapping) {
    if (!mapping) {
        return getDefaultFieldFormat();
    }
    var id = mapping.id;
    if (id === 'range') {
        var RangeFormat = FieldFormat.from(function (range) {
            var format = getFieldFormat(id, mapping.params);
            return i18n.translate('common.ui.aggTypes.buckets.ranges.rangesFormatMessage', {
                defaultMessage: '{from} to {to}',
                values: {
                    from: format.convert(range.gte),
                    to: format.convert(range.lt),
                },
            });
        });
        return new RangeFormat();
    }
    else if (id === 'terms') {
        return {
            getConverterFor: function (type) {
                var format = getFieldFormat(mapping.params.id, mapping.params);
                return function (val) {
                    if (val === '__other__') {
                        return mapping.params.otherBucketLabel;
                    }
                    if (val === '__missing__') {
                        return mapping.params.missingBucketLabel;
                    }
                    var parsedUrl = {
                        origin: window.location.origin,
                        pathname: window.location.pathname,
                        basePath: chrome.getBasePath(),
                    };
                    return format.convert(val, undefined, undefined, parsedUrl);
                };
            },
            convert: function (val, type) {
                var format = getFieldFormat(mapping.params.id, mapping.params);
                if (val === '__other__') {
                    return mapping.params.otherBucketLabel;
                }
                if (val === '__missing__') {
                    return mapping.params.missingBucketLabel;
                }
                var parsedUrl = {
                    origin: window.location.origin,
                    pathname: window.location.pathname,
                    basePath: chrome.getBasePath(),
                };
                return format.convert(val, type, undefined, parsedUrl);
            },
        };
    }
    else {
        return getFieldFormat(id, mapping.params);
    }
};
export var getTableAggs = function (vis) {
    if (!vis.aggs || !vis.aggs.getResponseAggs) {
        return [];
    }
    var columns = tabifyGetColumns(vis.aggs.getResponseAggs(), !vis.isHierarchical());
    return columns.map(function (c) { return c.aggConfig; });
};
