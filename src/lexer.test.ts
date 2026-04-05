import { describe, expect, test } from "bun:test";
import { lexer } from "./lexer";

describe("lexer", () => {
  describe("structural tokens", () => {
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

    test("colon", () => {
      const tokens = lexer(":");

      expect(tokens).toEqual([{ type: "COLON", value: ":" }]);
    });

    test("comma", () => {
      const tokens = lexer(",");

      expect(tokens).toEqual([{ type: "COMMA", value: "," }]);
    });
  });

  describe("primitive values", () => {
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
  });

  describe("string features", () => {
    test("empty string", () => {
      const tokens = lexer('""');

      expect(tokens).toEqual([{ type: "STRING", value: "" }]);
    });

    test("string with spaces inside", () => {
      const tokens = lexer('"hello world"');

      expect(tokens).toEqual([{ type: "STRING", value: "hello world" }]);
    });

    test("string escape sequences", () => {
      const tokens = lexer('"hello\nworld"');

      expect(tokens).toEqual([{ type: "STRING", value: "hello\nworld" }]);
    });

    test("escaped quotes", () => {
      const tokens = lexer('"say \\"hello\\""');

      expect(tokens).toEqual([{ type: "STRING", value: 'say "hello"' }]);
    });

    test("backslash escape", () => {
      const tokens = lexer('"path\\\\to\\\\file"');

      expect(tokens).toEqual([{ type: "STRING", value: "path\\to\\file" }]);
    });

    test("newline escape sequence", () => {
      const tokens = lexer('"hello\\nworld"');

      expect(tokens).toEqual([{ type: "STRING", value: "hello\nworld" }]);
    });

    test("carriage return escape sequence", () => {
      const tokens = lexer('"hello\\rworld"');

      expect(tokens).toEqual([{ type: "STRING", value: "hello\rworld" }]);
    });

    test("tab escape sequence", () => {
      const tokens = lexer('"hello\\tworld"');

      expect(tokens).toEqual([{ type: "STRING", value: "hello\tworld" }]);
    });

    test("multiple escape sequences combined", () => {
      const tokens = lexer('"line1\\nline2\\twith\\ttabs\\rand\\rreturn"');

      expect(tokens).toEqual([{ type: "STRING", value: "line1\nline2\twith\ttabs\rand\rreturn" }]);
    });

    test("newline and carriage return combined (Windows style)", () => {
      const tokens = lexer('"line1\\r\\nline2"');

      expect(tokens).toEqual([{ type: "STRING", value: "line1\r\nline2" }]);
    });

    test("all three escape sequences together", () => {
      const tokens = lexer('"start\\t\\n\\rend"');

      expect(tokens).toEqual([{ type: "STRING", value: "start\t\n\rend" }]);
    });

    test("backslash escape", () => {
      const tokens = lexer('"path\\\\to\\\\file"');

      expect(tokens).toEqual([{ type: "STRING", value: "path\\to\\file" }]);
    });

    test("unicode strings", () => {
      const tokens = lexer('"\\u0048\\u0065\\u006C\\u006C\\u006F"');

      expect(tokens).toEqual([{ type: "STRING", value: "\\u0048\\u0065\\u006C\\u006C\\u006F" }]);
    });
  });

  describe("number variants", () => {
    test("negative numbers", () => {
      const tokens = lexer("-123");

      expect(tokens).toEqual([{ type: "NUMBER", value: -123 }]);
    });

    test("floating-point numbers", () => {
      const tokens = lexer("123.45");

      expect(tokens).toEqual([{ type: "NUMBER", value: 123.45 }]);
    });

    test("scientific notation", () => {
      const tokens1 = lexer("1.2e3");

      expect(tokens1).toEqual([{ type: "NUMBER", value: 1.2e3 }]);

      const tokens2 = lexer("1.2E+3");

      expect(tokens2).toEqual([{ type: "NUMBER", value: 1.2e+3 }]);
    });
  });

  describe("whitespace handling", () => {
    test("whitespace", () => {
      const tokens = lexer("  123  ");

      expect(tokens).toEqual([{ type: "NUMBER", value: 123 }]);
    });

    test("empty input", () => {
      const tokens = lexer("");

      expect(tokens).toEqual([]);
    });

    test("whitespace-only input", () => {
      const tokens = lexer("   ");

      expect(tokens).toEqual([]);
    });
  });

  describe("error handling", () => {
    test("unexpected characters", () => {
      expect(() => lexer("123a")).toThrowError("Unexpected token: 123a");
      expect(() => lexer("truea")).toThrowError("Unexpected token: truea");
      expect(() => lexer("😂")).toThrowError("Unexpected token: \ud83d");
    });
  });

  describe("complex structures", () => {
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

    test("array with multiple elements", () => {
      const tokens = lexer("[1, 2, 3]");

      expect(tokens).toEqual([
        { type: "OPEN_BRACKET", value: "[" },
        { type: "NUMBER", value: 1 },
        { type: "COMMA", value: "," },
        { type: "NUMBER", value: 2 },
        { type: "COMMA", value: "," },
        { type: "NUMBER", value: 3 },
        { type: "CLOSE_BRACKET", value: "]" },
      ]);
    });

    test("array with strings", () => {
      const tokens = lexer('["a", "b"]');

      expect(tokens).toEqual([
        { type: "OPEN_BRACKET", value: "[" },
        { type: "STRING", value: "a" },
        { type: "COMMA", value: "," },
        { type: "STRING", value: "b" },
        { type: "CLOSE_BRACKET", value: "]" },
      ]);
    });
  });
});
