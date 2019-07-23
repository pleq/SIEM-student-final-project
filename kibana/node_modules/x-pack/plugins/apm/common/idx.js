"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function idx(input, accessor) {
    try {
        return accessor(input);
    }
    catch (error) {
        return undefined;
    }
}
exports.idx = idx;
