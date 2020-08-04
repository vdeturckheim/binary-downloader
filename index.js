'use strict';
const Path = require('path');
const Https = require('https');
const Http = require('http');
const Fs = require('fs');
const Os = require('os');
const Libc = require('detect-libc');
const Tar = require('tar');
const APIVerions = require('./lib/nodeABI');
const Url = require('url');

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
        str = str.replace(/{libc}/, Libc.family || 'unknown')
    }
    if (str.includes('{arch}')) {
        str = str.replace(/{arch}/, Os.arch)
    }
    if (str.includes('{node_napi_label}')) {
        str = str.replace(/{node_napi_label}/, napiLabel(targetNapi));
    }

    return str;
};

const buildPath = module.exports.buildPath = function (remotePath, packageName, targetNapi) {

    return remotePath.split('/').concat(packageName.split('/'))
        .map((str) => resolve(str, targetNapi))
        .filter((x) => x && x !== '.' && x !== '..')
        .join('/');
};

module.exports.download = function (binaryPart) {

    const httpsProxyURL = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.npm_config_proxy;
    const httpProxyURL = process.env.HTTP_PROXY || process.env.http_proxy;
    const clientLib = httpsProxyURL ? Https : Http;
    const defaultPort = httpsProxyURL ? 443 : 80;

    const options = {};
    if (httpsProxyURL) {
        const HttpsProxyAgent = require('https-proxy-agent');
        options.agent = new HttpsProxyAgent(httpsProxyURL);
    }
    if (httpProxyURL) {
        const HttpProxyAgent = require('http-proxy-agent');
        options.agent = new HttpProxyAgent(httpProxyURL);
    }

    const path = buildPath(binaryPart.remote_path, binaryPart.package_name, binaryPart.napi_versions);
    const url = binaryPart.host + path;

    const parsedUrl = Url.parse(url);

    options.host = parsedUrl.host;
    options.path = parsedUrl.path;
    options.port = parsedUrl.port || defaultPort;

    console.log('GET', url);
    clientLib.get(options, (res) => {

        if (res.statusCode !== 200) {
            console.error('Wrong status code when GET', url, res.statusCode);
            process.exit(1);
        }

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

    return './' + modulePath.split('/').concat(moduleName.split('/'))
        .filter((x) => x && x !== '.' && x !== '..')
        .map((str) => resolve(str, targetNapi))
        .join('/');
};

