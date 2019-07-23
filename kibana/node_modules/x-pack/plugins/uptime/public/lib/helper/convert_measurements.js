"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const NUM_MICROSECONDS_IN_MILLISECOND = 1000;
/**
 * This simply converts microseconds to milliseconds. People tend to prefer ms to us
 * when visualizaing request duration times.
 */
exports.convertMicrosecondsToMilliseconds = (microseconds) => microseconds ? Math.round(microseconds / NUM_MICROSECONDS_IN_MILLISECOND) : microseconds;
