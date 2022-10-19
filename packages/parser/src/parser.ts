import { Node } from './node'
import { isNewLine } from './utils'
export class Parser {
  input: string
  start = 0
  end = 0
  pos = 0

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

  finishToken() {
    
  }

  // https://262.ecma-international.org/6.0/#sec-ecmascript-language-source-code
  // A chinese blog explains the JS encoding: https://www.ruanyifeng.com/blog/2014/12/unicode.html
  readWord() {

  } 

  next() {

  }

  nextToken() {

  }
}