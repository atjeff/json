import { describe, expect, test } from "bun:test";
import { lexer } from "./lexer";
import { parser } from "./parser";

describe("parser", () => {
  describe("structural tokens", () => {
    test("empty object", () => {
      const ast = parser(lexer("{}"));

      expect(ast).toEqual({ type: "Object", value: {} });
    });

    test("empty array", () => {
      const ast = parser(lexer("[]"));

      expect(ast).toEqual({ type: "Array", value: [] });
    });
  });

  describe("primitive values", () => {
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

    test("object with all types of values", () => {
      const ast = parser(
        lexer(
          `{
          "id": "647ceaf3657eade56f8224eb",
          "index": 0,
          "anArray": [],
          "boolean": true,
          "nullValue": null
        }`
        )
      );

      expect(ast).toMatchInlineSnapshot(`
        {
          "type": "Object",
          "value": {
            "anArray": {
              "type": "Array",
              "value": [],
            },
            "boolean": {
              "type": "Boolean",
              "value": true,
            },
            "id": {
              "type": "String",
              "value": "647ceaf3657eade56f8224eb",
            },
            "index": {
              "type": "Number",
              "value": 0,
            },
            "nullValue": {
              "type": "Null",
            },
          },
        }
      `);
    });
  });

  describe("complex structures", () => {
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

    test("object with single key and empty array", () => {
      const ast = parser(lexer('  { "test": [] }  '));

      expect(ast).toEqual({
        type: "Object",
        value: {
          test: {
            type: "Array",
            value: [],
          },
        },
      });
    });

    test("really complex nested object", () => {
      const ast = parser(
        lexer(
          `{
          "id": {
            "idInner1": [{
              "key": [{ "innerKey1": [true], "innerKey2": [123] }]
            }]
          }
        }`
        )
      );

      expect(ast).toMatchInlineSnapshot(`
        {
          "type": "Object",
          "value": {
            "id": {
              "type": "Object",
              "value": {
                "idInner1": {
                  "type": "Array",
                  "value": [
                    {
                      "type": "Object",
                      "value": {
                        "key": {
                          "type": "Array",
                          "value": [
                            {
                              "type": "Object",
                              "value": {
                                "innerKey1": {
                                  "type": "Array",
                                  "value": [
                                    {
                                      "type": "Boolean",
                                      "value": true,
                                    },
                                  ],
                                },
                                "innerKey2": {
                                  "type": "Array",
                                  "value": [
                                    {
                                      "type": "Number",
                                      "value": 123,
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        }
      `);
    });

    test("object with multiple key-value pairs", () => {
      const ast = parser(lexer('{"a": 1, "b": 2}'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          a: { type: "Number", value: 1 },
          b: { type: "Number", value: 2 },
        },
      });
    });

    test("array with multiple elements", () => {
      const ast = parser(lexer('["a", "b", "c"]'));

      expect(ast).toEqual({
        type: "Array",
        value: [
          { type: "String", value: "a" },
          { type: "String", value: "b" },
          { type: "String", value: "c" },
        ],
      });
    });

    test("array with mixed types", () => {
      const ast = parser(lexer('["string", 123, true, null]'));

      expect(ast).toEqual({
        type: "Array",
        value: [
          { type: "String", value: "string" },
          { type: "Number", value: 123 },
          { type: "Boolean", value: true },
          { type: "Null" },
        ],
      });
    });

    test("array with nested objects", () => {
      const ast = parser(lexer('[{ "a": 1 }, { "b": 2 }]'));

      expect(ast).toEqual({
        type: "Array",
        value: [
          {
            type: "Object",
            value: { a: { type: "Number", value: 1 } },
          },
          {
            type: "Object",
            value: { b: { type: "Number", value: 2 } },
          },
        ],
      });
    });
  });

  describe("string values", () => {
    test("empty string value", () => {
      const ast = parser(lexer('{ "key": "" }'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          key: { type: "String", value: "" },
        },
      });
    });

    test("string with newline escape sequence", () => {
      const ast = parser(lexer('{ "key": "line1\\nline2" }'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          key: { type: "String", value: "line1\nline2" },
        },
      });
    });

    test("string with carriage return escape sequence", () => {
      const ast = parser(lexer('{ "key": "line1\\rline2" }'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          key: { type: "String", value: "line1\rline2" },
        },
      });
    });

    test("string with tab escape sequence", () => {
      const ast = parser(lexer('{ "key": "col1\\tcol2" }'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          key: { type: "String", value: "col1\tcol2" },
        },
      });
    });

    test("string with multiple escape sequences combined", () => {
      const ast = parser(lexer('{ "key": "a\\tb\\nc\\rd" }'));

      expect(ast).toEqual({
        type: "Object",
        value: {
          key: { type: "String", value: "a\tb\nc\rd" },
        },
      });
    });

    test("array with escaped characters", () => {
      const ast = parser(lexer('["first\\n", "\\tsecond", "\\r\\n"]'));

      expect(ast).toEqual({
        type: "Array",
        value: [
          { type: "String", value: "first\n" },
          { type: "String", value: "\tsecond" },
          { type: "String", value: "\r\n" },
        ],
      });
    });
  });

  describe("number variants", () => {
    test("negative numbers", () => {
      const ast = parser(lexer("-123"));

      expect(ast).toEqual({ type: "Number", value: -123 });
    });

    test("floating-point numbers", () => {
      const ast = parser(lexer("123.45"));

      expect(ast).toEqual({ type: "Number", value: 123.45 });
    });

    test("scientific notation", () => {
      const ast = parser(lexer("1.2e3"));

      expect(ast).toEqual({ type: "Number", value: 1.2e3 });
    });
  });

  describe("error cases", () => {
    test("parser error: premature end of input", () => {
      expect(() => parser(lexer('{"a":'))).toThrow();
    });

    test("parser error: missing colon after key", () => {
      expect(() => parser(lexer('{"a" 1}'))).toThrow();
    });

    test("parser error: invalid token sequence", () => {
      expect(() => parser(lexer('{"a":}'))).toThrow();
    });

    test("parser error: unexpected token type", () => {
      expect(() => parser(lexer('{:"value"}'))).toThrow();
    });

    test("parser error: trailing comma in object", () => {
      expect(() => parser(lexer('{"a": 1,}'))).toThrow();
    });

    test("parser error: leading comma in object", () => {
      expect(() => parser(lexer('{,"a": 1}'))).toThrow();
    });

    test("parser error: missing comma between array elements", () => {
      expect(() => parser(lexer('["a" "b"]'))).toThrow();
    });

    test("parser error: unclosed object", () => {
      expect(() => parser(lexer('{"a": 1'))).toThrow();
    });

    test("parser error: unclosed array", () => {
      expect(() => parser(lexer('[1, 2'))).toThrow();
    });
  });
});
