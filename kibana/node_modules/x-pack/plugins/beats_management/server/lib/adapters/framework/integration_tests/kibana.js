"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
// file.skip
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
// @ts-ignore
const kbnTestServer = tslib_1.__importStar(require("../../../../../../../../src/test_utils/kbn_server"));
// @ts-ignore
const kbn_server_config_1 = require("../../../../../../../test_utils/kbn_server_config");
const plugin_1 = require("../../../../../common/constants/plugin");
const plugin_2 = require("./../../../../../common/constants/plugin");
const kibana_framework_adapter_1 = require("./../kibana_framework_adapter");
const test_contract_1 = require("./test_contract");
let servers;
test_contract_1.contractTests('Kibana  Framework Adapter', {
    async before() {
        servers = await kbnTestServer.startTestServers({
            adjustTimeout: (t) => jest.setTimeout(t),
            settings: kbn_server_config_1.TestKbnServerConfig,
        });
    },
    async after() {
        await servers.stop();
    },
    adapterSetup: () => {
        return new kibana_framework_adapter_1.KibanaBackendFrameworkAdapter(lodash_1.camelCase(plugin_2.PLUGIN.ID), servers.kbnServer.server, plugin_1.CONFIG_PREFIX);
    },
});
