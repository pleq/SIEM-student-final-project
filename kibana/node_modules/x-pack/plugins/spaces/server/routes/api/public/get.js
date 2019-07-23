"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const errors_1 = require("../../../lib/errors");
function initGetSpacesApi(server, routePreCheckLicenseFn) {
    server.route({
        method: 'GET',
        path: '/api/spaces/space',
        async handler(request) {
            server.log(['spaces', 'debug'], `Inside GET /api/spaces/space`);
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            let spaces;
            try {
                server.log(['spaces', 'debug'], `Attempting to retrieve all spaces`);
                spaces = await spacesClient.getAll();
                server.log(['spaces', 'debug'], `Retrieved ${spaces.length} spaces`);
            }
            catch (error) {
                server.log(['spaces', 'debug'], `Error retrieving spaces: ${error}`);
                return errors_1.wrapError(error);
            }
            return spaces;
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
    server.route({
        method: 'GET',
        path: '/api/spaces/space/{id}',
        async handler(request) {
            const spaceId = request.params.id;
            const { SavedObjectsClient } = server.savedObjects;
            const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
            try {
                return await spacesClient.get(spaceId);
            }
            catch (error) {
                if (SavedObjectsClient.errors.isNotFoundError(error)) {
                    return boom_1.default.notFound();
                }
                return errors_1.wrapError(error);
            }
        },
        config: {
            pre: [routePreCheckLicenseFn],
        },
    });
}
exports.initGetSpacesApi = initGetSpacesApi;
