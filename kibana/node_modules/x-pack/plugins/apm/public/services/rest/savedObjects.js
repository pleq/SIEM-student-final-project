"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const callApi_1 = require("./callApi");
exports.getAPMIndexPattern = lodash_1.memoize(async () => {
    const apmIndexPatternTitle = chrome_1.default.getInjected('apmIndexPatternTitle');
    const res = await callApi_1.callApi({
        pathname: `/api/saved_objects/_find`,
        query: {
            type: 'index-pattern',
            search: `"${apmIndexPatternTitle}"`,
            search_fields: 'title',
            per_page: 200
        }
    });
    return res.saved_objects.find(savedObject => savedObject.attributes.title === apmIndexPatternTitle);
});
