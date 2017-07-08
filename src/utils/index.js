const ucFirst = value => `${value.charAt(0).toUpperCase()}${value.substr(1)}`;
const rand = (low, high) => Math.round(Math.random() * (high - low) + low);
const range = amount => Array.apply(null, new Array(amount));
const rangeArray = amount => range(amount).map((_, index) => index + 1);
const format = (...args) => {
    const string = args.shift();
    return string.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};

export { ucFirst, rand, range, rangeArray, format };