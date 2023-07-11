import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing a simple if statement", () => {
    const tokens = [
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 10 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);
  
    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'IfStatement',
            test: {
                type: 'NumberLiteral',
                value: 10,
            },
            consequent: {
                type: 'BlockStatement',
                body: [],
            },
            alternate: null,
        }],
    };
  
    assertEquals(AST, expectedAST);
});

Deno.test("Parsing an if-else statement", () => {
    const tokens = [
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 10 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'Keyword', value: 'else' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'IfStatement',
            test: {
                type: 'NumberLiteral',
                value: 10,
            },
            consequent: {
                type: 'BlockStatement',
                body: [],
            },
            alternate: {
                type: 'BlockStatement',
                body: [],
            },
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing an if-else if statement", () => {
    const tokens = [
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 10 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'Keyword', value: 'else' },
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 20 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'IfStatement',
            test: {
                type: 'NumberLiteral',
                value: 10,
            },
            consequent: {
                type: 'BlockStatement',
                body: [],
            },
            alternate: {
                type: 'IfStatement',
                test: {
                    type: 'NumberLiteral',
                    value: 20,
                },
                consequent: {
                    type: 'BlockStatement',
                    body: [],
                },
                alternate: null,
            },
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing an if-else if-else statement", () => {
    const tokens = [
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 10 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'Keyword', value: 'else' },
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 20 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'Keyword', value: 'else' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'IfStatement',
            test: {
                type: 'NumberLiteral',
                value: 10,
            },
            consequent: {
                type: 'BlockStatement',
                body: [],
            },
            alternate: {
                type: 'IfStatement',
                test: {
                    type: 'NumberLiteral',
                    value: 20,
                },
                consequent: {
                    type: 'BlockStatement',
                    body: [],
                },
                alternate: {
                    type: 'BlockStatement',
                    body: [],
                },
            },
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing nested if-else statement", () => {
    const tokens = [
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 10 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'Keyword', value: 'if' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'number', value: 20 },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'close_brace', value: '}' },
        { type: 'Keyword', value: 'else' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'IfStatement',
            test: {
                type: 'NumberLiteral',
                value: 10,
            },
            consequent: {
                type: 'BlockStatement',
                body: [{
                    type: 'IfStatement',
                    test: {
                        type: 'NumberLiteral',
                        value: 20,
                    },
                    consequent: {
                        type: 'BlockStatement',
                        body: [],
                    },
                    alternate: null,
                }],
            },
            alternate: {
                type: 'BlockStatement',
                body: [],
            },
        }],
    };

    assertEquals(AST, expectedAST);
});
