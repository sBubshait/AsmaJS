import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Call Expression - Simple", () => {
    const tokens = [
      { type: 'Identifier', value: 'print' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'StringLiteral', value: 'Hello, World!' },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'NativeCallExpression',
        callee: { type: 'Identifier', value: 'print' },
        arguments: [
          { type: 'StringLiteral', value: 'Hello, World!' }
        ]
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  
  Deno.test("Call Expression - Multiple Arguments", () => {
    const tokens = [
      { type: 'Identifier', value: 'sum' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'number', value: 5 },
      { type: 'comma', value: ',' },
      { type: 'number', value: 7 },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'CallExpression',
        callee: { type: 'Identifier', value: 'sum' },
        arguments: [
          { type: 'NumberLiteral', value: 5 },
          { type: 'NumberLiteral', value: 7 }
        ]
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  
  Deno.test("Call Expression - Nested", () => {
    const tokens = [
      { type: 'Identifier', value: 'print' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'Identifier', value: 'sum' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'number', value: 5 },
      { type: 'comma', value: ',' },
      { type: 'number', value: 7 },
      { type: 'right_parenthesis', value: ')' },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'NativeCallExpression',
        callee: { type: 'Identifier', value: 'print' },
        arguments: [{
          type: 'CallExpression',
          callee: { type: 'Identifier', value: 'sum' },
          arguments: [
            { type: 'NumberLiteral', value: 5 },
            { type: 'NumberLiteral', value: 7 }
          ]
        }]
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  
  Deno.test("Call Expression - Parsing function call as an argument", () => {
    const tokens = [
      { type: 'Identifier', value: 'multiply' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'Identifier', value: 'sum' },
      { type: 'comma', value: ',' },
      { type: 'number', value: 5 },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'CallExpression',
        callee: { type: 'Identifier', value: 'multiply' },
        arguments: [
          { type: 'Identifier', value: 'sum' },
          { type: 'NumberLiteral', value: 5 }
        ]
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  
  Deno.test("Call Expression - Parsing function call on an object", () => {
    const tokens = [
      { type: 'Identifier', value: 'obj' },
      { type: 'dot', value: '.' },
      { type: 'Identifier', value: 'method' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'number', value: 5 },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'CallExpression',
        callee: { 
          computed: false,
          type: 'MemberExpression',
          object: { type: 'Identifier', value: 'obj' },
          property: { type: 'Identifier', value: 'method' }
        },
        arguments: [
          { type: 'NumberLiteral', value: 5 }
        ]
      }]
    };
  
    assertEquals(AST, expectedAST);
  });
  