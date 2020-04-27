'use strict';
const BD = require('binary-downloader');
const PkgJSON = require('./package.json');
const libSqreenPath = BD.getPath(PkgJSON.binary);
module.exports = require(libSqreenPath);
