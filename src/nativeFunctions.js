const nativeFunctions = ["print", "prompt", "toInteger", "toDecimal"];
const nativeFunctionsArabic = ["اطبع", "اسال", "الى-صحيح", "الى-عشري"];

import generate from './generator.js';

const generateNativeFunctions = (node) => {
    switch (node.callee.value) {
        case "print":
            return `console.log(${node.arguments.map(generate).join(', ')})`;
        case "prompt":
            return `prompt(${node.arguments.map(generate).join(', ')})`;
        case "toInteger":
            return `parseInt(${node.arguments.map(generate).join(', ')})`;
        case "toDecimal":
            return `parseFloat(${node.arguments.map(generate).join(', ')})`;
        default:
            throw new TypeError("Unable to generate: " + node.type);
    }
};

export { nativeFunctions, nativeFunctionsArabic, generateNativeFunctions };
