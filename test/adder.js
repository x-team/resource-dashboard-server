const test = require('tape');
const adder = require('../adder');

test('Adder without double flag', (t) => {
    t.equal(4, adder(2, 2));
    t.end();
});

test('Adder with double flag', (t) => {
    t.equal(8, adder(2, 2, true));
    t.end();
});
