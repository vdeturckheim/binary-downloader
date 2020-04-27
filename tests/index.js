'use strict';
const Os = require('os');
const Test = require('tape');
const Libc = require('detect-libc');
const Mod = require('../index');
const NABI = require('../lib/nodeABI');

Test('buildPath', (t) => {

    t.plan(1);
    const binPart = {
        remote_path: "./nodejs/libsqreen/b20191003.5/{platform}/{libc}/{arch}/",
        package_name: "{node_napi_label}.tar.gz",
        napi_versions: [3, 5]
    };
    if (NABI.getNAPIsForVersion(process.version).has(5)) {
        t.equal(Mod.buildPath(binPart.remote_path, binPart.package_name, binPart.napi_versions),
            `nodejs/libsqreen/b20191003.5/${Os.platform()}/${Libc.family || 'unknown'}/${Os.arch()}/napi-v5.tar.gz`);
    }
    else if (NABI.getNAPIsForVersion(process.version).has(3)) {
        t.equal(Mod.buildPath(binPart.remote_path, binPart.package_name, binPart.napi_versions),
            `nodejs/libsqreen/b20191003.5/${Os.platform()}/${Libc.family || 'unknown'}/${Os.arch()}/napi-v3.tar.gz`);
    }
    else {
        const abi = NABI.getABIForVersion(process.version);
        t.equal(Mod.buildPath(binPart.remote_path, binPart.package_name, binPart.napi_versions),
            `nodejs/libsqreen/b20191003.5/${Os.platform()}/${Libc.family || 'unknown'}/${Os.arch()}/node-v${abi}.tar.gz`);
    }
    t.end();
});

Test('getPath', (t) => {

    t.plan(1);
    const binPart = {
        "module_name": "libsqreen",
        "module_path": "./bindings/{node_napi_label}",
        "package_name": "{node_napi_label}.tar.gz",
        "napi_versions": [3, 5]
    };
    if (NABI.getNAPIsForVersion(process.version).has(5)) {
        t.equal(Mod.getPath(binPart), './bindings/napi-v5/libsqreen');
    }
    else if (NABI.getNAPIsForVersion(process.version).has(3)) {
        t.equal(Mod.getPath(binPart), './bindings/napi-v3/libsqreen');
    }
    else {
        const abi = NABI.getABIForVersion(process.version);
        t.equal(Mod.getPath(binPart), `./bindings/node-v${abi}/libsqreen`);
    }
    t.end();
});
