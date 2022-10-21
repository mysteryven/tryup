import {describe, expect, test} from 'vitest'
import { Parser } from '../src/parser'

describe('Parser', () => {
  test('skipBockComment', () => {
    const code1 = '  /* hello world */'
    let parser = new Parser(code1)

    parser.skipBlockComment()
    expect(parser.pos).toBe(code1.length)
    const code2 = '   /* hello world'

    parser = new Parser(code2)
    expect(() => {
      parser.skipBlockComment()
    }).toThrowError('Unterminated comment')
  })

  test('skipLineComment', () => {
    const code1 = '// hello world \n'
    const parser = new Parser(code1)
    parser.skipLineComment(2)
    expect(parser.pos).toBe(code1.indexOf('\n'))
  })

  test('skip space', () => {
    const code1 = `
      let a = 1; // this is a comment\nconsole.log(a)
    `

    const parser = new Parser(code1)
    parser.skipSpace()
    expect(parser.pos).toBe(code1.indexOf('l'))
    parser.pos = code1.indexOf(';') + 1
    parser.skipSpace()
    expect(parser.input.charCodeAt(parser.pos)).toBe(10)
  })
})


describe('when parse a variable statement', () => {
  test('parse const a = 1', () => {
    const code = 'let a = 1'
    debugger
    const result = Parser.parse(code)
    console.log(result)
    expect(Parser.parse(code)).toMatchInlineSnapshot(`
      Node {
        "body": [
          Node {
            "body": undefined,
            "declarations": [
              Node {
                "body": undefined,
                "declarations": undefined,
                "end": 9,
                "id": Node {
                  "body": undefined,
                  "declarations": undefined,
                  "end": 7,
                  "id": undefined,
                  "init": undefined,
                  "kind": undefined,
                  "name": "a",
                  "raw": undefined,
                  "start": 4,
                  "type": "Identifier",
                  "value": undefined,
                },
                "init": Node {
                  "body": undefined,
                  "declarations": undefined,
                  "end": 9,
                  "id": undefined,
                  "init": undefined,
                  "kind": undefined,
                  "name": undefined,
                  "raw": "1",
                  "start": 8,
                  "type": "Literal",
                  "value": 1,
                },
                "kind": undefined,
                "name": undefined,
                "raw": undefined,
                "start": 4,
                "type": "VariableDeclarator",
                "value": undefined,
              },
            ],
            "end": 9,
            "id": undefined,
            "init": undefined,
            "kind": "let",
            "name": undefined,
            "raw": undefined,
            "start": 0,
            "type": "VariableDeclaration",
            "value": undefined,
          },
        ],
        "declarations": undefined,
        "end": 9,
        "id": undefined,
        "init": undefined,
        "kind": undefined,
        "name": undefined,
        "raw": undefined,
        "start": 0,
        "type": "Program",
        "value": undefined,
      }
    `)
  })
})