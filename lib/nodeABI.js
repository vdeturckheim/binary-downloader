'use strict';
const Semver = require('semver');

const ABI_SUPPORT = {
    '4.x': 46,
    '5.x': 47,
    '6.x': 48,
    '7.x': 51,
    '8.x': 57,
    '9.x': 59,
    '10.x': 64,
    '11.x': 67,
    '12.x': 72,
    '13.x': 79,
    '14.x': 83
}

const NAPI_SUPPORT = {
    '>=8.11.2 <9.0.0': [3],
    '>=8.16.0 <9.0.0': [4],
    '>=10.0.0': [1, 2, 3],
    '>=10.16.0 <11.0.0': [4],
    '>=10.17.0 <11.0.0': [5],
    '>=11.8.0 <12.0.0': [4],
    '>=12.0.0': [4],
    '>=12.11.0': [5]
};

/**
 *
 * @param {string} nodeVersion as semver
 * @return {Set<number>} supported napi-versions
 */
const getNAPIsForVersion = function (rawNodeVersion) {

    const nodeVersion = Semver.coerce(rawNodeVersion).version;
    const result = new Set();
    Object.keys(NAPI_SUPPORT)
        .forEach((key) => {

            const val = NAPI_SUPPORT[key];
            if (Semver.satisfies(nodeVersion, key)) {
                val.forEach((x) => result.add(x));
            }
        });
    return result;
};

/**
 *
 * @param {string} nodeVersion as semver
 * @return {number} supported abi version
 */
const getABIForVersion = function (rawNodeVersion) {

    const nodeVersion = Semver.coerce(rawNodeVersion).version;
    const keyList = Object.keys(ABI_SUPPORT);
    for (let i = 0; i < keyList.length; ++i) {
        const key = keyList[i];
        if (Semver.satisfies(nodeVersion, key)) {
            return ABI_SUPPORT[key];
        }
    }
    return -1;
};

module.exports = {
    getABIForVersion,
    getNAPIsForVersion
};
