import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - Binary Expression - Arithmetic", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 5 },
        right: { type: "NumberLiteral", value: 10 },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "5 + 10";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Binary Expression - Boolean", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "BinaryExpression",
        operator: "<",
        left: { type: "NumberLiteral", value: 5 },
        right: { type: "NumberLiteral", value: 10 },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "5 < 10";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Binary Expression - Logical", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "BinaryExpression",
        operator: "&&",
        left: { type: "BooleanLiteral", value: true },
        right: { type: "BooleanLiteral", value: false },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "true && false";

  assertEquals(code, expectedCode);
});

  Deno.test("Generator - basic operations", () => {
  const AST =  {
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

  const code = generate(AST);
  const expectedCode = '5 + 10 * 2';

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Unary Expressions", () => {
  const AST = {
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

  const code = generate(AST);
  const expectedCode = '-5 * 2';

  assertEquals(code, expectedCode);
});
