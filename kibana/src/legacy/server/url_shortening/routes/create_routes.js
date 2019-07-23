'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoutes = createRoutes;

var _short_url_lookup = require('./lib/short_url_lookup');

var _goto = require('./goto');

var _shorten_url = require('./shorten_url');

function createRoutes(server) {
  const shortUrlLookup = (0, _short_url_lookup.shortUrlLookupProvider)(server);

  server.route((0, _goto.createGotoRoute)({ server, shortUrlLookup }));
  server.route((0, _shorten_url.createShortenUrlRoute)({ shortUrlLookup }));
} /*
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