'use strict';
const Assert = require('assert');
const CP = require('child_process');
const Path = require('path');
const Fs = require('fs');

Fs.readdirSync(__dirname)
    .map((x) => Path.join(__dirname, x))
    .forEach((dirPath) => {

        if (dirPath.endsWith('.js')) {
            return;
        }
        const runPath = Path.join(dirPath, 'run.js');
        console.log('RUNNING', runPath);
        const res = CP.spawnSync('node', [runPath], { shell: true, cwd: dirPath });
        if (res.status !== 0) {
            console.log(res.stderr.toString());
            console.log(res.stdout.toString());
        }
        Assert.equal(res.status, 0);
        console.log('RUNNING', runPath, 'run.js', 'OK');
    });
