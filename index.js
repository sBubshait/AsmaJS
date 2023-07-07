import tokenizer from './src/tokenizer.js';
import parser from './src/parser.js';
import generate from './src/generator.js';

function compile (input) {
    const tokens = tokenizer(input);
    console.log(tokens)
    const ast = parser(tokens);
    console.log(JSON.stringify(ast, null, 2))
    const code = generate(ast);
    return code;
}

function repl() {
    console.log('Welcome to the Arabic Programming Language REPL!');
    while (true) {

        var input = prompt('>>> ');
        if (input === 'exit') {
            break;
        }
        var output = compile(input);
        console.log(JSON.stringify(output, null, 2));

    }
}

repl();


export default {compile, repl};