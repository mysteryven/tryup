type TokenLabel = 
 | 'num' | 'string' | 'name' 
 | 'eof' 
 | 'braceL' | 'braceR'

export class TokenType {
  label: TokenLabel
  constructor(label: TokenLabel) {
    this.label = label
  }
}

export const types = {
  num: new TokenType('num'),
  string: new TokenType('string'),
  eof: new TokenType('eof'),
  braceL: new TokenType('braceL'),
  braceR: new TokenType('braceR')
}