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
import Ipv4Address from './ipv4_address';
var NUM_BITS = 32;
function throwError(mask) {
    throw Error('Invalid CIDR mask: ' + mask);
}
var CidrMask = /** @class */ (function () {
    function CidrMask(mask) {
        var splits = mask.split('/');
        if (splits.length !== 2) {
            throwError(mask);
        }
        this.initialAddress = new Ipv4Address(splits[0]);
        this.prefixLength = Number(splits[1]);
        if (this.prefixLength < 1 || this.prefixLength > NUM_BITS) {
            throwError(mask);
        }
    }
    CidrMask.prototype.getRange = function () {
        var variableBits = NUM_BITS - this.prefixLength;
        // tslint:disable-next-line:no-bitwise
        var fromAddress = ((this.initialAddress.valueOf() >> variableBits) << variableBits) >>> 0; // >>> 0 coerces to unsigned
        var numAddresses = Math.pow(2, variableBits);
        return {
            from: new Ipv4Address(fromAddress).toString(),
            to: new Ipv4Address(fromAddress + numAddresses - 1).toString(),
        };
    };
    CidrMask.prototype.toString = function () {
        return this.initialAddress.toString() + '/' + this.prefixLength;
    };
    return CidrMask;
}());
export { CidrMask };
