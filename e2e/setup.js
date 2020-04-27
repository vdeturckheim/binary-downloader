'use strict';
const Path = require('path');
const Fs = require('fs');
const CP = require('child_process');

const BASE_NOT_FOUND = Path.join(__dirname, 'notfound');
const MOD1_NOT_FOUND = Path.join(BASE_NOT_FOUND, 'mod1');

const BASE_SUB_INSTALL = Path.join(__dirname, 'subinstall');
const MOD1_SUB_INSTALL = Path.join(BASE_SUB_INSTALL, 'mod1');

// Find tarball for main module
const tarballName = Fs.readdirSync(Path.join(__dirname, '..'))
    .find((x) => x.endsWith('.tgz'));
const tarballPath = Path.join(__dirname, '..', tarballName);
const copyFileSync = function (p, dest) {
    return Fs.writeFileSync(dest, Fs.readFileSync(p));
};
copyFileSync(tarballPath, Path.join(__dirname, tarballName)); // because of relative paths in npm

const logSpawnSync = function () {
    console.error('RUN', Array.from(arguments));
    const res = CP.spawnSync.apply(null, arguments);

    if (res.stdout === null) {
        console.log('----RES----');
        console.log(res);
        console.log('-----------');
    }
    else {
        console.log(res.stdout.toString());
        console.error(res.stderr.toString());
    }
    return res;
}

// install binary-downloader in both mod1s
logSpawnSync('npm', ['install', '--save', tarballPath], { cwd: MOD1_NOT_FOUND, shell: true });
logSpawnSync('npm', ['install', '--save', tarballPath], { cwd: MOD1_SUB_INSTALL, shell: true });

// npm pack mod1s
logSpawnSync('npm', ['pack'], { cwd: MOD1_NOT_FOUND, shell: true });
logSpawnSync('npm', ['pack'], { cwd: MOD1_SUB_INSTALL, shell: true });

// install mod1s in test projects
logSpawnSync('npm', ['install', Path.join(MOD1_NOT_FOUND, 'mod1-1.0.0.tgz')], { cwd: BASE_NOT_FOUND, shell: true });
logSpawnSync('npm', ['install', Path.join(MOD1_SUB_INSTALL, 'mod1-1.0.0.tgz')], { cwd: BASE_SUB_INSTALL, shell: true });
