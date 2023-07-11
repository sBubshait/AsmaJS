import tokenize from './src/tokenizer.js';
import parse from './src/parser.js';

var code = `toInteger(prompt("Enter a number: "))`

var tokens = tokenize(code);
var ast = parse(tokens);

console.log(JSON.stringify(ast, null, 2));