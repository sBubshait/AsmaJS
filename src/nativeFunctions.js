const nativeFunctions = ["print", "prompt"];
const nativeFunctionsArabic = ["اطبع", "اسال"];

import generate from './generator.js';

// translate native functions to JS
const generateNativeFunctions = (node) => {
    switch (node.callee.value) {
        case "print":
            return `console.log(${node.args.map(generate).join(', ')})`;
        case "prompt":
            return `prompt(${node.args.map(generate).join(', ')})`;
        default:
            throw new TypeError("Unable to generate: " + node.type);
    }
};

export { nativeFunctions, nativeFunctionsArabic, generateNativeFunctions };
