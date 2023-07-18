const nativeFunctions = ["print", "prompt", "toInteger", "toDecimal"];
const nativeFunctionsArabic = ["اطبع", "اسال", "الى-صحيح", "الى-عشري"];

import generate from '../generator.js';
import parseMath from './math.js';

const generateNativeFunctions = (node) => {
    const calleeFirstMember = node.callee.type === 'Identifier' ? node.callee.value : getFirstMember(node.callee);
    switch (calleeFirstMember) {
        case "print":
            return `console.log(${node.arguments.map(generate).join(', ')})`;
        case "prompt":
            return `prompt(${node.arguments.map(generate).join(', ')})`;
        case "toInteger":
            return `parseInt(${node.arguments.map(generate).join(', ')})`;
        case "toDecimal":
            return `parseFloat(${node.arguments.map(generate).join(', ')})`;
        case "math":
        case "رياضيات":
            return parseMath(node);
        default:
            throw new TypeError("Unable to generate: " + node.type);
    }
};

function getFirstMember(ast) {
    if (ast.type === "MemberExpression") {
      if (ast.object.type === "Identifier") {
        return ast.object.value;
      } else {
        return getFirstMember(ast.object);
      }
    } else {
      throw new Error("Invalid AST structure. Expected a MemberExpression.");
    }
  }  

export { nativeFunctions, nativeFunctionsArabic, generateNativeFunctions };
