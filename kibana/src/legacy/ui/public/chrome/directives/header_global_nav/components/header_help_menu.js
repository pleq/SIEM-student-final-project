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
import { FormattedMessage } from '@kbn/i18n/react';
import React, { Component, Fragment } from 'react';
import { documentationLinks } from '../../../../documentation_links';
import { metadata } from '../../../../metadata';
import { 
// TODO: add type annotations
// @ts-ignore
EuiButton, 
// @ts-ignore
EuiFlexGroup, 
// @ts-ignore
EuiFlexItem, 
// @ts-ignore
EuiHeaderSectionItemButton, EuiIcon, EuiPopover, EuiPopoverTitle, EuiSpacer, EuiText, } from '@elastic/eui';
import { injectI18n } from '@kbn/i18n/react';
import { HeaderExtension } from './header_extension';
var HeaderHelpMenuUI = /** @class */ (function (_super) {
    tslib_1.__extends(HeaderHelpMenuUI, _super);
    function HeaderHelpMenuUI(props) {
        var _this = _super.call(this, props) || this;
        _this.onMenuButtonClick = function () {
            _this.setState({
                isOpen: !_this.state.isOpen,
            });
        };
        _this.closeMenu = function () {
            _this.setState({
                isOpen: false,
            });
        };
        _this.state = {
            isOpen: false,
            helpExtension: undefined,
        };
        return _this;
    }
    HeaderHelpMenuUI.prototype.componentDidMount = function () {
        var _this = this;
        this.subscription = this.props.helpExtension$.subscribe({
            next: function (helpExtension) {
                _this.setState({
                    helpExtension: helpExtension,
                });
            },
        });
    };
    HeaderHelpMenuUI.prototype.componentWillUnmount = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    };
    HeaderHelpMenuUI.prototype.render = function () {
        var _a = this.props, intl = _a.intl, useDefaultContent = _a.useDefaultContent, documentationLink = _a.documentationLink;
        var helpExtension = this.state.helpExtension;
        var defaultContent = useDefaultContent ? (React.createElement(Fragment, null,
            React.createElement(EuiText, { size: "s" },
                React.createElement("p", null,
                    React.createElement(FormattedMessage, { id: "common.ui.chrome.headerGlobalNav.helpMenuHelpDescription", defaultMessage: "Get updates, information, and answers in our documentation." }))),
            React.createElement(EuiSpacer, null),
            React.createElement(EuiButton, { iconType: "popout", href: documentationLink, target: "_blank" },
                React.createElement(FormattedMessage, { id: "common.ui.chrome.headerGlobalNav.helpMenuGoToDocumentation", defaultMessage: "Go to documentation" })))) : null;
        var button = (React.createElement(EuiHeaderSectionItemButton, { "aria-expanded": this.state.isOpen, "aria-haspopup": "true", "aria-label": intl.formatMessage({
                id: 'common.ui.chrome.headerGlobalNav.helpMenuButtonAriaLabel',
                defaultMessage: 'Help menu',
            }), onClick: this.onMenuButtonClick },
            React.createElement(EuiIcon, { type: "help", size: "m" })));
        return (React.createElement(EuiPopover, { id: "headerHelpMenu", button: button, isOpen: this.state.isOpen, anchorPosition: "downRight", 
            // @ts-ignore
            repositionOnScroll: true, closePopover: this.closeMenu, "data-test-subj": "helpMenuButton" },
            React.createElement(EuiPopoverTitle, null,
                React.createElement(EuiFlexGroup, { responsive: false },
                    React.createElement(EuiFlexItem, null,
                        React.createElement(FormattedMessage, { id: "common.ui.chrome.headerGlobalNav.helpMenuTitle", defaultMessage: "Help" })),
                    React.createElement(EuiFlexItem, { grow: false, className: "chrHeaderHelpMenu__version" },
                        React.createElement(FormattedMessage, { id: "common.ui.chrome.headerGlobalNav.helpMenuVersion", defaultMessage: "v {version}", values: { version: metadata.version } })))),
            React.createElement("div", { style: { maxWidth: 240 } },
                defaultContent,
                defaultContent && helpExtension && React.createElement(EuiSpacer, null),
                helpExtension && React.createElement(HeaderExtension, { extension: helpExtension }))));
    };
    return HeaderHelpMenuUI;
}(Component));
export var HeaderHelpMenu = injectI18n(HeaderHelpMenuUI);
HeaderHelpMenu.defaultProps = {
    documentationLink: documentationLinks.kibana,
    useDefaultContent: true,
};
