'use strict';
const Path = require('path');
const Https = require('https');
const Fs = require('fs');
const Os = require('os');
const Libc = require('detect-libc');
const Tar = require('tar');
const APIVerions = require('./lib/nodeABI');

/**
 *
 * @param {number[]} targets
 */
const napiLabel = function (targets) {

    targets = targets.sort((a, b) => b - a);
    const version = process.version;
    const abi = APIVerions.getABIForVersion(version);
    const napiSet = APIVerions.getNAPIsForVersion(version);
    for (let i = 0; i < targets.length; ++i) {
        const curr = targets[i];
        if (napiSet.has(curr)) {
            return `napi-v${curr}`;
        }
    }
    return `node-v${abi}`;
};


/**
 *
 * @param {string} str
 * @param {number[]} targetNapi
 * @return {string}
 */
const resolve = function (str, targetNapi) {

    if (str.includes('{platform}')) {
        str = str.replace(/{platform}/, Os.platform());
    }
    if (str.includes('{libc}')) {
        str = str.replace(/{libc}/, Libc.version || 'unknown')
    }
    if (str.includes('{arch}')) {
        str = str.replace(/{arch}/, Os.arch)
    }
    if (str.includes('{node_napi_label}')) {
        str = str.replace(/{node_napi_label}/, napiLabel(targetNapi));
    }

    return str;
};

const buildPath = function (remotePath, packageName, targetNapi) {

    return Path.join(remotePath, packageName)
        .split('/')
        .map((str) => resolve(str, targetNapi))
        .join('/');
}

module.exports.download = function (binaryPart) {

    const path = buildPath(binaryPart.remote_path, binaryPart.package_name, binaryPart.napi_versions);
    const url = Path.join(binaryPart.host, path);
    Https.get(url, (res) => {

        res.on('error', (e) => {
            console.error(e);
            process.exit(1);
        });
        try {
            Fs.mkdirSync(Path.join(process.cwd(), 'bindings'));
        }
        catch (_) {} // do nothing if directory exists

        res.pipe(Tar.x({ C: Path.join(process.cwd(), 'bindings') }));
    });
};

module.exports.getPath = function (binaryPart) {

    const modulePath = binaryPart.module_path;
    const moduleName = binaryPart.module_name;
    const targetNapi = binaryPart.napi_versions;

    return './' + Path.join(modulePath, moduleName)
        .split('/')
        .map((str) => resolve(str, targetNapi))
        .join('/');
};

