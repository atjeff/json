import type { Token } from "./lexer";

export type ASTNode =
  | { type: "Object"; value: { [key: string]: ASTNode } }
  | { type: "Array"; value: ASTNode[] }
  | { type: "String"; value: string }
  | { type: "Number"; value: number }
  | { type: "Boolean"; value: boolean }
  | { type: "Null" };

export function parser(tokens: Token[]): ASTNode {
  if (!tokens.length) {
    throw new Error("Unexpected end of input");
  }

  let current = 0;

  function advance(): Token {
    return tokens[++current]!;
  }

  function parseValue(): ASTNode {
    const token = tokens[current]!;

    switch (token.type) {
      case "STRING": {
        return { type: "String", value: String(token.value) };
      }

      case "NUMBER": {
        return { type: "Number", value: Number(token.value) };
      }

      case "TRUE": {
        return { type: "Boolean", value: true };
      }

      case "FALSE": {
        return { type: "Boolean", value: false };
      }

      case "NULL": {
        return { type: "Null" };
      }

      case "OPEN_BRACE": {
        return parseObject();
      }

      case "OPEN_BRACKET": {
        return parseArray();
      }

      default: {
        throw new Error(`Unexpected token type: ${token.type}`);
      }
    }
  }

  function parseObject() {
    const node: ASTNode = { type: "Object", value: {} };

    // Start iterating again until we finish the object
    // Skip the first OPEN_BRACE
    let token = advance();
    while (token.type !== "CLOSE_BRACE") {
      if (token.type === "STRING") {
        const key = token.value;

        token = advance();

        // Since this is a string, an object key, this should be a colon
        if (token.type !== "COLON") {
          throw new Error(
            `Invalid JSON inside object. Expected: ':', got: '${token.value}'`
          );
        }
        token = advance();

        // Recursively parse value
        const value = parseValue();
        node.value[key] = value;
      } else {
        throw new Error(
          `Expected String key in object. Token type: ${token.type}`
        );
      }

      token = advance();

      // Check for a comma to handle multiple key-value pairs
      if (token && token.type === "COMMA") {
        token = advance();
        if (token.type === "CLOSE_BRACE") {
          throw new Error("Unexpected token: }");
        }
      }
    }

    return node;
  }

  function parseArray() {
    const node: ASTNode = { type: "Array", value: [] };

    // Start iterating again until we finish the object
    // Skip the first OPEN_BRACKET
    let token = advance();
    while (token.type !== "CLOSE_BRACKET") {
      const value = parseValue();
      node.value.push(value);

      token = advance(); // Eat value or ','
      if (token.type === "COMMA") {
        token = advance(); // Eat ',' if present
      } else if (token.type !== "CLOSE_BRACKET") {
        throw new Error("Unexpected token");
      }
    }

    return node;
  }

  return parseValue();
}
