'use strict';

const test = require('tape');

require('./adder');

test('Is this a real life?', (t) => {
    t.ok(true, 'True dat!');
    t.end();
});
