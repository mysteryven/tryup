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

  parse() {

  }

  skipWhite() {

  }

  finishToken() {

  }

  next() {

  }
}