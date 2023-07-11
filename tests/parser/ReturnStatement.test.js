import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parsing a return statement", () => {
    const tokens = [
      { type: 'Keyword', value: 'return' },
      { type: 'number', value: 10 },
      { type: 'semicolon', value: ';' }
    ];
    
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'ReturnStatement',
        argument: {
          type: 'NumberLiteral',
          value: 10,
        }
      }],
    };
  
    assertEquals(AST, expectedAST);
  });