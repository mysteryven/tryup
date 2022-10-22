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
    expect(Parser.parse(code)).toStrictEqual({
      'type': 'Program',
      'start': 0,
      'end': 9,
      'body': [
        {
          'type': 'VariableDeclaration',
          'start': 0,
          'end': 9,
          'declarations': [
            {
              'type': 'VariableDeclarator',
              'start': 4,
              'end': 9,
              'id': {
                'type': 'Identifier',
                'start': 4,
                'end': 5,
                'name': 'a'
              },
              'init': {
                'type': 'Literal',
                'start': 8,
                'end': 9,
                'value': 1,
                'raw': '1'
              }
            }
          ],
          'kind': 'let'
        }
      ],
    })
  })
})

describe('when parse a ImportDeclaration', () => {
  test('import string', () => {
    const code = 'import "a.js"'
    expect(Parser.parse(code)).toStrictEqual({
      'type': 'Program',
      'start': 0,
      'end': 13,
      'body': [
        {
          'type': 'ImportDeclaration',
          'start': 0,
          'end': 13,
          'specifiers': [],
          'source': {
            'type': 'Literal',
            'start': 7,
            'end': 13,
            'value': 'a.js',
            'raw': '"a.js"'
          }
        }
      ],
    })
  })
})