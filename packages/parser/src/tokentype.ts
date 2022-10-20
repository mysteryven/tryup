type TokenLabel = 
 | 'num' | 'string' | 'name' 
 | 'eof' 
 | 'braceL' | 'braceR'
 | 'var' | 'const'

export class TokenType {
  label: TokenLabel
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

  _const: new TokenType('const'),
  _var: new TokenType('var')
}

export const keywordTypes = {
  const: types._const,
  var: types._var
}