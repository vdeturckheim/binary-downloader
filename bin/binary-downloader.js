#!/usr/bin/env node

'use strict';
const Path = require('path');
const Fs = require('fs');
const Mod = require('../index');

const Package = JSON.parse(Fs.readFileSync(Path.join(process.cwd(), 'package.json')));
const binaryPart = Package.binary;

Mod.download(binaryPart);

