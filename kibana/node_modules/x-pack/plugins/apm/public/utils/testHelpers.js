"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* global jest */
const enzyme_1 = require("enzyme");
const enzyme_to_json_1 = tslib_1.__importDefault(require("enzyme-to-json"));
const createHashHistory_1 = tslib_1.__importDefault(require("history/createHashHistory"));
require("jest-styled-components");
const moment_1 = tslib_1.__importDefault(require("moment"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
// @ts-ignore
const redux_test_utils_1 = require("redux-test-utils");
// @ts-ignore
const configureStore_1 = tslib_1.__importDefault(require("../store/config/configureStore"));
function toJson(wrapper) {
    return enzyme_to_json_1.default(wrapper, {
        noKey: true,
        mode: 'deep'
    });
}
exports.toJson = toJson;
const defaultRoute = {
    match: { path: '/', url: '/', params: {}, isExact: true },
    location: { pathname: '/', search: '', hash: '', key: '4yyjf5' }
};
function mountWithRouterAndStore(Component, storeState = {}, route = defaultRoute) {
    const store = redux_test_utils_1.createMockStore(storeState);
    const history = createHashHistory_1.default();
    const options = {
        context: {
            store,
            router: {
                history,
                route
            }
        },
        childContextTypes: {
            store: prop_types_1.default.object.isRequired,
            router: prop_types_1.default.object.isRequired
        }
    };
    return enzyme_1.mount(Component, options);
}
exports.mountWithRouterAndStore = mountWithRouterAndStore;
function mountWithStore(Component, storeState = {}) {
    const store = redux_test_utils_1.createMockStore(storeState);
    const options = {
        context: {
            store
        },
        childContextTypes: {
            store: prop_types_1.default.object.isRequired
        }
    };
    return enzyme_1.mount(Component, options);
}
exports.mountWithStore = mountWithStore;
function mockMoment() {
    // avoid timezone issues
    jest
        .spyOn(moment_1.default.prototype, 'format')
        .mockImplementation(function () {
        return `1st of January (mocking ${this.unix()})`;
    });
    // convert relative time to absolute time to avoid timing issues
    jest
        .spyOn(moment_1.default.prototype, 'fromNow')
        .mockImplementation(function () {
        return `1337 minutes ago (mocking ${this.unix()})`;
    });
}
exports.mockMoment = mockMoment;
// Await this when you need to "flush" promises to immediately resolve or throw in tests
async function asyncFlush() {
    return new Promise(resolve => setTimeout(resolve, 0));
}
exports.asyncFlush = asyncFlush;
// Useful for getting the rendered href from any kind of link component
async function getRenderedHref(Component, globalState = {}) {
    const store = configureStore_1.default(globalState);
    const mounted = enzyme_1.mount(react_1.default.createElement(react_redux_1.Provider, { store: store },
        react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(Component, null))));
    await asyncFlush();
    return mounted.render().attr('href');
}
exports.getRenderedHref = getRenderedHref;
function mockNow(date) {
    const fakeNow = new Date(date).getTime();
    const realDateNow = global.Date.now.bind(global.Date);
    global.Date.now = jest.fn(() => fakeNow);
    return () => {
        global.Date.now = realDateNow;
    };
}
exports.mockNow = mockNow;
