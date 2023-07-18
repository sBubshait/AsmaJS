import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - Assignment Expression", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "AssignmentExpression",
        operator: "=",
        identifier: { type: "Identifier", value: "x" },
        value: { type: "NumberLiteral", value: 10 },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "x = 10;";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Chained Assignments", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "AssignmentExpression",
        operator: "=",
        identifier: { type: "Identifier", value: "a" },
        value: {
          type: "AssignmentExpression",
          operator: "=",
          identifier: { type: "Identifier", value: "b" },
          value: { type: "NumberLiteral", value: 5 },
        },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "a = b = 5;;"; // although two ; are neither needed nor good-looking, it is expected and shouldn't be a problem.

  assertEquals(code, expectedCode);
});

Deno.test("Generator - += Operator", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "AssignmentExpression",
        operator: "+=",
        identifier: { type: "Identifier", value: "x" },
        value: { type: "NumberLiteral", value: 10 },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "x += 10;";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - -= Operator", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "AssignmentExpression",
        operator: "-=",
        identifier: { type: "Identifier", value: "x" },
        value: { type: "NumberLiteral", value: 10 },
      },
    ],
  };

  const code = generate(AST);
  const expectedCode = "x -= 10;";

  assertEquals(code, expectedCode);
});