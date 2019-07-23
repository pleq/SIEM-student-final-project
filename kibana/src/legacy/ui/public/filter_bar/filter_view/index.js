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
import { EuiBadge } from '@elastic/eui';
import { isFilterPinned } from '@kbn/es-query';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { existsOperator, isOneOfOperator } from 'ui/filter_bar/filter_editor/lib/filter_operators';
export var FilterView = function (_a) {
    var filter = _a.filter, rest = tslib_1.__rest(_a, ["filter"]);
    var title = "Filter: " + getFilterDisplayText(filter) + ". " + i18n.translate('common.ui.filterBar.moreFilterActionsMessage', {
        defaultMessage: 'Select for more filter actions.',
    });
    if (isFilterPinned(filter)) {
        title = i18n.translate('common.ui.filterBar.pinnedFilterPrefix', {
            defaultMessage: 'Pinned',
        }) + " " + title;
    }
    if (filter.meta.disabled) {
        title = i18n.translate('common.ui.filterBar.disabledFilterPrefix', {
            defaultMessage: 'Disabled',
        }) + " " + title;
    }
    return (React.createElement(EuiBadge, tslib_1.__assign({ title: title, iconType: "cross", 
        // @ts-ignore
        iconSide: "right", closeButtonProps: {
            // Removing tab focus on close button because the same option can be optained through the context menu
            // Also, we may want to add a `DEL` keyboard press functionality
            tabIndex: '-1',
        }, iconOnClickAriaLabel: i18n.translate('common.ui.filterBar.filterItemBadgeIconAriaLabel', {
            defaultMessage: 'Delete',
        }), onClickAriaLabel: i18n.translate('common.ui.filterBar.filterItemBadgeAriaLabel', {
            defaultMessage: 'Filter actions',
        }) }, rest),
        React.createElement("span", null, getFilterDisplayText(filter))));
};
export function getFilterDisplayText(filter) {
    var prefix = filter.meta.negate
        ? " " + i18n.translate('common.ui.filterBar.negatedFilterPrefix', {
            defaultMessage: 'NOT ',
        })
        : '';
    if (filter.meta.alias !== null) {
        return "" + prefix + filter.meta.alias;
    }
    switch (filter.meta.type) {
        case 'exists':
            return "" + prefix + filter.meta.key + " " + existsOperator.message;
        case 'geo_bounding_box':
            return "" + prefix + filter.meta.key + ": " + filter.meta.value;
        case 'geo_polygon':
            return "" + prefix + filter.meta.key + ": " + filter.meta.value;
        case 'phrase':
            return "" + prefix + filter.meta.key + ": " + filter.meta.value;
        case 'phrases':
            return "" + prefix + filter.meta.key + " " + isOneOfOperator.message + " " + filter.meta.value;
        case 'query_string':
            return "" + prefix + filter.meta.value;
        case 'range':
            return "" + prefix + filter.meta.key + ": " + filter.meta.value;
        default:
            return "" + prefix + JSON.stringify(filter.query);
    }
}
