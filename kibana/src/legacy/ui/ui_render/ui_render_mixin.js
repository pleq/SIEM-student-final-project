'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiRenderMixin = uiRenderMixin;

var _crypto = require('crypto');

var _bluebird = require('bluebird');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _path = require('path');

var _lodash = require('lodash');

var _i18n = require('@kbn/i18n');

var _bootstrap = require('./bootstrap');

var _lib = require('./lib');

var _utils = require('../../utils');

var _csp = require('../../server/csp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function uiRenderMixin(kbnServer, server, config) {
  function replaceInjectedVars(request, injectedVars) {
    const { injectedVarsReplacers = [] } = kbnServer.uiExports;

    return (0, _bluebird.reduce)(injectedVarsReplacers, async (acc, replacer) => await replacer(acc, request, kbnServer.server), injectedVars);
  }

  let defaultInjectedVars = {};
  kbnServer.afterPluginsInit(() => {
    const { defaultInjectedVarProviders = [] } = kbnServer.uiExports;
    defaultInjectedVars = defaultInjectedVarProviders.reduce((allDefaults, { fn, pluginSpec }) => (0, _lib.mergeVariables)(allDefaults, fn(kbnServer.server, pluginSpec.readConfigValue(kbnServer.config, []))), {});
  });

  // render all views from ./views
  server.setupViews((0, _path.resolve)(__dirname, 'views'));

  server.exposeStaticDir('/node_modules/@elastic/eui/dist/{path*}', (0, _utils.fromRoot)('node_modules/@elastic/eui/dist'));
  server.exposeStaticDir('/node_modules/@kbn/ui-framework/dist/{path*}', (0, _utils.fromRoot)('node_modules/@kbn/ui-framework/dist'));

  const translationsCache = { translations: null, hash: null };
  server.route({
    path: '/translations/{locale}.json',
    method: 'GET',
    config: { auth: false },
    handler(request, h) {
      // Kibana server loads translations only for a single locale
      // that is specified in `i18n.locale` config value.
      const { locale } = request.params;
      if (_i18n.i18n.getLocale() !== locale.toLowerCase()) {
        throw _boom2.default.notFound(`Unknown locale: ${locale}`);
      }

      // Stringifying thousands of labels and calculating hash on the resulting
      // string can be expensive so it makes sense to do it once and cache.
      if (translationsCache.translations == null) {
        translationsCache.translations = JSON.stringify(_i18n.i18n.getTranslation());
        translationsCache.hash = (0, _crypto.createHash)('sha1').update(translationsCache.translations).digest('hex');
      }

      return h.response(translationsCache.translations).header('cache-control', 'must-revalidate').header('content-type', 'application/json').etag(translationsCache.hash);
    }
  });

  // register the bootstrap.js route after plugins are initialized so that we can
  // detect if any default auth strategies were registered
  kbnServer.afterPluginsInit(() => {
    const authEnabled = !!server.auth.settings.default;

    server.route({
      path: '/bundles/app/{id}/bootstrap.js',
      method: 'GET',
      config: {
        tags: ['api'],
        auth: authEnabled ? { mode: 'try' } : false
      },
      async handler(request, h) {
        const { id } = request.params;
        const app = server.getUiAppById(id) || server.getHiddenUiAppById(id);
        if (!app) {
          throw _boom2.default.notFound(`Unknown app: ${id}`);
        }

        const uiSettings = request.getUiSettingsService();
        const darkMode = !authEnabled || request.auth.isAuthenticated ? await uiSettings.get('theme:darkMode') : false;

        const basePath = config.get('server.basePath');
        const regularBundlePath = `${basePath}/bundles`;
        const dllBundlePath = `${basePath}/built_assets/dlls`;
        const styleSheetPaths = [`${dllBundlePath}/vendors.style.dll.css`, ...(darkMode ? [`${basePath}/node_modules/@elastic/eui/dist/eui_theme_dark.css`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_dark.css`] : [`${basePath}/node_modules/@elastic/eui/dist/eui_theme_light.css`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`]), `${regularBundlePath}/${darkMode ? 'dark' : 'light'}_theme.style.css`, `${regularBundlePath}/commons.style.css`, `${regularBundlePath}/${app.getId()}.style.css`, ...kbnServer.uiExports.styleSheetPaths.filter(path => path.theme === '*' || path.theme === (darkMode ? 'dark' : 'light')).map(path => path.localPath.endsWith('.scss') ? `${basePath}/built_assets/css/${path.publicPath}` : `${basePath}/${path.publicPath}`).reverse()];

        const bootstrap = new _bootstrap.AppBootstrap({
          templateData: {
            appId: app.getId(),
            regularBundlePath,
            dllBundlePath,
            styleSheetPaths
          }
        });

        const body = await bootstrap.getJsFile();
        const etag = await bootstrap.getJsFileHash();

        return h.response(body).header('cache-control', 'must-revalidate').header('content-type', 'application/javascript').etag(etag);
      }
    });
  });

  server.route({
    path: '/app/{id}',
    method: 'GET',
    async handler(req, h) {
      const id = req.params.id;
      const app = server.getUiAppById(id);
      if (!app) throw _boom2.default.notFound('Unknown app ' + id);

      try {
        if (kbnServer.status.isGreen()) {
          return await h.renderApp(app);
        } else {
          return await h.renderStatusPage();
        }
      } catch (err) {
        throw _boom2.default.boomify(err);
      }
    }
  });

  async function getLegacyKibanaPayload({ app, translations, request, includeUserProvidedConfig }) {
    const uiSettings = request.getUiSettingsService();

    return {
      app,
      translations,
      bundleId: `app:${app.getId()}`,
      nav: server.getUiNavLinks(),
      version: kbnServer.version,
      branch: config.get('pkg.branch'),
      buildNum: config.get('pkg.buildNum'),
      buildSha: config.get('pkg.buildSha'),
      basePath: request.getBasePath(),
      serverName: config.get('server.name'),
      devMode: config.get('env.dev'),
      uiSettings: await (0, _bluebird.props)({
        defaults: uiSettings.getDefaults(),
        user: includeUserProvidedConfig && uiSettings.getUserProvided()
      })
    };
  }

  async function renderApp({ app, h, includeUserProvidedConfig = true, injectedVarsOverrides = {} }) {
    const request = h.request;
    const basePath = request.getBasePath();

    const legacyMetadata = await getLegacyKibanaPayload({
      app,
      request,
      includeUserProvidedConfig,
      injectedVarsOverrides
    });

    const nonce = await (0, _csp.generateCSPNonce)();

    const response = h.view('ui_app', {
      nonce,
      strictCsp: config.get('csp.strict'),
      uiPublicUrl: `${basePath}/ui`,
      bootstrapScriptUrl: `${basePath}/bundles/app/${app.getId()}/bootstrap.js`,
      i18n: (id, options) => _i18n.i18n.translate(id, options),
      locale: _i18n.i18n.getLocale(),
      darkMode: (0, _lodash.get)(legacyMetadata.uiSettings.user, ['theme:darkMode', 'userValue'], false),

      injectedMetadata: {
        version: kbnServer.version,
        buildNumber: config.get('pkg.buildNum'),
        basePath,
        i18n: {
          translationsUrl: `${basePath}/translations/${_i18n.i18n.getLocale()}.json`
        },
        csp: {
          warnLegacyBrowsers: config.get('csp.warnLegacyBrowsers')
        },
        vars: await replaceInjectedVars(request, (0, _lib.mergeVariables)(injectedVarsOverrides, (await server.getInjectedUiAppVars(app.getId())), defaultInjectedVars)),

        legacyMetadata
      }
    });

    const csp = (0, _csp.createCSPRuleString)(config.get('csp.rules'), nonce);
    response.header('content-security-policy', csp);

    return response;
  }

  server.decorate('toolkit', 'renderApp', function (app, injectedVarsOverrides) {
    return renderApp({
      app,
      h: this,
      includeUserProvidedConfig: true,
      injectedVarsOverrides
    });
  });

  server.decorate('toolkit', 'renderAppWithDefaultConfig', function (app) {
    return renderApp({
      app,
      h: this,
      includeUserProvidedConfig: false
    });
  });
}