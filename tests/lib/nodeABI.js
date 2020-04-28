'use strict';
const Test = require('tape');
const NodeABI = require('../../lib/nodeABI');

Test('getNAPIsForVersion', (t) => {

    t.plan(5);
    t.equal(NodeABI.getABIForVersion('v4.2.5'), 46);
    t.equal(NodeABI.getABIForVersion('v7.7.4'), 51);
    t.equal(NodeABI.getABIForVersion('v9.8.0'), 59);
    t.equal(NodeABI.getABIForVersion('v3.5.0'), -1);
    t.deepEqual(NodeABI.getABIForVersion('v14.0.0-nightly20200421c3554307c6'), 83);
    t.end();
});

Test('getNAPIsForVersion', (t) => {

    t.plan(5);
    t.deepEqual(Array.from(NodeABI.getNAPIsForVersion('v4.2.5')), []);
    t.deepEqual(Array.from(NodeABI.getNAPIsForVersion('v10.1.0')), [1, 2, 3]);
    t.deepEqual(Array.from(NodeABI.getNAPIsForVersion('v14.0.0')), [1, 2, 3, 4, 5]);
    t.deepEqual(Array.from(NodeABI.getNAPIsForVersion('v14.0.0-nightly20200421c3554307c6')), [1, 2, 3, 4, 5]);
    t.deepEqual(Array.from(NodeABI.getNAPIsForVersion('v14.1.0-rc.0')), [1, 2, 3, 4, 5]);
    t.end();
});
