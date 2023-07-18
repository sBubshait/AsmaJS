import generate from '../generator.js';

const supportedMethods = {
    "باي": "PI",
    "إي": "E",
    "قيمة-مطلقة": "abs",
    "جيب": "sin",
    "جيب-عكس": "cos",
    "ظل": "tan",
    "قرب": "round",
    "قرب-أسفل": "floor",
    "قرب-أعلى": "ceil",
    "جذر": "sqrt",
    "لوق": "log",
    "اس": "pow",
    "اقل": "min",
    "اكثر": "max"
};

const generateMathFunctions = (node) => {
    const mathFunc = node.callee.property.value;
    if (Object.keys(supportedMethods).includes(mathFunc) || Object.values(supportedMethods).includes(mathFunc)) {
        var chosenFunction = Object.keys(supportedMethods).includes(mathFunc) ? supportedMethods[mathFunc] : mathFunc;
        return `Math.${chosenFunction}(${node.arguments.map(generate).join(', ')})`;
    }else {
        switch(mathFunc) {
            case "موجب":
                return `Math.abs(${node.arguments.map(generate).join(', ')})`;
            case "arcsin":
                return `Math.asin(${node.arguments.map(generate).join(', ')})`;
            case "arccos":
                return `Math.acos(${node.arguments.map(generate).join(', ')})`;
            case "arctan":
                return `Math.atan(${node.arguments.map(generate).join(', ')})`;
            case "round_down":
                return `Math.floor(${node.arguments.map(generate).join(', ')})`;
            case "ceil":
                return `Math.ceil(${node.arguments.map(generate).join(', ')})`;
            case "round_up":
                return `Math.ceil(${node.arguments.map(generate).join(', ')})`;
            case "rand":
                return `Math.random(${node.arguments.map(generate).join(', ')})`;
            case "عشوائي":
                return `Math.random(${node.arguments.map(generate).join(', ')})`;
            case "randint":
            case "عشوائي-صحيح":
                // randint() => [0,1], randint(a) => [0,a], randint(a,b) => [a,b].
                const args = node.arguments.map(generate);
                const min = (args.length == 0 || args.length == 1) ? 0 : args[0];
                const max = args.length == 0 ? 1 : args[args.length - 1];
                return `Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min}`;
            default:
                throw new Error(`Math function "${mathFunc}" is not supported.`);
        }
    }
};

export default generateMathFunctions;