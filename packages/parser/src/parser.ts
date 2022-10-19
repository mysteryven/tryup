import { Node } from './node'
export class Parser {
  input: string
  start = 0
  end = 0

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

  skipWhite() {

  }

  finishToken() {

  }

  next() {

  }
}