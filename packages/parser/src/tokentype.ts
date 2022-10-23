type TokenLabel = 
 | 'num' | 'string' | 'name' 
 | 'eof' 
 | 'braceL' | 'braceR'
 | 'var' | 'const' | 'import' | 'export' | 'default'
 | '=' | ',' | '*'

export class TokenType {
  label: TokenLabel
  keyword?: string
  updateContext: {(): void} | null = null 
  constructor(label: TokenLabel) {
    this.label = label
  }
}

export const types = {
  num: new TokenType('num'),
  string: new TokenType('string'),
  eof: new TokenType('eof'),
  braceL: new TokenType('braceL'),
  braceR: new TokenType('braceR'),
  name: new TokenType('name'),

  eq: new TokenType('='),
  comma: new TokenType(','),
  star: new TokenType('*'),

  _const: new TokenType('const'),
  _var: new TokenType('var'),
  _import: new TokenType('import'),
  _export: new TokenType('export'),
  _default: new TokenType('default')

}

export const keywordTypes = {
  const: types._const,
  var: types._var,
  import: types._import,
  export: types._export,
  default: types._default
}