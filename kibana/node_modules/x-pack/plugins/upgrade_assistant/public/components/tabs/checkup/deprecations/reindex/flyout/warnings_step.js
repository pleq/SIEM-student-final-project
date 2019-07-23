"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const types_1 = require("../../../../../../../common/types");
exports.idForWarning = (warning) => `reindexWarning-${warning}`;
const WarningCheckbox = ({ checkedIds, warning, label, onChange, description, documentationUrl }) => (react_1.default.createElement(react_1.Fragment, null,
    react_1.default.createElement(eui_1.EuiText, null,
        react_1.default.createElement(eui_1.EuiCheckbox, { id: exports.idForWarning(warning), label: react_1.default.createElement("strong", null, label), checked: checkedIds[exports.idForWarning(warning)], onChange: onChange }),
        react_1.default.createElement("p", { className: "upgWarningsStep__warningDescription" },
            description,
            react_1.default.createElement("br", null),
            react_1.default.createElement(eui_1.EuiLink, { href: documentationUrl, target: "_blank" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.documentationLinkLabel", defaultMessage: "Documentation" })))),
    react_1.default.createElement(eui_1.EuiSpacer, null)));
/**
 * Displays warning text about destructive changes required to reindex this index. The user
 * must acknowledge each change before being allowed to proceed.
 */
class WarningsFlyoutStep extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onChange = (e) => {
            const optionId = e.target.id;
            const nextCheckedIds = {
                ...this.state.checkedIds,
                ...{
                    [optionId]: !this.state.checkedIds[optionId],
                },
            };
            this.setState({ checkedIds: nextCheckedIds });
        };
        this.state = {
            checkedIds: props.warnings.reduce((checkedIds, warning) => {
                checkedIds[exports.idForWarning(warning)] = false;
                return checkedIds;
            }, {}),
        };
    }
    render() {
        const { warnings, closeFlyout, advanceNextStep } = this.props;
        const { checkedIds } = this.state;
        // Do not allow to proceed until all checkboxes are checked.
        const blockAdvance = Object.values(checkedIds).filter(v => v).length < warnings.length;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.destructiveCallout.calloutTitle", defaultMessage: "This index requires destructive changes that can't be undone" }), color: "danger", iconType: "alert" },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.destructiveCallout.calloutDetail", defaultMessage: "Back up your index, then proceed with the reindex by accepting each breaking change." }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                warnings.includes(types_1.ReindexWarning.customTypeName) && (react_1.default.createElement(WarningCheckbox, { checkedIds: checkedIds, onChange: this.onChange, warning: types_1.ReindexWarning.customTypeName, label: react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.customTypeNameWarningTitle", defaultMessage: "Mapping type will be changed to {defaultType}", values: {
                            defaultType: react_1.default.createElement(eui_1.EuiCode, null, "_doc"),
                        } }), description: react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.customTypeNameWarningDetail", defaultMessage: "Mapping types are no longer supported in 8.x. This index mapping does not use the\n                    default type name, {defaultType}, and will be updated when reindexed. Ensure no application code\n                    or scripts rely on a different type.", values: {
                            defaultType: react_1.default.createElement(eui_1.EuiCode, null, "_doc"),
                        } }), documentationUrl: "https://www.elastic.co/guide/en/elasticsearch/reference/7.0/removal-of-types.html" })),
                warnings.includes(types_1.ReindexWarning.apmReindex) && (react_1.default.createElement(WarningCheckbox, { checkedIds: checkedIds, onChange: this.onChange, warning: types_1.ReindexWarning.apmReindex, label: react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.apmReindexWarningTitle", defaultMessage: "This index will be converted to ECS format" }), description: react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.warningsStep.apmReindexWarningDetail", defaultMessage: "Starting in version 7.0.0, APM data will be represented in the Elastic Common Schema.\n                      Historical APM data will not visible until it's reindexed." }), documentationUrl: "https://www.elastic.co/guide/en/apm/get-started/master/apm-release-notes.html" }))),
            react_1.default.createElement(eui_1.EuiFlyoutFooter, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "cross", onClick: closeFlyout, flush: "left" },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.checklistStep.cancelButtonLabel", defaultMessage: "Cancel" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButton, { fill: true, color: "danger", onClick: advanceNextStep, disabled: blockAdvance },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "xpack.upgradeAssistant.checkupTab.reindexing.flyout.checklistStep.continueButtonLabel", defaultMessage: "Continue with reindex" })))))));
    }
}
exports.WarningsFlyoutStep = WarningsFlyoutStep;
