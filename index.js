import tokenizer from './src/tokenizer.js';
import parser from './src/parser.js';
import generate from './src/generator.js';

function compile (input) {
    const tokens = tokenizer(input);
    const ast = parser(tokens);
    const code = generate(ast);
    return code;
}

export default compile;