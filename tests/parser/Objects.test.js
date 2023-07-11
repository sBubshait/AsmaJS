import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parser - Object Declaration", () => {
    const tokens = [
      { type: 'Identifier', value: 'myObj' },
      { type: 'assignment_operator', value: '=' },
      { type: 'open_brace', value: '{' },
      { type: 'Identifier', value: 'key' },
      { type: 'colon', value: ':' },
      { type: 'StringLiteral', value: 'value' },
      { type: 'close_brace', value: '}' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'AssignmentExpression',
        identifier: { type: 'Identifier', value: 'myObj' },
        value: { 
          type: 'ObjectExpression', 
          properties: [
            { type: 'Property', key: { type: 'Identifier', value: 'key' }, value: { type: 'StringLiteral', value: 'value' } }
          ]
        }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });

Deno.test("Parser - Object Access", () => {
const tokens = [
    { type: 'Identifier', value: 'myObj' },
    { type: 'dot', value: '.' },
    { type: 'Identifier', value: 'key' },
    { type: 'semicolon', value: ';' }
];

const AST = parse(tokens);

const expectedAST = {
    type: 'Root',
    body: [{
    computed: false,
    type: 'MemberExpression',
    object: { type: 'Identifier', value: 'myObj' },
    property: { type: 'Identifier', value: 'key' }
    }]
};

assertEquals(AST, expectedAST);
});