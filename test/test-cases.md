# JSON Parser Test Cases

## Lexer Tests (`src/lexer.test.ts`)

### Structural Tokens

- [x] **Empty object** - `{}` tokenizes to `OPEN_BRACE`, `CLOSE_BRACE`
- [x] **Empty array** - `[]` tokenizes to `OPEN_BRACKET`, `CLOSE_BRACKET`
- [x] **Colon** - `:` tokenizes to `COLON` token
- [x] **Comma** - `,` should tokenize to `COMMA` token

### Primitive Values

- [x] **String** - `"hello"` tokenizes to single `STRING` token
- [x] **Number** - `123` tokenizes to single `NUMBER` token
- [x] **Boolean** - `true` and `false` tokenize to `TRUE`/`FALSE` tokens
- [x] **Null** - `null` tokenizes to single `NULL` token

### String Features

- [x] **Empty string** - `""` should tokenize to `STRING` with empty value
- [x] **String with spaces inside** - `"hello world"` (already works but not explicitly tested)
- [x] **String escape sequences** - `"hello\nworld"` should handle `\n`
- [x] **Escaped quotes** - `"say \"hello\""` should handle escaped quotes
- [x] **Backslash escape** - `"path\\to\\file"` should handle `\\`
- [x] **Unicode strings** - `"\u0048\u0065\u006C\u006C\u006F"` should decode correctly
- [x] **Long strings** - strings with 10,000+ characters

### Number Variants

- [x] **Negative numbers** - `-123` should tokenize to `NUMBER` with value `-123`
- [x] **Floating-point numbers** - `123.45` should tokenize correctly
- [x] **Scientific notation** - `1.2e3` or `1.2E+3` should tokenize correctly

### Whitespace

- [x] **Whitespace** - whitespace is properly ignored between tokens
- [x] **Whitespace-only input** - `"   "` should handle or throw gracefully

### Error Handling

- [x] **Unexpected characters** - invalid characters throw `"Unexpected token"` error

### Complex Structures

- [x] **Object with key and number** - `{"test":123}` tokenizes correctly
- [x] **Object with key and empty object** - `{"test":{}}` tokenizes nested structure
- [x] **Array with multiple elements** - `[1, 2, 3]` tokenization
- [x] **Array with strings** - `["a", "b"]` tokenization

## Parser Tests (`src/parser.test.ts`)

### Structural Tokens

- [x] **Empty object** - `{}` parses to `{ type: "Object", value: {} }`
- [x] **Empty array** - `[]` parses to `{ type: "Array", value: [] }`

### Primitive Values

- [x] **Object with single boolean** - `{"test": true}` parses correctly
- [x] **Mixed value types** - object containing String, Number, Array, Boolean, Null

### Complex Structures

- [x] **Nested object** - `{"test": {"test2":true}}` parses nested structure
- [x] **Object with empty array** - `{ "test": [] }` parses correctly
- [x] **Complex nested object** - deeply nested JSON structure with arrays and objects
- [x] **Object with multiple key-value pairs** - `{ "a": 1, "b": 2 }` should parse correctly
- [x] **Array with multiple elements** - `["a", "b", "c"]` should parse to Array with 3 String nodes
- [x] **Array with mixed types** - `["string", 123, true, null]` should parse correctly
- [x] **Array with nested objects** - `[{ "a": 1 }, { "b": 2 }]` should parse correctly
- [x] **Deeply nested structures** - JSON with 10+ levels of nesting
- [x] **Large arrays** - arrays with 100+ elements
- [x] **Large objects** - objects with 100+ keys

### String Values

- [x] **Empty string value** - `{ "key": "" }` should have `String` node with empty value

### Number Variants

- [x] **Negative numbers** - parse negative integers correctly
- [x] **Floating-point numbers** - parse `123.45` as Number node
- [x] **Scientific notation** - parse `1.2e3` as Number node

### Error Cases

- [x] **Empty input** - `""` should handle or throw gracefully
- [x] **Trailing comma handling** - `{"a": 1,}` currently might not error properly
- [x] **Leading comma handling** - `{, "a": 1}` should error
- [x] **Missing comma between elements** - `["a" "b"]` should error
- [x] **Unclosed object** - `{"a": 1` should error
- [x] **Unclosed array** - `[1, 2` should error
- [x] **Parser error: premature end of input** - passing incomplete tokens should throw
- [x] **Parser error: missing colon after key** - `{"a" 1}` should throw error
- [x] **Parser error: invalid token sequence** - `{"a":}` or `{:"value"}` should throw error
- [x] **Parser error: unexpected token type** - raw tokens with wrong sequence should throw