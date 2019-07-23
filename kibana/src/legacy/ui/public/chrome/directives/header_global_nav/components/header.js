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
import Url from 'url';
import React, { Component, createRef, Fragment } from 'react';
import * as Rx from 'rxjs';
import { 
// TODO: add type annotations
// @ts-ignore
EuiHeader, 
// @ts-ignore
EuiHeaderLogo, 
// @ts-ignore
EuiHeaderSection, 
// @ts-ignore
EuiHeaderSectionItem, 
// @ts-ignore
EuiHeaderSectionItemButton, EuiHorizontalRule, EuiIcon, 
// @ts-ignore
EuiImage, 
// @ts-ignore
EuiNavDrawer, 
// @ts-ignore
EuiNavDrawerGroup, 
// @ts-ignore
EuiShowFor, } from '@elastic/eui';
import { HeaderBreadcrumbs } from './header_breadcrumbs';
import { HeaderHelpMenu } from './header_help_menu';
import { HeaderNavControls } from './header_nav_controls';
import { injectI18n } from '@kbn/i18n/react';
import chrome from 'ui/chrome';
import { relativeToAbsolute } from 'ui/url/relative_to_absolute';
import { NavControlSide } from '../';
// Providing a buffer between the limit and the cut off index
// protects from truncating just the last couple (6) characters
var TRUNCATE_LIMIT = 64;
var TRUNCATE_AT = 58;
function extendRecentlyAccessedHistoryItem(navLinks, recentlyAccessed) {
    var href = relativeToAbsolute(chrome.addBasePath(recentlyAccessed.link));
    var navLink = navLinks.find(function (nl) { return href.startsWith(nl.subUrlBase); });
    return tslib_1.__assign({}, recentlyAccessed, { href: href, euiIconType: navLink ? navLink.euiIconType : undefined });
}
function extendNavLink(navLink) {
    return tslib_1.__assign({}, navLink, { href: navLink.lastSubUrl && !navLink.active ? navLink.lastSubUrl : navLink.url });
}
function findClosestAnchor(element) {
    var current = element;
    while (current) {
        if (current.tagName === 'A') {
            return current;
        }
        if (!current.parentElement || current.parentElement === document.body) {
            return undefined;
        }
        current = current.parentElement;
    }
}
function truncateRecentItemLabel(label) {
    if (label.length > TRUNCATE_LIMIT) {
        label = label.substring(0, TRUNCATE_AT) + "\u2026";
    }
    return label;
}
var HeaderUI = /** @class */ (function (_super) {
    tslib_1.__extends(HeaderUI, _super);
    function HeaderUI(props) {
        var _this = _super.call(this, props) || this;
        _this.navDrawerRef = createRef();
        _this.onNavClick = function (event) {
            var anchor = findClosestAnchor(event.nativeEvent.target);
            if (!anchor) {
                return;
            }
            var navLink = _this.state.navLinks.find(function (item) { return item.href === anchor.href; });
            if (navLink && navLink.disabled) {
                event.preventDefault();
                return;
            }
            if (!_this.state.forceNavigation ||
                event.isDefaultPrevented() ||
                event.altKey ||
                event.metaKey ||
                event.ctrlKey) {
                return;
            }
            var toParsed = Url.parse(anchor.href);
            var fromParsed = Url.parse(document.location.href);
            var sameProto = toParsed.protocol === fromParsed.protocol;
            var sameHost = toParsed.host === fromParsed.host;
            var samePath = toParsed.path === fromParsed.path;
            if (sameProto && sameHost && samePath) {
                if (toParsed.hash) {
                    document.location.reload();
                }
                // event.preventDefault() keeps the browser from seeing the new url as an update
                // and even setting window.location does not mimic that behavior, so instead
                // we use stopPropagation() to prevent angular from seeing the click and
                // starting a digest cycle/attempting to handle it in the router.
                event.stopPropagation();
            }
        };
        _this.state = {
            navLinks: [],
            recentlyAccessed: [],
            forceNavigation: false,
        };
        return _this;
    }
    HeaderUI.prototype.componentDidMount = function () {
        var _this = this;
        this.subscription = Rx.combineLatest(this.props.navLinks$, this.props.recentlyAccessed$, this.props.forceAppSwitcherNavigation$).subscribe({
            next: function (_a) {
                var _b = tslib_1.__read(_a, 3), navLinks = _b[0], recentlyAccessed = _b[1], forceNavigation = _b[2];
                _this.setState({
                    forceNavigation: forceNavigation,
                    navLinks: navLinks.map(function (navLink) { return extendNavLink(navLink); }),
                    recentlyAccessed: recentlyAccessed.map(function (ra) {
                        return extendRecentlyAccessedHistoryItem(navLinks, ra);
                    }),
                });
            },
        });
    };
    HeaderUI.prototype.componentWillUnmount = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    HeaderUI.prototype.renderLogo = function () {
        var _a = this.props, homeHref = _a.homeHref, intl = _a.intl;
        return (React.createElement(EuiHeaderLogo, { "data-test-subj": "logo", iconType: "logoKibana", onClick: this.onNavClick, href: homeHref, "aria-label": intl.formatMessage({
                id: 'common.ui.chrome.headerGlobalNav.goHomePageIconAriaLabel',
                defaultMessage: 'Go to home page',
            }) }));
    };
    HeaderUI.prototype.renderMenuTrigger = function () {
        var _this = this;
        return (React.createElement(EuiHeaderSectionItemButton, { "aria-label": "Toggle side navigation", onClick: function () { return _this.navDrawerRef.current.toggleOpen(); } },
            React.createElement(EuiIcon, { type: "apps", size: "m" })));
    };
    HeaderUI.prototype.render = function () {
        var _a = this.props, appTitle = _a.appTitle, breadcrumbs$ = _a.breadcrumbs$, isVisible = _a.isVisible, navControls = _a.navControls, helpExtension$ = _a.helpExtension$, intl = _a.intl;
        var _b = this.state, navLinks = _b.navLinks, recentlyAccessed = _b.recentlyAccessed;
        if (!isVisible) {
            return null;
        }
        var leftNavControls = navControls.bySide[NavControlSide.Left];
        var rightNavControls = navControls.bySide[NavControlSide.Right];
        var navLinksArray = navLinks.map(function (navLink) {
            return navLink.hidden
                ? null
                : {
                    key: navLink.id,
                    label: navLink.title,
                    href: navLink.href,
                    iconType: navLink.euiIconType,
                    icon: !navLink.euiIconType && navLink.icon ? (React.createElement(EuiImage, { size: "s", alt: "", "aria-hidden": true, url: chrome.addBasePath("/" + navLink.icon) })) : (undefined),
                    isActive: navLink.active,
                    'data-test-subj': 'navDrawerAppsMenuLink',
                };
        });
        // filter out the null items
        navLinksArray = navLinksArray.filter(function (item) { return item !== null; });
        var recentLinksArray = [
            {
                label: intl.formatMessage({
                    id: 'common.ui.chrome.sideGlobalNav.viewRecentItemsLabel',
                    defaultMessage: 'Recently viewed',
                }),
                iconType: 'clock',
                isDisabled: recentlyAccessed.length > 0 ? false : true,
                flyoutMenu: {
                    title: intl.formatMessage({
                        id: 'common.ui.chrome.sideGlobalNav.viewRecentItemsFlyoutTitle',
                        defaultMessage: 'Recent items',
                    }),
                    listItems: recentlyAccessed.map(function (item) { return ({
                        label: truncateRecentItemLabel(item.label),
                        // TODO: Add what type of app/saved object to title attr
                        title: "" + item.label,
                        'aria-label': item.label,
                        href: item.href,
                        iconType: item.euiIconType,
                    }); }),
                },
            },
        ];
        return (React.createElement(Fragment, null,
            React.createElement(EuiHeader, null,
                React.createElement(EuiHeaderSection, { grow: false },
                    React.createElement(EuiShowFor, { sizes: ['xs', 's'] },
                        React.createElement(EuiHeaderSectionItem, { border: "right" }, this.renderMenuTrigger())),
                    React.createElement(EuiHeaderSectionItem, { border: "right" }, this.renderLogo()),
                    React.createElement(HeaderNavControls, { navControls: leftNavControls })),
                React.createElement(HeaderBreadcrumbs, { appTitle: appTitle, "breadcrumbs$": breadcrumbs$ }),
                React.createElement(EuiHeaderSection, { side: "right" },
                    React.createElement(EuiHeaderSectionItem, null,
                        React.createElement(HeaderHelpMenu, { "helpExtension$": helpExtension$ })),
                    React.createElement(HeaderNavControls, { navControls: rightNavControls }))),
            React.createElement(EuiNavDrawer, { ref: this.navDrawerRef, "data-test-subj": "navDrawer" },
                React.createElement(EuiNavDrawerGroup, { listItems: recentLinksArray }),
                React.createElement(EuiHorizontalRule, { margin: "none" }),
                React.createElement(EuiNavDrawerGroup, { "data-test-subj": "navDrawerAppsMenu", listItems: navLinksArray }))));
    };
    return HeaderUI;
}(Component));
export var Header = injectI18n(HeaderUI);
