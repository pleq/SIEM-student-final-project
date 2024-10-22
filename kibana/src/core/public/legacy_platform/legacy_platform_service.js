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
import angular from 'angular';
/**
 * The LegacyPlatformService is responsible for initializing
 * the legacy platform by injecting parts of the new platform
 * services into the legacy platform modules, like ui/modules,
 * and then bootstrapping the ui/chrome or ui/test_harness to
 * start either the app or browser tests.
 */
var LegacyPlatformService = /** @class */ (function () {
    function LegacyPlatformService(params) {
        this.params = params;
    }
    LegacyPlatformService.prototype.start = function (_a) {
        var i18n = _a.i18n, injectedMetadata = _a.injectedMetadata, fatalErrors = _a.fatalErrors, notifications = _a.notifications, loadingCount = _a.loadingCount, basePath = _a.basePath, uiSettings = _a.uiSettings, chrome = _a.chrome;
        // Inject parts of the new platform into parts of the legacy platform
        // so that legacy APIs/modules can mimic their new platform counterparts
        require('ui/metadata').__newPlatformInit__(injectedMetadata.getLegacyMetadata());
        require('ui/i18n').__newPlatformInit__(i18n.Context);
        require('ui/notify/fatal_error').__newPlatformInit__(fatalErrors);
        require('ui/notify/toasts').__newPlatformInit__(notifications.toasts);
        require('ui/chrome/api/loading_count').__newPlatformInit__(loadingCount);
        require('ui/chrome/api/base_path').__newPlatformInit__(basePath);
        require('ui/chrome/api/ui_settings').__newPlatformInit__(uiSettings);
        require('ui/chrome/api/injected_vars').__newPlatformInit__(injectedMetadata);
        require('ui/chrome/api/controls').__newPlatformInit__(chrome);
        require('ui/chrome/api/help_extension').__newPlatformInit__(chrome);
        require('ui/chrome/api/theme').__newPlatformInit__(chrome);
        require('ui/chrome/api/breadcrumbs').__newPlatformInit__(chrome);
        require('ui/chrome/services/global_nav_state').__newPlatformInit__(chrome);
        // Load the bootstrap module before loading the legacy platform files so that
        // the bootstrap module can modify the environment a bit first
        var bootstrapModule = this.loadBootstrapModule();
        // require the files that will tie into the legacy platform
        this.params.requireLegacyFiles();
        bootstrapModule.bootstrap(this.params.targetDomElement);
    };
    LegacyPlatformService.prototype.stop = function () {
        var angularRoot = angular.element(this.params.targetDomElement);
        var injector$ = angularRoot.injector();
        // if we haven't gotten to the point of bootstraping
        // angular, injector$ won't be defined
        if (!injector$) {
            return;
        }
        // destroy the root angular scope
        injector$.get('$rootScope').$destroy();
        // clear the inner html of the root angular element
        this.params.targetDomElement.textContent = '';
    };
    LegacyPlatformService.prototype.loadBootstrapModule = function () {
        if (this.params.useLegacyTestHarness) {
            // wrapped in NODE_ENV check so the `ui/test_harness` module
            // is not included in the distributable
            if (process.env.IS_KIBANA_DISTRIBUTABLE !== 'true') {
                return require('ui/test_harness');
            }
            throw new Error('tests bundle is not available in the distributable');
        }
        return require('ui/chrome');
    };
    return LegacyPlatformService;
}());
export { LegacyPlatformService };
