import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - If Statement - Simple", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "IfStatement",
        test: { type: "NumberLiteral", value: 10 },
        consequent: { type: "BlockStatement", body: [] },
        alternate: null
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "if (10) {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - If Statement - If-Else", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "IfStatement",
        test: { type: "NumberLiteral", value: 10 },
        consequent: { type: "BlockStatement", body: [] },
        alternate: { type: "BlockStatement", body: [] }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "if (10) {} else {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - If Statement - If-Else If", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "IfStatement",
        test: { type: "NumberLiteral", value: 10 },
        consequent: { type: "BlockStatement", body: [] },
        alternate: {
          type: "IfStatement",
          test: { type: "NumberLiteral", value: 20 },
          consequent: { type: "BlockStatement", body: [] },
          alternate: null
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "if (10) {} else if (20) {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - If Statement - If-Else If-Else", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "IfStatement",
        test: { type: "NumberLiteral", value: 10 },
        consequent: { type: "BlockStatement", body: [] },
        alternate: {
          type: "IfStatement",
          test: { type: "NumberLiteral", value: 20 },
          consequent: { type: "BlockStatement", body: [] },
          alternate: { type: "BlockStatement", body: [] }
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "if (10) {} else if (20) {} else {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - If Statement - Nested If-Else", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "IfStatement",
        test: { type: "NumberLiteral", value: 10 },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "IfStatement",
              test: { type: "NumberLiteral", value: 20 },
              consequent: { type: "BlockStatement", body: [] },
              alternate: null
            }
          ]
        },
        alternate: { type: "BlockStatement", body: [] }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "if (10) {\nif (20) {}\n} else {}";

  assertEquals(code, expectedCode);
});