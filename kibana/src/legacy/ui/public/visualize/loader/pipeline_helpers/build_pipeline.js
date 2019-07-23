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
var _this = this;
import * as tslib_1 from "tslib";
import { cloneDeep } from 'lodash';
import moment from 'moment';
// @ts-ignore
import { setBounds } from 'ui/agg_types/buckets/date_histogram';
var vislibCharts = [
    'area',
    'gauge',
    'goal',
    'heatmap',
    'histogram',
    'horizontal_bar',
    'line',
];
export var getSchemas = function (vis, timeRange) {
    var createFormat = function (agg) {
        var format = agg.params.field ? agg.params.field.format.toJSON() : {};
        var formats = {
            date_range: function () { return ({ id: 'string' }); },
            percentile_ranks: function () { return ({ id: 'percent' }); },
            count: function () { return ({ id: 'number' }); },
            cardinality: function () { return ({ id: 'number' }); },
            date_histogram: function () { return ({
                id: 'date',
                params: {
                    pattern: agg.buckets.getScaledDateFormat(),
                },
            }); },
            terms: function () { return ({
                id: 'terms',
                params: tslib_1.__assign({ id: format.id, otherBucketLabel: agg.params.otherBucketLabel, missingBucketLabel: agg.params.missingBucketLabel }, format.params),
            }); },
            range: function () { return ({
                id: 'range',
                params: tslib_1.__assign({ id: format.id }, format.params),
            }); },
        };
        return formats[agg.type.name] ? formats[agg.type.name]() : format;
    };
    var createSchemaConfig = function (accessor, agg) {
        if (agg.type.name === 'date_histogram') {
            agg.params.timeRange = timeRange;
            setBounds(agg, true);
        }
        var hasSubAgg = [
            'derivative',
            'moving_avg',
            'serial_diff',
            'cumulative_sum',
            'sum_bucket',
            'avg_bucket',
            'min_bucket',
            'max_bucket',
        ].includes(agg.type.name);
        var format = createFormat(hasSubAgg ? agg.params.customMetric || agg.aggConfigs.byId[agg.params.metricAgg] : agg);
        var params = {};
        if (agg.type.name === 'geohash_grid') {
            params.precision = agg.params.precision;
            params.useGeocentroid = agg.params.useGeocentroid;
        }
        return {
            accessor: accessor,
            format: format,
            params: params,
            aggType: agg.type.name,
        };
    };
    var cnt = 0;
    var schemas = {
        metric: [],
    };
    var responseAggs = vis.aggs.getResponseAggs().filter(function (agg) { return agg.enabled; });
    var isHierarchical = vis.isHierarchical();
    var metrics = responseAggs.filter(function (agg) { return agg.type.type === 'metrics'; });
    responseAggs.forEach(function (agg) {
        if (!agg.enabled) {
            cnt++;
            return;
        }
        var skipMetrics = false;
        var schemaName = agg.schema ? agg.schema.name || agg.schema : null;
        if (typeof schemaName === 'object') {
            schemaName = null;
        }
        if (!schemaName) {
            if (agg.type.name === 'geo_centroid') {
                schemaName = 'geo_centroid';
            }
            else {
                cnt++;
                return;
            }
        }
        if (schemaName === 'split') {
            schemaName = "split_" + (agg.params.row ? 'row' : 'column');
            skipMetrics = responseAggs.length - metrics.length > 1;
        }
        if (!schemas[schemaName]) {
            schemas[schemaName] = [];
        }
        if (!isHierarchical || agg.type.type !== 'metrics') {
            schemas[schemaName].push(createSchemaConfig(cnt++, agg));
        }
        if (isHierarchical && (agg.type.type !== 'metrics' || metrics.length === responseAggs.length)) {
            metrics.forEach(function (metric) {
                var schemaConfig = createSchemaConfig(cnt++, metric);
                if (!skipMetrics) {
                    schemas.metric.push(schemaConfig);
                }
            });
        }
    });
    return schemas;
};
export var prepareJson = function (variable, data) {
    return variable + "='" + JSON.stringify(data)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'") + "' ";
};
export var prepareString = function (variable, data) {
    return variable + "='" + data.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "' ";
};
export var buildPipelineVisFunction = {
    vega: function (visState) {
        return "vega " + prepareString('spec', visState.params.spec);
    },
    input_control_vis: function (visState) {
        return "input_control_vis " + prepareJson('visConfig', visState.params);
    },
    metrics: function (visState) {
        return "tsvb " + prepareJson('params', visState.params);
    },
    timelion: function (visState) {
        var expression = prepareString('expression', visState.params.expression);
        var interval = prepareString('interval', visState.params.interval);
        return "timelion_vis " + expression + interval;
    },
    markdown: function (visState) {
        var expression = prepareString('expression', visState.params.markdown);
        var visConfig = prepareJson('visConfig', visState.params);
        return "kibana_markdown " + expression + visConfig;
    },
    table: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.table(schemas, visState.params));
        return "kibana_table " + prepareJson('visConfig', visConfig);
    },
    metric: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.metric(schemas));
        return "kibana_metric " + prepareJson('visConfig', visConfig);
    },
    tagcloud: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.tagcloud(schemas));
        return "tagcloud " + prepareJson('visConfig', visConfig);
    },
    region_map: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.region_map(schemas));
        return "regionmap " + prepareJson('visConfig', visConfig);
    },
    tile_map: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.tile_map(schemas));
        return "tilemap " + prepareJson('visConfig', visConfig);
    },
    pie: function (visState, schemas) {
        var visConfig = tslib_1.__assign({}, visState.params, buildVisConfig.pie(schemas));
        return "kibana_pie " + prepareJson('visConfig', visConfig);
    },
};
var buildVisConfig = {
    table: function (schemas, visParams) {
        if (visParams === void 0) { visParams = {}; }
        var visConfig = {};
        var metrics = schemas.metric;
        var buckets = schemas.bucket || [];
        visConfig.dimensions = {
            metrics: metrics,
            buckets: buckets,
            splitRow: schemas.split_row,
            splitColumn: schemas.split_column,
        };
        if (visParams.showMetricsAtAllLevels === false && visParams.showPartialRows === true) {
            // Handle case where user wants to see partial rows but not metrics at all levels.
            // This requires calculating how many metrics will come back in the tabified response,
            // and removing all metrics from the dimensions except the last set.
            var metricsPerBucket = metrics.length / buckets.length;
            visConfig.dimensions.metrics.splice(0, metricsPerBucket * buckets.length - metricsPerBucket);
        }
        return visConfig;
    },
    metric: function (schemas) {
        var visConfig = { dimensions: {} };
        visConfig.dimensions.metrics = schemas.metric;
        if (schemas.group) {
            visConfig.dimensions.bucket = schemas.group[0];
        }
        return visConfig;
    },
    tagcloud: function (schemas) {
        var visConfig = {};
        visConfig.metric = schemas.metric[0];
        if (schemas.segment) {
            visConfig.bucket = schemas.segment[0];
        }
        return visConfig;
    },
    region_map: function (schemas) {
        var visConfig = {};
        visConfig.metric = schemas.metric[0];
        if (schemas.segment) {
            visConfig.bucket = schemas.segment[0];
        }
        return visConfig;
    },
    tile_map: function (schemas) {
        var visConfig = {};
        visConfig.dimensions = {
            metric: schemas.metric[0],
            geohash: schemas.segment ? schemas.segment[0] : null,
            geocentroid: schemas.geo_centroid ? schemas.geo_centroid[0] : null,
        };
        return visConfig;
    },
    pie: function (schemas) {
        var visConfig = {};
        visConfig.dimensions = {
            metric: schemas.metric[0],
            buckets: schemas.segment,
            splitRow: schemas.split_row,
            splitColumn: schemas.split_column,
        };
        return visConfig;
    },
};
export var buildVislibDimensions = function (vis, params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var schemas, dimensions, xAgg, _a, esUnit, esValue, intervalParam, output;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                schemas = getSchemas(vis, params.timeRange);
                dimensions = {
                    x: schemas.segment ? schemas.segment[0] : null,
                    y: schemas.metric,
                    z: schemas.radius,
                    width: schemas.width,
                    series: schemas.group,
                    splitRow: schemas.split_row,
                    splitColumn: schemas.split_column,
                };
                if (!schemas.segment) return [3 /*break*/, 3];
                xAgg = vis.aggs.getResponseAggs()[dimensions.x.accessor];
                if (!(xAgg.type.name === 'date_histogram')) return [3 /*break*/, 1];
                dimensions.x.params.date = true;
                _a = xAgg.buckets.getInterval(), esUnit = _a.esUnit, esValue = _a.esValue;
                dimensions.x.params.interval = moment.duration(esValue, esUnit);
                dimensions.x.params.format = xAgg.buckets.getScaledDateFormat();
                dimensions.x.params.bounds = xAgg.buckets.getBounds();
                return [3 /*break*/, 3];
            case 1:
                if (!(xAgg.type.name === 'histogram')) return [3 /*break*/, 3];
                intervalParam = xAgg.type.params.byName.interval;
                output = { params: {} };
                return [4 /*yield*/, intervalParam.modifyAggConfigOnSearchRequestStart(xAgg, params.searchSource)];
            case 2:
                _b.sent();
                intervalParam.write(xAgg, output);
                dimensions.x.params.interval = output.params.interval;
                _b.label = 3;
            case 3: return [2 /*return*/, dimensions];
        }
    });
}); };
// If not using the expression pipeline (i.e. visualize_data_loader), we need a mechanism to
// take a Vis object and decorate it with the necessary params (dimensions, bucket, metric, etc)
export var getVisParams = function (vis, params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var schemas, visConfig, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                schemas = getSchemas(vis, params.timeRange);
                visConfig = cloneDeep(vis.params);
                if (!buildVisConfig[vis.type.name]) return [3 /*break*/, 1];
                visConfig = tslib_1.__assign({}, visConfig, buildVisConfig[vis.type.name](schemas, visConfig));
                return [3 /*break*/, 3];
            case 1:
                if (!vislibCharts.includes(vis.type.name)) return [3 /*break*/, 3];
                _a = visConfig;
                return [4 /*yield*/, buildVislibDimensions(vis, params)];
            case 2:
                _a.dimensions = _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, visConfig];
        }
    });
}); };
export var buildPipeline = function (vis, params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var searchSource, indexPattern, query, filters, visState, pipeline, schemas, visConfig, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                searchSource = params.searchSource;
                indexPattern = vis.indexPattern;
                query = searchSource.getField('query');
                filters = searchSource.getField('filter');
                visState = vis.getCurrentState();
                pipeline = "kibana | kibana_context ";
                if (query) {
                    pipeline += prepareJson('query', query);
                }
                if (filters) {
                    pipeline += prepareJson('filters', filters);
                }
                if (vis.savedSearchId) {
                    pipeline += prepareString('savedSearchId', vis.savedSearchId);
                }
                pipeline += '| ';
                // request handler
                if (vis.type.requestHandler === 'courier') {
                    pipeline += "esaggs\n    " + prepareString('index', indexPattern.id) + "\n    metricsAtAllLevels=" + vis.isHierarchical() + "\n    partialRows=" + (vis.type.requiresPartialRows || vis.params.showPartialRows || false) + "\n    " + prepareJson('aggConfigs', visState.aggs) + " | ";
                }
                schemas = getSchemas(vis, params.timeRange);
                if (!buildPipelineVisFunction[vis.type.name]) return [3 /*break*/, 1];
                pipeline += buildPipelineVisFunction[vis.type.name](visState, schemas);
                return [3 /*break*/, 4];
            case 1:
                if (!vislibCharts.includes(vis.type.name)) return [3 /*break*/, 3];
                visConfig = visState.params;
                _a = visConfig;
                return [4 /*yield*/, buildVislibDimensions(vis, params)];
            case 2:
                _a.dimensions = _b.sent();
                pipeline += "vislib " + prepareJson('visConfig', visState.params);
                return [3 /*break*/, 4];
            case 3:
                pipeline += "visualization type='" + vis.type.name + "'\n    " + prepareJson('visConfig', visState.params) + "\n    metricsAtAllLevels=" + vis.isHierarchical() + "\n    partialRows=" + (vis.type.requiresPartialRows || vis.params.showPartialRows || false) + " ";
                if (indexPattern) {
                    pipeline += "" + prepareString('index', indexPattern.id);
                }
                _b.label = 4;
            case 4: return [2 /*return*/, pipeline];
        }
    });
}); };
