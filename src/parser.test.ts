import { describe, expect, test } from "bun:test";
import { lexer } from "./lexer";
import { parser } from "./parser";

describe("parser", () => {
  test("empty object", () => {
    const ast = parser(lexer("{}"));

    expect(ast).toEqual({ type: "Object", value: {} });
  });

  test("object with single boolean key/value", () => {
    const ast = parser(lexer('{"test": true}'));

    expect(ast).toEqual({
      type: "Object",
      value: {
        test: {
          type: "Boolean",
          value: true,
        },
      },
    });
  });

  test("nested object with single boolean key/value", () => {
    const ast = parser(lexer('{"test": {"test2":true}}'));

    expect(ast).toEqual({
      type: "Object",
      value: {
        test: {
          type: "Object",
          value: {
            test2: {
              type: "Boolean",
              value: true,
            },
          },
        },
      },
    });
  });
});
