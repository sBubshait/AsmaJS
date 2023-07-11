import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import parse from "../../src/parser.js";

Deno.test("Parser - Boolean Expressions", () => {
    const tokens = [
      { type: 'number', value: 5 },
      { type: 'boolean_operator', value: '<' },
      { type: 'number', value: 10 },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'NumberLiteral', value: 5 },
        right: { type: 'NumberLiteral', value: 10 }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });

  Deno.test("Parsing basic arithmetic operations with precedence", () => {
  const tokens = [
    { type: 'number', value: 5 },
    { type: 'additiveOperator', value: '+' },
    { type: 'number', value: 10 },
    { type: 'multiplicativeOperator', value: '*' },
    { type: 'number', value: 2 },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'NumberLiteral', value: 5 },
      right: { 
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'NumberLiteral', value: 10 },
        right: { type: 'NumberLiteral', value: 2 },
      }
    }]
  };

  assertEquals(AST, expectedAST);
});

// Unary expressions and precedence
Deno.test("Parser - Unary expressions and precedence", () => {
  const tokens = [
    { type: 'additiveOperator', value: '-' },
    { type: 'number', value: 5 },
    { type: 'multiplicativeOperator', value: '*' },
    { type: 'number', value: 2 },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  // expected is: (-5) * 2 NOT -(5 * 2)
  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'BinaryExpression',
      operator: '*',
      left: { 
        type: 'UnaryExpression',
        operator: '-',
        prefix: true,
        argument: { type: 'NumberLiteral', value: 5 }
      },
      right: { type: 'NumberLiteral', value: 2 }
    }]
  };  

  assertEquals(AST, expectedAST);
});

// Boolean operators and precedence
Deno.test("Parser - Boolean Operators and Precedence", () => {
  const tokens = [
    { type: 'number', value: 5 },
    { type: 'boolean_operator', value: '<' },
    { type: 'number', value: 10 },
    { type: 'logical_operator', value: '&&' },
    { type: 'number', value: 15 },
    { type: 'boolean_operator', value: '>' },
    { type: 'number', value: 20 },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'LogicalExpression',
      operator: '&&',
      left: { 
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'NumberLiteral', value: 5 },
        right: { type: 'NumberLiteral', value: 10 }
      },
      right: { 
        type: 'BinaryExpression',
        operator: '>',
        left: { type: 'NumberLiteral', value: 15 },
        right: { type: 'NumberLiteral', value: 20 }
      },
    }]
  };

  assertEquals(AST, expectedAST);
});

Deno.test("Parser -  Parenthesis and Precedence (1)", () => {
  const tokens = [
    { type: 'number', value: 5 },
    { type: 'multiplicativeOperator', value: '*' },
    { type: 'left_parenthesis', value: '(' },
    { type: 'number', value: 2 },
    { type: 'additiveOperator', value: '+' },
    { type: 'number', value: 3 },
    { type: 'right_parenthesis', value: ')' },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'BinaryExpression',
      operator: '*',
      left: { type: 'NumberLiteral', value: 5 },
      right: {
        type: 'ParenthesizedExpression',
        params: [{
          type: 'BinaryExpression',
          left: { type: 'NumberLiteral', value: 2 },
          operator: '+',
          right: { type: 'NumberLiteral', value: 3 }
        }]
      }
    }]
  };

  assertEquals(AST, expectedAST);
});

Deno.test("Parser - Precedence w/ Parenthesi", () => {
    const tokens = [
      { type: 'number', value: 5 },
      { type: 'multiplicativeOperator', value: '*' },
      { type: 'left_parenthesis', value: '(' },
      { type: 'number', value: 2 },
      { type: 'additiveOperator', value: '+' },
      { type: 'number', value: 3 },
      { type: 'right_parenthesis', value: ')' },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'NumberLiteral', value: 5 },
        right: {
          type: 'ParenthesizedExpression',
          params: [{
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'NumberLiteral', value: 2 },
          right: { type: 'NumberLiteral', value: 3 }
          }]
        }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });

  Deno.test("Parser - Single Logical Operator", () => {
    const tokens = [
      { type: 'BooleanLiteral', value: true },
      { type: 'logical_operator', value: '&&' },
      { type: 'BooleanLiteral', value: false },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'LogicalExpression',
        operator: '&&',
        left: { type: 'BooleanLiteral', value: true },
        right: { type: 'BooleanLiteral', value: false }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });

  Deno.test("Parser - Multiple Logical Operators", () => {
    const tokens = [
      { type: 'BooleanLiteral', value: true },
      { type: 'logical_operator', value: '&&' },
      { type: 'BooleanLiteral', value: false },
      { type: 'logical_operator', value: '||' },
      { type: 'BooleanLiteral', value: true },
      { type: 'semicolon', value: ';' }
    ];
  
    const AST = parse(tokens);
  
    const expectedAST = {
      type: 'Root',
      body: [{
        type: 'LogicalExpression',
        operator: '||',
        left: {
          type: 'LogicalExpression',
          operator: '&&',
          left: { type: 'BooleanLiteral', value: true },
          right: { type: 'BooleanLiteral', value: false }
        },
        right: { type: 'BooleanLiteral', value: true }
      }]
    };
  
    assertEquals(AST, expectedAST);
  });

Deno.test("Parser - Precedence of Logical Operators", () => {
  const tokens = [
    { type: 'BooleanLiteral', value: true },
    { type: 'logical_operator', value: '||' },
    { type: 'BooleanLiteral', value: false },
    { type: 'logical_operator', value: '&&' },
    { type: 'BooleanLiteral', value: true },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'LogicalExpression',
      operator: '||',
      left: { type: 'BooleanLiteral', value: true },
      right: {
        type: 'LogicalExpression',
        operator: '&&',
        left: { type: 'BooleanLiteral', value: false },
        right: { type: 'BooleanLiteral', value: true }
      }
    }]
  };

  assertEquals(AST, expectedAST);
});

Deno.test("Parser - Interaction of Logical Operators with Arithmetic and Boolean Expressions", () => {
  const tokens = [
    { type: 'number', value: 5 },
    { type: 'boolean_operator', value: '<' },
    { type: 'number', value: 10 },
    { type: 'logical_operator', value: '&&' },
    { type: 'number', value: 15 },
    { type: 'boolean_operator', value: '>' },
    { type: 'number', value: 20 },
    { type: 'semicolon', value: ';' }
  ];

  const AST = parse(tokens);

  const expectedAST = {
    type: 'Root',
    body: [{
      type: 'LogicalExpression',
      operator: '&&',
      left: { 
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'NumberLiteral', value: 5 },
        right: { type: 'NumberLiteral', value: 10 }
      },
      right: { 
        type: 'BinaryExpression',
        operator: '>',
        left: { type: 'NumberLiteral', value: 15 },
        right: { type: 'NumberLiteral', value: 20 }
      },
    }]
  };

  assertEquals(AST, expectedAST);
});