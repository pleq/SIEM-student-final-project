"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
exports.LOCATION_UPDATE = 'LOCATION_UPDATE';
function location(state = { pathname: '', search: '', hash: '' }, action) {
    switch (action.type) {
        case exports.LOCATION_UPDATE:
            return action.location;
        default:
            return state;
    }
}
function updateLocation(nextLocation) {
    return {
        type: exports.LOCATION_UPDATE,
        location: nextLocation
    };
}
exports.updateLocation = updateLocation;
// tslint:disable-next-line no-default-export
exports.default = location;
