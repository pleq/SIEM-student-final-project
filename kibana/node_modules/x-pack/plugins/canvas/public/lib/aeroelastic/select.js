"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = (fun) => (...fns) => {
    let prevId = NaN;
    let cache = null;
    const old = (object) => prevId === (prevId = object.primaryUpdate.payload.uid);
    return (obj) => (old(obj) ? cache : (cache = fun(...fns.map(f => f(obj)))));
};
