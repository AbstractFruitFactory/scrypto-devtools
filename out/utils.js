"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressType = void 0;
const getAddressType = (address) => {
    const parts = address.split('_');
    return parts.length > 1 ? parts[0] : 'transaction';
};
exports.getAddressType = getAddressType;
//# sourceMappingURL=utils.js.map