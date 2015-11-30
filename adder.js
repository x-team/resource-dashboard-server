module.exports = (numOne, numTwo, doubleFlag) => {
    if (!doubleFlag) {
        return numOne + numTwo;
    } else {
        return (numOne + numTwo) * 2;
    }
}
