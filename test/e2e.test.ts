import { describe, expect, test } from "bun:test";
import { parseJson } from "../src";
import { TEST_CASES } from "./test-cases";

function tester(jsonString: string) {
  // Parse the string in our lib
  const actual = parseJson(jsonString);

  // Parse the string with V8
  const expected = JSON.parse(jsonString);

  // Stringify ours with V8 (check for error)
  JSON.stringify(actual);

  // Compare ours to V8 and snapshot
  expect(actual).toEqual(expected);

  return actual;
}

describe("e2e", () => {
  test.each(TEST_CASES)("should match V8 implementation", (t) => {
    expect(() => {
      const actual = tester(t);

      expect(actual).toMatchSnapshot();
    }).not.toThrowError();
  });

  test("deeply nested object", () => {
    let json = '{"a":1}';

    for (let i = 0; i < 15; i++) {
      json = `{"nested": ${json}}`;
    }

    expect(() => tester(json)).not.toThrowError();
  });

  test("deeply nested array", () => {
    let json = "[1]";

    for (let i = 0; i < 15; i++) {
      json = `[${json}]`;
    }

    expect(() => tester(json)).not.toThrowError();
  });

  test("large array with 100 elements", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const json = JSON.stringify(items);

    expect(() => tester(json)).not.toThrowError();
  });

  test("large object with 100 keys", () => {
    const obj = Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [`key${i}`, i]),
    );
    const json = JSON.stringify(obj);

    expect(() => tester(json)).not.toThrowError();
  });

  test("long string with 10000 characters", () => {
    const longString = "a".repeat(10000);
    const json = JSON.stringify(longString);

    expect(() => tester(json)).not.toThrowError();
  });
});
