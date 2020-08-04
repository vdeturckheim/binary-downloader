# binary-downloader
This module downloads remote binaries according to requirements for a given
version of Node.js.

It also simplifies requiring these modules.
It aims at Node.js v4 compatibility (and that's why it uses older versions of
the `tar` and `semver` modules).

The goal of this module is to provide a simple and lightweight way of handling
pre-built native modules when no local build is possible.

## Installation

```bash
npm install -S binary-downloader
```

## Usage
This module uses the same `binary` field in `package.json` as `node-pre-gyp`.
However, it only supports the following tags:
* `platform`
* `libc`
* `arch`
* `node_napi_label`

For other tags, feel free to open an issue or a PR!

Also, to get the `require` string to the downloaded binary, you will have to do
the following:
```js
const PackageJSON = require('./package.json');
const binding_path = Binary.getPath(PackageJSON.binary);
const Binding = require(binding_path);
``` 
(You are, of courses, free to get the `binary` part of the `package.json` by any
other way that works for you!);

## Proxy support

This module supports https proxy. If an URL is present in the `https_proxy`, the 
`HTTPS_PROXY` or the `npm_config_proxy` environment variable, the download
of the binary will be done through this URL using the `https-proxy-agent`
module.
Alternatively, using `http_proxy` or `HTTPS_PROXY` environment variables will
use the `http-proxy-agent` module.

## Differences with node-pre-gyp

The great [node-pre-gyp](TODO) module can handle the lifecycle of a native
module. It can help publishing it. It allows falling back on building the module
locally if download failed and many more.

The current module just tries its best to download a native module and make it
available to use. Nothing more, nothing less. It is therefore way lighter and
probably constitutes a good alternative to `node-pre-gyp` if you want to ship
a commercial (or at least) pre-vuilt version of a module. At least, it serves
my needs here.


