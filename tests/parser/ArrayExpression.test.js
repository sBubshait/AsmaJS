import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing an empty array", () => {
    const tokens = [
        { type: 'open_bracket', value: '[' },
        { type: 'close_bracket', value: ']' },
    ];
    
    const AST = parse(tokens);
    
    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'ArrayExpression',
            elements: []
        }],
    };
  
    assertEquals(AST, expectedAST);
});

Deno.test("Parsing an array with multiple elements", () => {
    const tokens = [
        { type: 'open_bracket', value: '[' },
        { type: 'number', value: 10 },
        { type: 'comma', value: ',' },
        { type: 'StringLiteral', value: 'Hello' },
        { type: 'comma', value: ',' },
        { type: 'BooleanLiteral', value: true },
        { type: 'close_bracket', value: ']' },
    ];
    
    const AST = parse(tokens);
  
    const expectedAST = {
        type: 'Root',
        body: [{
            type: 'ArrayExpression',
            elements: [
                { type: 'NumberLiteral', value: 10 },
                { type: 'StringLiteral', value: 'Hello' },
                { type: 'BooleanLiteral', value: true },
            ]
        }],
    };
  
    assertEquals(AST, expectedAST);
});