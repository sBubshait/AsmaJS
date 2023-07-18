import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import generate from "../../src/generator.js";

Deno.test("Generator - Function Declaration - No Parameters", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "FunctionDeclaration",
        id: { type: "Identifier", value: "hello" },
        params: [],
        body: {
          type: "BlockStatement",
          body: []
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "function hello() {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Function Declaration - Single Parameter", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "FunctionDeclaration",
        id: { type: "Identifier", value: "square" },
        params: [{ type: "Identifier", value: "x" }],
        body: {
          type: "BlockStatement",
          body: []
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "function square(x) {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Function Declaration - Multiple Parameters", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "FunctionDeclaration",
        id: { type: "Identifier", value: "sum" },
        params: [
          { type: "Identifier", value: "a" },
          { type: "Identifier", value: "b" }
        ],
        body: {
          type: "BlockStatement",
          body: []
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode = "function sum(a, b) {}";

  assertEquals(code, expectedCode);
});

Deno.test("Generator - Function Declaration - Function Body", () => {
  const AST = {
    type: "Root",
    body: [
      {
        type: "FunctionDeclaration",
        id: { type: "Identifier", value: "multiply" },
        params: [
          { type: "Identifier", value: "a" },
          { type: "Identifier", value: "b" }
        ],
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ReturnStatement",
              argument: {
                type: "BinaryExpression",
                operator: "*",
                left: { type: "Identifier", value: "a" },
                right: { type: "Identifier", value: "b" }
              }
            }
          ]
        }
      }
    ]
  };

  const code = generate(AST);
  const expectedCode =
`function multiply(a, b) {
return a * b;
}`; // ideally we would have some indentation, but, again, it's not a big deal.

  assertEquals(code, expectedCode);
});
