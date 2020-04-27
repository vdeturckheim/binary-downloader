'use strict';
const Assert = require('assert');
const CP = require('child_process');
const Fs = require('fs');
const Path = require('path');

try {
    Fs.unlinkSync(Path.join(__dirname, 'mod1', 'mod1-1.0.0.tgz'));
}
catch (_) {}
CP.spawnSync('npm', ['run', 'build'], { shell: true, cwd: Path.join(__dirname, 'mod1') });
CP.spawnSync('npm', ['install', '--save', '../mod1/mod1-1.0.0.tgz'], { shell: true, cwd: Path.join(__dirname, 'main') });
CP.spawnSync('node', ['index.js'], { shell: true, cwd: Path.join(__dirname, 'main') });

const Main = require('./main');
Assert(Main.powerwaf_initializePowerWAF);
console.log('Everything seems fine!');
