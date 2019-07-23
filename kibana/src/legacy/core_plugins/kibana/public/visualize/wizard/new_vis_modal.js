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
import { EuiModal, EuiOverlayMask } from '@elastic/eui';
import { VisualizeConstants } from '../visualize_constants';
import { SearchSelection } from './search_selection';
import { TypeSelection } from './type_selection';
import chrome from 'ui/chrome';
var baseUrl = "#" + VisualizeConstants.CREATE_PATH + "?";
var NewVisModal = /** @class */ (function (_super) {
    tslib_1.__extends(NewVisModal, _super);
    function NewVisModal(props) {
        var _this = _super.call(this, props) || this;
        _this.onCloseModal = function () {
            _this.setState({ showSearchVisModal: false });
            _this.props.onClose();
        };
        _this.onVisTypeSelected = function (visType) {
            if (visType.requiresSearch && visType.options.showIndexSelection) {
                _this.setState({
                    showSearchVisModal: true,
                    visType: visType,
                });
            }
            else {
                var params = tslib_1.__spread(["type=" + encodeURIComponent(visType.name)], _this.props.editorParams);
                _this.props.onClose();
                location.assign("" + baseUrl + params.join('&'));
            }
        };
        _this.onSearchSelected = function (searchId, searchType) {
            _this.props.onClose();
            var params = tslib_1.__spread([
                "type=" + encodeURIComponent(_this.state.visType.name),
                (searchType === 'search' ? 'savedSearchId' : 'indexPattern') + "=" + searchId
            ], _this.props.editorParams);
            location.assign("" + baseUrl + params.join('&'));
        };
        _this.isLabsEnabled = chrome.getUiSettingsClient().get('visualize:enableLabs');
        _this.state = {
            showSearchVisModal: false,
        };
        return _this;
    }
    NewVisModal.prototype.render = function () {
        if (!this.props.isOpen) {
            return null;
        }
        var selectionModal = this.state.showSearchVisModal && this.state.visType ? (React.createElement(EuiModal, { onClose: this.onCloseModal, className: "visNewVisSearchDialog" },
            React.createElement(SearchSelection, { onSearchSelected: this.onSearchSelected, visType: this.state.visType }))) : (React.createElement(EuiModal, { onClose: this.onCloseModal, className: "visNewVisDialog" },
            React.createElement(TypeSelection, { showExperimental: this.isLabsEnabled, onVisTypeSelected: this.onVisTypeSelected, visTypesRegistry: this.props.visTypesRegistry })));
        return React.createElement(EuiOverlayMask, null, selectionModal);
    };
    NewVisModal.defaultProps = {
        editorParams: [],
    };
    return NewVisModal;
}(React.Component));
export { NewVisModal };
