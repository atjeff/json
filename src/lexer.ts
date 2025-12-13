export type TokenType =
  | "OPEN_BRACE"
  | "CLOSE_BRACE"
  | "OPEN_BRACKET"
  | "CLOSE_BRACKET"
  | "STRING"
  | "NUMBER"
  | "COMMA"
  | "COLON"
  | "TRUE"
  | "FALSE"
  | "NULL";

export type Token = {
  type: TokenType;
  value: string | number;
};

/**
 * The purpose of a lexer is to break down string input into an array of valid "tokens".
 * In this case, it's tokens valid to the JSON spec.
 */
export function lexer(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < input.length) {
    let char = input[current];

    if (!char) {
      break;
    }

    if (char === "{") {
      tokens.push({ type: "OPEN_BRACE", value: char });
      current++;
      continue;
    }

    if (char === "}") {
      tokens.push({ type: "CLOSE_BRACE", value: char });
      current++;
      continue;
    }

    if (char === "[") {
      tokens.push({ type: "OPEN_BRACKET", value: char });
      current++;
      continue;
    }

    if (char === "]") {
      tokens.push({ type: "CLOSE_BRACKET", value: char });
      current++;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "COMMA", value: char });
      current++;
      continue;
    }

    if (char === ":") {
      tokens.push({ type: "COLON", value: char });
      current++;
      continue;
    }

    if (char === '"') {
      // Start of a string literal
      let value = "";

      // Skip the first double quote
      char = input[++current];

      // Read until the next double quote
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "STRING", value });
      current++;
      continue;
    }

    // This should be a number, boolean, or null
    if (/[\d\w]/.test(char)) {
      let value = "";
      while (char && /[\d\w]/.test(char)) {
        value += char;
        char = input[++current];
      }

      if (Number.isInteger(Number(value))) {
        tokens.push({ type: "NUMBER", value: Number(value) });
      } else if (value === "true") {
        tokens.push({ type: "TRUE", value: "true" });
      } else if (value === "false") {
        tokens.push({ type: "FALSE", value: "false" });
      } else if (value === "null") {
        tokens.push({ type: "NULL", value: "null" });
      } else {
        throw new Error(`Unexpected token: ${value}`);
      }

      continue;
    }

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    throw new Error("Unexpected token: " + char);
  }

  return tokens;
}
