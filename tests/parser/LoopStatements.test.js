import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing a simple for loop", () => {
    const tokens = [
        { type: "Keyword", value: "for" },
        { type: "left_parenthesis", value: "(" },
        { type: "variableDeclarator", value: "var" },
        { type: "Identifier", value: "i" },
        { type: "assignment_operator", value: "=" },
        { type: "number", value: "0" },
        { type: "semicolon", value: ";" },
        { type: "Identifier", value: "i" },
        { type: "boolean_operator", value: "<" },
        { type: "number", value: "10" },
        { type: "semicolon", value: ";" },
        { type: "Identifier", value: "i" },
        { type: "assignment_operator", value: "=" },
        { type: "Identifier", value: "i" },
        { type: "additiveOperator", value: "+" },
        { type: "number", value: "1" },
        { type: "right_parenthesis", value: ")" },
        { type: "open_brace", value: "{" },
        { type: "Identifier", value: "print" },
        { type: "left_parenthesis", value: "(" },
        { type: "StringLiteral", value: "hello there!" },
        { type: "right_parenthesis", value: ")" },
        { type: "semicolon", value: ";" },
        { type: "close_brace", value: "}" },
        { type: "semicolon", value: ";" }
      ]

    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarator: 'var',
                identifier: { type: 'Identifier', value: 'i' },
                value: {
                    type: 'NumberLiteral',
                    value: 0,
                }
            },
            test: {
                type: 'BinaryExpression',
                left: { type: 'Identifier', value: 'i' },
                operator: '<',
                right: { type: 'NumberLiteral', value: 10 }
            },
            update: {
                type: 'AssignmentExpression',
                operator: '=',
                identifier: { type: 'Identifier', value: 'i'},
                value: { 
                    type: 'BinaryExpression',
                    left: { type: 'Identifier', value: 'i'},
                    operator: '+',
                    right:  { type: 'NumberLiteral', value: 1},
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: "NativeCallExpression",
                    callee: {
                        type: "Identifier",
                        value: "print"
                    },
                    arguments: [
                        {
                            type: "StringLiteral",
                            value: "hello there!"
                        }
                    ]
                }]
            }
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing a simple for loop (2)", () => {
    const tokens = [
        { type: "Keyword", value: "for" },
        { type: "left_parenthesis", value: "(" },
        { type: "variableDeclarator", value: "const" },
        { type: "Identifier", value: "j" },
        { type: "assignment_operator", value: "=" },
        { type: "number", value: "0" },
        { type: "semicolon", value: ";" },
        { type: "Identifier", value: "j" },
        { type: "boolean_operator", value: "<" },
        { type: "number", value: "12" },
        { type: "semicolon", value: ";" },
        { type: "Identifier", value: "j" },
        { type: "increment_decrement_operator", value: "++" },
        { type: "right_parenthesis", value: ")" },
        { type: "open_brace", value: "{" },
        { type: "Identifier", value: "print" },
        { type: "left_parenthesis", value: "(" },
        { type: "StringLiteral", value: "hello there!" },
        { type: "right_parenthesis", value: ")" },
        { type: "close_brace", value: "}" },
      ]

    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarator: 'const',
                identifier: { type: 'Identifier', value: 'j' },
                value: {
                    type: 'NumberLiteral',
                    value: 0,
                }
            },
            test: {
                type: 'BinaryExpression',
                left: { type: 'Identifier', value: 'j' },
                operator: '<',
                right: { type: 'NumberLiteral', value: 12 }
            },
            update: {
                type: 'UpdateExpression',
                argument: { type: 'Identifier', value: 'j'},
                operator: '++',
                prefix: false
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: "NativeCallExpression",
                    callee: {
                        type: "Identifier",
                        value: "print"
                    },
                    arguments: [
                        {
                            type: "StringLiteral",
                            value: "hello there!"
                        }
                    ]
                }]
            }
        }],
    };

    assertEquals(AST, expectedAST);
});


Deno.test("Parsing a simple while loop", () => {
    const tokens = [
        { type: 'Keyword', value: 'while' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'Identifier', value: 'condition' },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
    ];

    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'WhileStatement',
            test: {
                type: 'Identifier',
                value: 'condition',
            },
            body: {
                type: 'BlockStatement',
                body: [],
            },
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing a complex for loop", () => {
    const tokens = [
        { type: 'Keyword', value: 'for' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'variableDeclarator', value: 'const' },
        { type: 'Identifier', value: 'i' },
        { type: 'assignment_operator', value: '=' },
        { type: 'number', value: 0 },
        { type: 'semicolon', value: ';' },
        { type: 'Identifier', value: 'i' },
        { type: 'boolean_operator', value: '<' },
        { type: 'number', value: 10 },
        { type: 'semicolon', value: ';' },
        { type: 'Identifier', value: 'i' },
        { type: 'increment_decrement_operator', value: '++' },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'Keyword', value: 'while' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'Identifier', value: 'j' },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'close_brace', value: '}' },
    ];

    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarator: 'const',
                identifier: { type: 'Identifier', value: 'i' },
                value: {
                    type: 'NumberLiteral',
                    value: 0,
                }
            },
            test: {
                type: 'BinaryExpression',
                left: { type: 'Identifier', value: 'i' },
                operator: '<',
                right: { type: 'NumberLiteral', value: 10 }
            },
            update: {
                type: 'UpdateExpression',
                argument: { type: 'Identifier', value: 'i' },
                operator: '++',
                prefix: false
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'WhileStatement',
                    test: { type: 'Identifier', value: 'j' },
                    body: {
                        type: 'BlockStatement',
                        body: []
                    }
                }]
            }
        }],
    };

    assertEquals(AST, expectedAST);
});

Deno.test("Parsing a complex while loop", () => {
    const tokens = [
        { type: 'Keyword', value: 'while' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'Identifier', value: 'condition' },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'Keyword', value: 'for' },
        { type: 'left_parenthesis', value: '(' },
        { type: 'variableDeclarator', value: 'var' },
        { type: 'Identifier', value: 'i' },
        { type: 'assignment_operator', value: '=' },
        { type: 'number', value: 0 },
        { type: 'semicolon', value: ';' },
        { type: 'Identifier', value: 'i' },
        { type: 'boolean_operator', value: '<' },
        { type: 'number', value: 10 },
        { type: 'semicolon', value: ';' },
        { type: 'Identifier', value: 'i' },
        { type: 'increment_decrement_operator', value: '++' },
        { type: 'right_parenthesis', value: ')' },
        { type: 'open_brace', value: '{' },
        { type: 'close_brace', value: '}' },
        { type: 'close_brace', value: '}' },
    ];

    const AST = parse(tokens);

    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'WhileStatement',
            test: { type: 'Identifier', value: 'condition' },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ForStatement',
                    init: {
                        type: 'VariableDeclaration',
                        declarator: 'var',
                        identifier: { type: 'Identifier', value: 'i' },
                        value: {
                            type: 'NumberLiteral',
                            value: 0,
                        }
                    },
                    test: {
                        type: 'BinaryExpression',
                        left: { type: 'Identifier', value: 'i' },
                        operator: '<',
                        right: { type: 'NumberLiteral', value: 10 }
                    },
                    update: {
                        type: 'UpdateExpression',
                        argument: { type: 'Identifier', value: 'i' },
                        operator: '++',
                        prefix: false
                    },
                    body: {
                        type: 'BlockStatement',
                        body: []
                    }
                }]
            }
        }],
    };

    assertEquals(AST, expectedAST);
});