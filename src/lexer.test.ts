import { describe, expect, test } from "bun:test";
import { lexer } from "./lexer";

describe("lexer", () => {
  test("empty object", () => {
    const tokens = lexer("{}");

    expect(tokens).toEqual([
      { type: "OPEN_BRACE", value: "{" },
      { type: "CLOSE_BRACE", value: "}" },
    ]);
  });

  test("empty array", () => {
    const tokens = lexer("[]");

    expect(tokens).toEqual([
      { type: "OPEN_BRACKET", value: "[" },
      { type: "CLOSE_BRACKET", value: "]" },
    ]);
  });

  test("string", () => {
    const tokens = lexer('"hello"');

    expect(tokens).toEqual([{ type: "STRING", value: "hello" }]);
  });

  test("number", () => {
    const tokens = lexer("123");

    expect(tokens).toEqual([{ type: "NUMBER", value: 123 }]);
  });

  test("boolean", () => {
    const trueTokens = lexer("true");
    const falseTokens = lexer("false");

    expect(trueTokens).toEqual([{ type: "TRUE", value: "true" }]);
    expect(falseTokens).toEqual([{ type: "FALSE", value: "false" }]);
  });

  test("null", () => {
    const tokens = lexer("null");

    expect(tokens).toEqual([{ type: "NULL", value: "null" }]);
  });

  test("whitespace", () => {
    const tokens = lexer("  123  ");

    expect(tokens).toEqual([{ type: "NUMBER", value: 123 }]);
  });

  test("unexpected characters", () => {
    expect(() => lexer("123a")).toThrowError("Unexpected token: 123a");
    expect(() => lexer("truea")).toThrowError("Unexpected token: truea");
    expect(() => lexer("😂")).toThrowError("Unexpected token: \ud83d");
  });

  test("colon", () => {
    const tokens = lexer(":");

    expect(tokens).toEqual([{ type: "COLON", value: ":" }]);
  });

  test("an object with key and number value", () => {
    const tokens = lexer('{"test":123}');

    expect(tokens).toEqual([
      { type: "OPEN_BRACE", value: "{" },
      { type: "STRING", value: "test" },
      { type: "COLON", value: ":" },
      { type: "NUMBER", value: 123 },
      { type: "CLOSE_BRACE", value: "}" },
    ]);
  });

  test("an object with key and empty object", () => {
    const tokens = lexer('{"test":{}}');

    expect(tokens).toEqual([
      { type: "OPEN_BRACE", value: "{" },
      { type: "STRING", value: "test" },
      { type: "COLON", value: ":" },
      { type: "OPEN_BRACE", value: "{" },
      { type: "CLOSE_BRACE", value: "}" },
      { type: "CLOSE_BRACE", value: "}" },
    ]);
  });
});
