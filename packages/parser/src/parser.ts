import { Node } from './node'
import { keywordTypes, TokenType, types as tt } from './tokentype'
import { isIdentifierChar, isIdentifierStart, isNewLine, wordsRegexp } from './utils'
export class Parser {
  input: string
  start = 0
  end = 0
  pos = 0
  type?: TokenType
  keywords = wordsRegexp()
  value: string | undefined

  constructor(input: string) {
    this.input = input
  }

  static parse(input: string) {
    return new this(input).parse()
  }

  startNode() {
    return new Node(this.start)
  }
  parse(): Node {
    const node = this.startNode()

    return node
  }

  // Acorn uses charCode distinguish whether is a space (https://github.com/mysteryven/acorn/blob/fb6aa2afc527fcab2b1ea2e5b6168a28f797e72f/acorn/src/tokenize.js#L129)
  skipSpace() { 
    loop: while(this.pos < this.input.length) {
      const ch = this.input.charCodeAt(this.pos)
      switch (ch) {
      case 32: // ''
      case 160: // &nbsp
        ++this.pos
        break
      case 13: // '\r'
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos
        }
      case 10: case 8232: case 8233: // \n, '',''
        ++this.pos
        break
      case 47: // '/'
        switch (this.input.charCodeAt(this.pos + 1)) {
        case 42: // '*'
          this.skipBlockComment()
          break
        case 47:
          this.skipLineComment(2)
          break
        }
      default:
        break loop
      }
    }
  }

  skipBlockComment() {
    const end = this.input.indexOf('*/', this.pos += 2)
    if (end === -1) {
      throw new Error('Unterminated comment')
    }
    this.pos = end + 2
  }

  skipLineComment(startSkip: number) {
    let ch = this.input.charCodeAt(this.pos + startSkip)
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this.input.charCodeAt(++this.pos)
    }
  }
  nextToken() {
    this.skipSpace()
    this.start = this.pos
    if (this.pos >= this.input.length) {
      return this.finishToken(tt.eof)
    } 

    this.readToken(this.fullCharCodeAtPos())
  }
  readToken(code: number) {
    if (isIdentifierStart(code)) {
      return this.readWord()
    }

    return this.getTokenFromCode(code)
  }

  getTokenFromCode(code: number) {
    switch(code) {
    case 123: ++this.pos; return this.finishToken(tt.braceL)
    case 125: ++this.pos; return this.finishToken(tt.braceR)
    }
  }

  readWord() {
    const word = this.readWord1()
    let type = tt.name
    if (this.keywords.test(word)) {
      type = keywordTypes[word]
    }

    return this.finishToken(type, word)

  }
  readWord1() {
    const chunkStart = this.pos

    while (this.pos < this.input.length) {
      const ch = this.fullCharCodeAtPos()
      if (isIdentifierChar(ch)) {
        this.pos += ch <= 0xffff ? 1 : 2
      } else {
        break
      }
    }

    return this.input.slice(chunkStart, this.pos)
  }


  // A chinese blog explains the JS encoding: https://www.ruanyifeng.com/blog/2014/12/unicode.html
  // https://262.ecma-international.org/6.0/#sec-ecmascript-language-source-code
  // I didn't read the spec about String in above link, just paste it here :)
  fullCharCodeAtPos() {
    const code = this.input.charCodeAt(this.pos)
    if (code <= 0xd7ff || code >= 0xdc00) return code
    const next = this.input.charCodeAt(this.pos + 1)
    return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
  }


  finishToken(type: TokenType, value: string | undefined = undefined) {
    this.end = this.pos
    const prevType = this.type
    this.type = type
    this.value = value

    this.updateContext(prevType)
  }
  updateContext(prevType?: TokenType) {
    if (this.type?.updateContext) {
      this.type.updateContext.call(this, prevType)
    }
  }

  next() {
    this.nextToken()
  }
}