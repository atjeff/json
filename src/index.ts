import { lexer } from "./lexer";
import { parser, type ASTNode } from "./parser";

export function parseJson(input: string): unknown {
  const tokens = lexer(input);
  const ast = parser(tokens);

  return astToValue(ast);
}


function astToValue(node: ASTNode): unknown {
  switch (node.type) {
    case "Object": {
      const obj: { [key: string]: unknown } = {};

      for (const [key, value] of Object.entries(node.value)) {
        obj[key] = astToValue(value);
      }

      return obj;
    }
    
    case "Array": {
      return node.value.map(astToValue);
    }
    
    case "String": {
      return node.value;
    }
    
    case "Number": {
      return node.value;
    }
    
    case "Boolean": {
      return node.value;
    }
    
    case "Null": {
      return null;
    }
  }
}
