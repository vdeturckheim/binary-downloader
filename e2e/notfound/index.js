'use strict';
const Assert = require('assert');
let err;
try {
    require('mod1');
}
catch (e) {
    err = e;
}
Assert(err); // module should not to be there as install failed for it
console.log('Test 404 OK');

