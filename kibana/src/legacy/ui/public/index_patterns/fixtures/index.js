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
export var mockFields = [
    {
        name: 'machine.os',
        type: 'string',
        aggregatable: false,
        searchable: false,
        filterable: true,
    },
    {
        name: 'machine.os.raw',
        type: 'string',
        aggregatable: true,
        searchable: true,
        filterable: true,
    },
    {
        name: 'not.filterable',
        type: 'string',
        aggregatable: true,
        searchable: false,
        filterable: false,
    },
    {
        name: 'bytes',
        type: 'number',
        aggregatable: true,
        searchable: true,
        filterable: true,
    },
    {
        name: '@timestamp',
        type: 'date',
        aggregatable: true,
        searchable: true,
        filterable: true,
    },
    {
        name: 'clientip',
        type: 'ip',
        aggregatable: true,
        searchable: true,
        filterable: true,
    },
    {
        name: 'bool.field',
        type: 'boolean',
        aggregatable: true,
        searchable: true,
        filterable: true,
    },
];
export var mockIndexPattern = {
    id: 'logstash-*',
    fields: mockFields,
    title: 'logstash-*',
    timeFieldName: '@timestamp',
};
