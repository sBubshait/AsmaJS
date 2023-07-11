import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing a function declaration", () => {
    const tokens = [
      { type: 'Keyword', value: 'function' },
      { type: 'Identifier', value: 'sum' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'Identifier', value: 'a' },
      { type: 'comma', value: ',' },
      { type: 'Identifier', value: 'b' },
      { type: 'right_parenthesis', value: ')' },
      { type: 'open_brace', value: '{' },
      { type: 'Keyword', value: 'return' },
      { type: 'Identifier', value: 'a' },
      { type: 'additiveOperator', value: '+' },
      { type: 'Identifier', value: 'b' },
      { type: 'semicolon', value: ';' },
      { type: 'close_brace', value: '}' },
    ];
    
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'FunctionDeclaration',
        id: { type: 'Identifier', value: 'sum' },
        params: [
          { type: 'Identifier', value: 'a' },
          { type: 'Identifier', value: 'b' },
        ],
        body: {
          type: 'BlockStatement',
          body: [{
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: '+',
              left: { type: 'Identifier', value: 'a' },
              right: { type: 'Identifier', value: 'b' },
            },
          }],
        },
      }],
    };
  
    assertEquals(AST, expectedAST);
  });