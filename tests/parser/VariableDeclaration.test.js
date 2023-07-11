import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing a variable declaration", () => {
    const tokens = [
      { type: 'variableDeclarator', value: 'var' },
      { type: 'Identifier', value: 'x' },
      { type: 'assignment_operator', value: '=' },
      { type: 'number', value: 10 },
      { type: 'semicolon', value: ';' }
    ];
    
    const AST = parse(tokens);
    
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'VariableDeclaration',
        declarator: 'var',
        identifier: { type: 'Identifier', value: 'x' },
        value: {
          type: 'NumberLiteral',
          value: 10,
        }
      }],
    };
  
    assertEquals(AST, expectedAST);
  });