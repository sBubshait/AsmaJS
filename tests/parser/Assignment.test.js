import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parser - Assignment", () => {
    const tokens = [
      { type: 'Identifier', value: 'x' },
      { type: 'assignment_operator', value: '=' },
      { type: 'number', value: 10 },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'AssignmentExpression',
        identifier: { type: 'Identifier', value: 'x' },
        value: { type: 'NumberLiteral', value: 10 }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  
Deno.test("Parser - chained assignments", () => {
  const tokens = [
    { type: 'Identifier', value: 'a' },
    { type: 'assignment_operator', value: '=' },
    { type: 'Identifier', value: 'b' },
    { type: 'assignment_operator', value: '=' },
    { type: 'number', value: 5 },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'AssignmentExpression',
      identifier: { type: 'Identifier', value: 'a' },
      value: {
        type: 'AssignmentExpression',
        identifier: { type: 'Identifier', value: 'b' },
        value: { type: 'NumberLiteral', value: 5 }
      }
    }]
  };

  assertEquals(AST, expectedAST);
});