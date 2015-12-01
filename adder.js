'use strict';

// NOTE: This is just random module used for testing presentation

module.exports = (numOne, numTwo, doubleFlag) => {
    if (!doubleFlag) {
        return numOne + numTwo;
    } else {
        return (numOne + numTwo) * 2;
    }
}
