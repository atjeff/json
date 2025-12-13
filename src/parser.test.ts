import { describe, expect, test } from "bun:test";
import { lexer } from "./lexer";
import { parser } from "./parser";

describe("parser", () => {
  test("empty object", () => {
    const ast = parser(lexer("{}"));

    expect(ast).toEqual({ type: "Object", value: {} });
  });

  test("empty array", () => {
    const ast = parser(lexer("[]"));

    expect(ast).toEqual({ type: "Array", value: [] });
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
});
