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
const res = CP.spawnSync('npm', ['install', '--save', '../mod1/mod1-1.0.0.tgz'], { shell: true, cwd: Path.join(__dirname, 'main') });

console.log(res.stdout.toString());
console.log(res.stderr.toString());

Assert.notStrictEqual(res.status, 0);
try {
    Assert(res.stderr.toString().includes('Wrong status code when GET'));
    Assert(res.stderr.toString().includes('404'));
}
catch (e) {
    console.log('NF', res.stderr.toString());
    throw e;
}
