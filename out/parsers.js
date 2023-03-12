"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShowLedger = exports.parseShowAccount = exports.parseNewAccount = void 0;
const ramda_1 = require("ramda");
const parseNewAccount = (output) => ({
    address: (0, ramda_1.pipe)(() => output.substring(output.search('Account component address: ')).split(' ')[3], addressLine => addressLine.substring(addressLine.search('account'), addressLine.search('\n')))(),
    publicKey: output.substring(output.search('Public key: ')).split(' ')[2],
    privateKey: output.substring(output.search('Private key: ')).split(' ')[2]
});
exports.parseNewAccount = parseNewAccount;
const parseShowAccount = (output) => ({
    blueprint: {
        packageAddress: output.substring(output.search('package_address: '), output.search('blueprint_name')).split('package_address:')[1].replace(',', '').replace(' ', '').replace(' ', ''),
        name: output.substring(output.search('blueprint_name: '), output.search('Access Rules')).split('blueprint_name: ')[1].replace(' ', '').split('\"')[1]
    }
});
exports.parseShowAccount = parseShowAccount;
const parseShowLedger = (output) => ({
    packages: output.substring(output.search('Packages'), output.search('Components'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),
    components: output.substring(output.search('Components'), output.search('Resource Managers'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),
    resourceManagers: output.substring(output.search('Resource Managers'), output.search('Current Epoch'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),
    currentEpoch: output.substring(output.search('Current Epoch'), output.search('Current Time'))
        .split('Current Epoch: ')[1]
        .split('\n')[0],
    currentTime: output.substring(output.search('Current Time'))
        .split('Current Time: ')[1]
        .split('\n')[0]
});
exports.parseShowLedger = parseShowLedger;
//# sourceMappingURL=parsers.js.map