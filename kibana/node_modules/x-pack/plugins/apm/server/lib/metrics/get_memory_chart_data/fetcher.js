"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_fieldnames_1 = require("x-pack/plugins/apm/common/elasticsearch_fieldnames");
const get_bucket_size_1 = require("../../helpers/get_bucket_size");
async function fetch({ serviceName, setup }) {
    const { start, end, esFilterQuery, client, config } = setup;
    const { bucketSize } = get_bucket_size_1.getBucketSize(start, end, 'auto');
    const filters = [
        { term: { [elasticsearch_fieldnames_1.SERVICE_NAME]: serviceName } },
        { term: { [elasticsearch_fieldnames_1.PROCESSOR_NAME]: 'metric' } },
        {
            range: { '@timestamp': { gte: start, lte: end, format: 'epoch_millis' } }
        },
        { exists: { field: elasticsearch_fieldnames_1.METRIC_SYSTEM_TOTAL_MEMORY } },
        { exists: { field: elasticsearch_fieldnames_1.METRIC_SYSTEM_FREE_MEMORY } }
    ];
    if (esFilterQuery) {
        filters.push(esFilterQuery);
    }
    const script = {
        lang: 'expression',
        source: `1 - doc['${elasticsearch_fieldnames_1.METRIC_SYSTEM_FREE_MEMORY}'] / doc['${elasticsearch_fieldnames_1.METRIC_SYSTEM_TOTAL_MEMORY}']`
    };
    const params = {
        index: config.get('apm_oss.metricsIndices'),
        body: {
            size: 0,
            query: { bool: { filter: filters } },
            aggs: {
                timeseriesData: {
                    date_histogram: {
                        field: '@timestamp',
                        // ensure minimum bucket size of 30s since this is the default resolution for metric data
                        interval: `${Math.max(bucketSize, 30)}s`,
                        min_doc_count: 0,
                        extended_bounds: { min: start, max: end }
                    },
                    aggs: {
                        memoryUsedAvg: { avg: { script } },
                        memoryUsedMax: { max: { script } }
                    }
                },
                memoryUsedAvg: { avg: { script } },
                memoryUsedMax: { max: { script } }
            }
        }
    };
    return client('search', params);
}
exports.fetch = fetch;
