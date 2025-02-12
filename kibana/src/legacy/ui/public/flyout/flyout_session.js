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
import * as tslib_1 from "tslib";
import React from 'react';
import { EuiFlyout } from '@elastic/eui';
import { EventEmitter } from 'events';
import ReactDOM from 'react-dom';
import { I18nContext } from 'ui/i18n';
var activeSession = null;
var CONTAINER_ID = 'flyout-container';
function getOrCreateContainerElement() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = CONTAINER_ID;
        document.body.appendChild(container);
    }
    return container;
}
/**
 * A FlyoutSession describes the session of one opened flyout panel. It offers
 * methods to close the flyout panel again. If you open a flyout panel you should make
 * sure you call {@link FlyoutSession#close} when it should be closed.
 * Since a flyout could also be closed without calling this method (e.g. because
 * the user closes it), you must listen to the "closed" event on this instance.
 * It will be emitted whenever the flyout will be closed and you should throw
 * away your reference to this instance whenever you receive that event.
 * @extends EventEmitter
 */
var FlyoutSession = /** @class */ (function (_super) {
    tslib_1.__extends(FlyoutSession, _super);
    function FlyoutSession() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Binds the current flyout session to an Angular scope, meaning this flyout
     * session will be closed as soon as the Angular scope gets destroyed.
     * @param {object} scope - An angular scope object to bind to.
     */
    FlyoutSession.prototype.bindToAngularScope = function (scope) {
        var _this = this;
        var removeWatch = scope.$on('$destroy', function () { return _this.close(); });
        this.on('closed', function () { return removeWatch(); });
    };
    /**
     * Closes the opened flyout as long as it's still the open one.
     * If this is not the active session anymore, this method won't do anything.
     * If this session was still active and a flyout was closed, the 'closed'
     * event will be emitted on this FlyoutSession instance.
     */
    FlyoutSession.prototype.close = function () {
        if (activeSession === this) {
            var container = document.getElementById(CONTAINER_ID);
            if (container) {
                ReactDOM.unmountComponentAtNode(container);
                this.emit('closed');
            }
        }
    };
    return FlyoutSession;
}(EventEmitter));
/**
 * Opens a flyout panel with the given component inside. You can use
 * {@link FlyoutSession#close} on the return value to close the flyout.
 *
 * @param flyoutChildren - Mounts the children inside a fly out panel
 * @return {FlyoutSession} The session instance for the opened flyout panel.
 */
export function openFlyout(flyoutChildren, flyoutProps) {
    if (flyoutProps === void 0) { flyoutProps = {}; }
    // If there is an active inspector session close it before opening a new one.
    if (activeSession) {
        activeSession.close();
    }
    var container = getOrCreateContainerElement();
    var session = (activeSession = new FlyoutSession());
    var onClose = function () {
        if (flyoutProps.onClose) {
            flyoutProps.onClose();
        }
        session.close();
    };
    ReactDOM.render(React.createElement(I18nContext, null,
        React.createElement(EuiFlyout, tslib_1.__assign({}, flyoutProps, { onClose: onClose }), flyoutChildren)), container);
    return session;
}
export { FlyoutSession };
