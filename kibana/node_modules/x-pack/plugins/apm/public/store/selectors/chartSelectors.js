"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const i18n_1 = require("@kbn/i18n");
const d3_1 = tslib_1.__importDefault(require("d3"));
const lodash_1 = require("lodash");
const lodash_mean_1 = tslib_1.__importDefault(require("lodash.mean"));
const polished_1 = require("polished");
const formatters_1 = require("../../utils/formatters");
exports.getEmptySerie = lodash_1.memoize((start = Date.now() - 3600000, end = Date.now()) => {
    const dates = d3_1.default.time
        .scale()
        .domain([new Date(start), new Date(end)])
        .ticks();
    return [
        {
            data: dates.map(x => ({
                x: x.getTime(),
                y: 1
            }))
        }
    ];
}, (start, end) => [start, end].join('_'));
function getTransactionCharts(urlParams, timeseriesResponse) {
    const { start, end, transactionType } = urlParams;
    const { apmTimeseries, anomalyTimeseries } = timeseriesResponse;
    const noHits = apmTimeseries.totalHits === 0;
    const tpmSeries = noHits
        ? exports.getEmptySerie(start, end)
        : getTpmSeries(apmTimeseries, transactionType);
    const responseTimeSeries = noHits
        ? exports.getEmptySerie(start, end)
        : getResponseTimeSeries(apmTimeseries, anomalyTimeseries);
    const chartsResult = {
        noHits,
        tpmSeries,
        responseTimeSeries
    };
    return chartsResult;
}
exports.getTransactionCharts = getTransactionCharts;
function getMemorySeries(urlParams, memoryChartResponse) {
    const { start, end } = urlParams;
    const { series, overallValues, totalHits } = memoryChartResponse;
    const seriesList = totalHits === 0
        ? exports.getEmptySerie(start, end)
        : [
            {
                title: i18n_1.i18n.translate('xpack.apm.chart.memorySeries.systemMaxLabel', {
                    defaultMessage: 'System max'
                }),
                data: series.memoryUsedMax,
                type: 'linemark',
                color: eui_theme_light_json_1.default.euiColorVis1,
                legendValue: formatters_1.asPercent(overallValues.memoryUsedMax || 0, 1)
            },
            {
                title: i18n_1.i18n.translate('xpack.apm.chart.memorySeries.systemAverageLabel', {
                    defaultMessage: 'System average'
                }),
                data: series.memoryUsedAvg,
                type: 'linemark',
                color: eui_theme_light_json_1.default.euiColorVis0,
                legendValue: formatters_1.asPercent(overallValues.memoryUsedAvg || 0, 1)
            }
        ];
    return {
        ...memoryChartResponse,
        series: seriesList
    };
}
exports.getMemorySeries = getMemorySeries;
function getCPUSeries(CPUChartResponse) {
    const { series, overallValues } = CPUChartResponse;
    const seriesList = [
        {
            title: i18n_1.i18n.translate('xpack.apm.chart.cpuSeries.systemMaxLabel', {
                defaultMessage: 'System max'
            }),
            data: series.systemCPUMax,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis1,
            legendValue: formatters_1.asPercent(overallValues.systemCPUMax || 0, 1)
        },
        {
            title: i18n_1.i18n.translate('xpack.apm.chart.cpuSeries.systemAverageLabel', {
                defaultMessage: 'System average'
            }),
            data: series.systemCPUAverage,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis0,
            legendValue: formatters_1.asPercent(overallValues.systemCPUAverage || 0, 1)
        },
        {
            title: i18n_1.i18n.translate('xpack.apm.chart.cpuSeries.processMaxLabel', {
                defaultMessage: 'Process max'
            }),
            data: series.processCPUMax,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis7,
            legendValue: formatters_1.asPercent(overallValues.processCPUMax || 0, 1)
        },
        {
            title: i18n_1.i18n.translate('xpack.apm.chart.cpuSeries.processAverageLabel', {
                defaultMessage: 'Process average'
            }),
            data: series.processCPUAverage,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis5,
            legendValue: formatters_1.asPercent(overallValues.processCPUAverage || 0, 1)
        }
    ];
    return { ...CPUChartResponse, series: seriesList };
}
exports.getCPUSeries = getCPUSeries;
function getResponseTimeSeries(apmTimeseries, anomalyTimeseries) {
    const { overallAvgDuration } = apmTimeseries;
    const { avg, p95, p99 } = apmTimeseries.responseTimes;
    const series = [
        {
            title: i18n_1.i18n.translate('xpack.apm.transactions.chart.averageLabel', {
                defaultMessage: 'Avg.'
            }),
            data: avg,
            legendValue: formatters_1.asMillis(overallAvgDuration),
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis1
        },
        {
            title: i18n_1.i18n.translate('xpack.apm.transactions.chart.95thPercentileLabel', {
                defaultMessage: '95th percentile'
            }),
            titleShort: '95th',
            data: p95,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis5
        },
        {
            title: i18n_1.i18n.translate('xpack.apm.transactions.chart.99thPercentileLabel', {
                defaultMessage: '99th percentile'
            }),
            titleShort: '99th',
            data: p99,
            type: 'linemark',
            color: eui_theme_light_json_1.default.euiColorVis7
        }
    ];
    if (anomalyTimeseries) {
        // insert after Avg. series
        series.splice(1, 0, getAnomalyBoundariesSeries(anomalyTimeseries.anomalyBoundaries), getAnomalyScoreSeries(anomalyTimeseries.anomalyScore));
    }
    return series;
}
exports.getResponseTimeSeries = getResponseTimeSeries;
function getAnomalyScoreSeries(data) {
    return {
        title: i18n_1.i18n.translate('xpack.apm.transactions.chart.anomalyScoreLabel', {
            defaultMessage: 'Anomaly score'
        }),
        hideLegend: true,
        hideTooltipValue: true,
        data,
        type: 'areaMaxHeight',
        color: 'none',
        areaColor: polished_1.rgba(eui_theme_light_json_1.default.euiColorVis9, 0.1)
    };
}
exports.getAnomalyScoreSeries = getAnomalyScoreSeries;
function getAnomalyBoundariesSeries(data) {
    return {
        title: i18n_1.i18n.translate('xpack.apm.transactions.chart.anomalyBoundariesLabel', {
            defaultMessage: 'Anomaly Boundaries'
        }),
        hideLegend: true,
        hideTooltipValue: true,
        data,
        type: 'area',
        color: 'none',
        areaColor: polished_1.rgba(eui_theme_light_json_1.default.euiColorVis1, 0.1)
    };
}
function getTpmSeries(apmTimeseries, transactionType) {
    const { tpmBuckets } = apmTimeseries;
    const bucketKeys = tpmBuckets.map(({ key }) => key);
    const getColor = getColorByKey(bucketKeys);
    return tpmBuckets.map(bucket => {
        const avg = lodash_mean_1.default(bucket.dataPoints.map(p => p.y));
        return {
            title: bucket.key,
            data: bucket.dataPoints,
            legendValue: `${formatters_1.asDecimal(avg)} ${formatters_1.tpmUnit(transactionType || '')}`,
            type: 'linemark',
            color: getColor(bucket.key)
        };
    });
}
exports.getTpmSeries = getTpmSeries;
function getColorByKey(keys) {
    const assignedColors = {
        'HTTP 2xx': eui_theme_light_json_1.default.euiColorVis0,
        'HTTP 3xx': eui_theme_light_json_1.default.euiColorVis5,
        'HTTP 4xx': eui_theme_light_json_1.default.euiColorVis7,
        'HTTP 5xx': eui_theme_light_json_1.default.euiColorVis2
    };
    const unknownKeys = lodash_1.difference(keys, Object.keys(assignedColors));
    const unassignedColors = lodash_1.zipObject(unknownKeys, [
        eui_theme_light_json_1.default.euiColorVis1,
        eui_theme_light_json_1.default.euiColorVis3,
        eui_theme_light_json_1.default.euiColorVis4,
        eui_theme_light_json_1.default.euiColorVis6,
        eui_theme_light_json_1.default.euiColorVis2,
        eui_theme_light_json_1.default.euiColorVis8
    ]);
    return (key) => assignedColors[key] || unassignedColors[key];
}
