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
var newPlatformChrome;
export function __newPlatformInit__(instance) {
    if (newPlatformChrome) {
        throw new Error('ui/chrome/api/help_extension is already initialized');
    }
    newPlatformChrome = instance;
}
function createHelpExtensionApi() {
    /**
     * reset helpExtensionSetSinceRouteChange any time the helpExtension changes, even
     * if it was done directly through the new platform
     */
    var helpExtensionSetSinceRouteChange = false;
    newPlatformChrome.getHelpExtension$().subscribe({
        next: function () {
            helpExtensionSetSinceRouteChange = true;
        },
    });
    return {
        helpExtension: {
            /**
             * Set the custom help extension, or clear it by passing undefined. This
             * will be rendered within the help popover in the header
             */
            set: function (helpExtension) {
                newPlatformChrome.setHelpExtension(helpExtension);
            },
            /**
             * Get the current help extension that should be rendered in the header
             */
            get$: function () { return newPlatformChrome.getHelpExtension$(); },
        },
        /**
         * internal angular run function that will be called when angular bootstraps and
         * lets us integrate with the angular router so that we can automatically clear
         * the helpExtension if we switch to a Kibana app that does not set its own
         * helpExtension
         */
        $setupHelpExtensionAutoClear: function ($rootScope, $injector) {
            var $route = $injector.has('$route') ? $injector.get('$route') : {};
            $rootScope.$on('$routeChangeStart', function () {
                helpExtensionSetSinceRouteChange = false;
            });
            $rootScope.$on('$routeChangeSuccess', function () {
                var current = $route.current || {};
                if (helpExtensionSetSinceRouteChange || (current.$$route && current.$$route.redirectTo)) {
                    return;
                }
                newPlatformChrome.setHelpExtension(current.helpExtension);
            });
        },
    };
}
export function initHelpExtensionApi(chrome, internal) {
    var _a = createHelpExtensionApi(), helpExtension = _a.helpExtension, $setupHelpExtensionAutoClear = _a.$setupHelpExtensionAutoClear;
    chrome.helpExtension = helpExtension;
    internal.$setupHelpExtensionAutoClear = $setupHelpExtensionAutoClear;
}
