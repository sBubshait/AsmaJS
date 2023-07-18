import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - Empty Array Expression", () => {
    const AST = {
        type: 'Root',
        body: [{
            type: 'ArrayExpression',
            elements: []
        }],
    }
    
    const code = generate(AST);
    const expectedCode = '[]';
  
    assertEquals(code, expectedCode);
});

Deno.test("Generator - Array Expression with multiple elements", () => {
    const AST = {
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

    const code = generate(AST);
    const expectedCode = '[10, "Hello", true]';
    
    assertEquals(code, expectedCode);
});