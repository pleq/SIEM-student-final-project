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
import { EuiButtonEmpty, EuiForm, EuiFormRow, EuiLink, EuiPopover, EuiPopoverTitle, EuiSpacer, EuiSwitch, EuiText, } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import React, { Component } from 'react';
import { documentationLinks } from '../../documentation_links/documentation_links';
var kueryQuerySyntaxDocs = documentationLinks.query.kueryQuerySyntax;
var QueryLanguageSwitcher = /** @class */ (function (_super) {
    tslib_1.__extends(QueryLanguageSwitcher, _super);
    function QueryLanguageSwitcher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPopoverOpen: false,
        };
        _this.togglePopover = function () {
            _this.setState({
                isPopoverOpen: !_this.state.isPopoverOpen,
            });
        };
        _this.closePopover = function () {
            _this.setState({
                isPopoverOpen: false,
            });
        };
        _this.onSwitchChange = function () {
            var newLanguage = _this.props.language === 'lucene' ? 'kuery' : 'lucene';
            _this.props.onSelectLanguage(newLanguage);
        };
        return _this;
    }
    QueryLanguageSwitcher.prototype.render = function () {
        var luceneLabel = (React.createElement(FormattedMessage, { id: "common.ui.queryBar.luceneLanguageName", defaultMessage: "Lucene" }));
        var kqlLabel = (React.createElement(FormattedMessage, { id: "common.ui.queryBar.kqlLanguageName", defaultMessage: "KQL" }));
        var kqlFullName = (React.createElement(FormattedMessage, { id: "common.ui.queryBar.kqlFullLanguageName", defaultMessage: "Kibana Query Language" }));
        var button = (React.createElement(EuiButtonEmpty, { size: "xs", onClick: this.togglePopover }, this.props.language === 'lucene' ? luceneLabel : kqlLabel));
        return (React.createElement(EuiPopover, { id: "popover", className: "eui-displayBlock", ownFocus: true, anchorPosition: "downRight", button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, withTitle: true },
            React.createElement(EuiPopoverTitle, null,
                React.createElement(FormattedMessage, { id: "common.ui.queryBar.syntaxOptionsTitle", defaultMessage: "Syntax options" })),
            React.createElement("div", { style: { width: '350px' } },
                React.createElement(EuiText, null,
                    React.createElement("p", null,
                        React.createElement(FormattedMessage, { id: "common.ui.queryBar.syntaxOptionsDescription", defaultMessage: "The {docsLink} (KQL) offers a simplified query\n                syntax and support for scripted fields. KQL also provides autocomplete if you have\n                a Basic license or above. If you turn off KQL, Kibana uses Lucene.", values: {
                                docsLink: (React.createElement(EuiLink, { href: kueryQuerySyntaxDocs, target: "_blank" }, kqlFullName)),
                            } }))),
                React.createElement(EuiSpacer, { size: "m" }),
                React.createElement(EuiForm, null,
                    React.createElement(EuiFormRow, { label: kqlFullName },
                        React.createElement(EuiSwitch, { id: "queryEnhancementOptIn", name: "popswitch", label: this.props.language === 'kuery' ? (React.createElement(FormattedMessage, { id: "common.ui.queryBar.kqlOnLabel", defaultMessage: "On" })) : (React.createElement(FormattedMessage, { id: "common.ui.queryBar.kqlOffLabel", defaultMessage: "Off" })), checked: this.props.language === 'kuery', onChange: this.onSwitchChange, "data-test-subj": "languageToggle" }))))));
    };
    return QueryLanguageSwitcher;
}(Component));
export { QueryLanguageSwitcher };
