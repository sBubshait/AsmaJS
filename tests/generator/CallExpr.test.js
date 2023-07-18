import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - Call Expression - Simple", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "CallExpression",
        callee: { type: "Identifier", value: "print" },
        arguments: [
          { type: "StringLiteral", value: "Hello, World!" }
        ]
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = 'print("Hello, World!")'; // Ideally, we would want to have a semicolon at the end, but it's not a big deal.

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Call Expression - Multiple Arguments", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "CallExpression",
        callee: { type: "Identifier", value: "sum" },
        arguments: [
          { type: "NumberLiteral", value: 5 },
          { type: "NumberLiteral", value: 7 }
        ]
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = 'sum(5, 7)';

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Call Expression - Nested", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "CallExpression",
        callee: { type: "Identifier", value: "print" },
        arguments: [
          {
            type: "CallExpression",
            callee: { type: "Identifier", value: "sum" },
            arguments: [
              { type: "NumberLiteral", value: 5 },
              { type: "NumberLiteral", value: 7 }
            ]
          }
        ]
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = 'print(sum(5, 7))';

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Call Expression - Function Call as an Argument", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "CallExpression",
        callee: { type: "Identifier", value: "multiply" },
        arguments: [
          { type: "Identifier", value: "sum" },
          { type: "NumberLiteral", value: 5 }
        ]
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = 'multiply(sum, 5)';

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Call Expression - Function Call on an Object", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: { type: "Identifier", value: "obj" },
          property: { type: "Identifier", value: "method" }
        },
        arguments: [
          { type: "NumberLiteral", value: 5 }
        ]
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = 'obj.method(5)';

  assertEquals(code, expectedCode);
});