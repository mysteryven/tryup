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

  test('default import', () => {
    const code = 'import a from "a.js"'
    expect(Parser.parse(code)).toStrictEqual(
      {
        'type': 'Program',
        'start': 0,
        'end': 20,
        'body': [
          {
            'type': 'ImportDeclaration',
            'start': 0,
            'end': 20,
            'specifiers': [
              {
                'type': 'ImportDefaultSpecifier',
                'start': 7,
                'end': 8,
                'local': {
                  'type': 'Identifier',
                  'start': 7,
                  'end': 8,
                  'name': 'a'
                }
              }
            ],
            'source': {
              'type': 'Literal',
              'start': 14,
              'end': 20,
              'value': 'a.js',
              'raw': '"a.js"'
            }
          }
        ],
      }
    )
  })

  test('default and normal import', () => {
    const code = 'import a, {b} from "a.js"'

    expect(Parser.parse(code)).toStrictEqual(
      {
        'type': 'Program',
        'start': 0,
        'end': 25,
        'body': [
          {
            'type': 'ImportDeclaration',
            'start': 0,
            'end': 25,
            'specifiers': [
              {
                'type': 'ImportDefaultSpecifier',
                'start': 7,
                'end': 8,
                'local': {
                  'type': 'Identifier',
                  'start': 7,
                  'end': 8,
                  'name': 'a'
                }
              },
              {
                'type': 'ImportSpecifier',
                'start': 11,
                'end': 12,
                'imported': {
                  'type': 'Identifier',
                  'start': 11,
                  'end': 12,
                  'name': 'b'
                },
                'local': {
                  'type': 'Identifier',
                  'start': 11,
                  'end': 12,
                  'name': 'b'
                }
              }
            ],
            'source': {
              'type': 'Literal',
              'start': 19,
              'end': 25,
              'value': 'a.js',
              'raw': '"a.js"'
            }
          }
        ]
      }
    )
  })

  test('name import', () => {
    const code = 'import * as a from "a.js"'

    expect(Parser.parse(code)).toStrictEqual(
      {
        'type': 'Program',
        'start': 0,
        'end': 25,
        'body': [
          {
            'type': 'ImportDeclaration',
            'start': 0,
            'end': 25,
            'specifiers': [
              {
                'type': 'ImportNamespaceSpecifier',
                'start': 7,
                'end': 13,
                'local': {
                  'type': 'Identifier',
                  'start': 12,
                  'end': 13,
                  'name': 'a'
                }
              }
            ],
            'source': {
              'type': 'Literal',
              'start': 19,
              'end': 25,
              'value': 'a.js',
              'raw': '"a.js"'
            }
          }
        ],
      }
    )
  })
})

describe('when parse a ExportDeclaration', () => {
  test('export * from ...', () => {
    const code = 'export * from "a.js"'
    expect(Parser.parse(code)).toStrictEqual(
      {
        'type': 'Program',
        'start': 0,
        'end': 20,
        'body': [
          {
            'type': 'ExportAllDeclaration',
            'start': 0,
            'end': 20,
            'exported': null,
            'source': {
              'type': 'Literal',
              'start': 14,
              'end': 20,
              'value': 'a.js',
              'raw': '"a.js"'
            }
          }
        ],
      }
    ) 
  })

  test('export default from ...', () => {
    let code = 'export default a = 1'
    expect(Parser.parse(code)).toStrictEqual({
      'type': 'Program',
      'start': 0,
      'end': 20,
      'body': [
        {
          'type': 'ExportDefaultDeclaration',
          'start': 0,
          'end': 20,
          'declaration': {
            'type': 'AssignmentExpression',
            'start': 15,
            'end': 20,
            'operator': '=',
            'left': {
              'type': 'Identifier',
              'start': 15,
              'end': 16,
              'name': 'a'
            },
            'right': {
              'type': 'Literal',
              'start': 19,
              'end': 20,
              'value': 1,
              'raw': '1'
            }
          }
        }
      ]
    }) 

    code = 'export default 1'
    expect(Parser.parse(code)).toStrictEqual({
      'type': 'Program',
      'start': 0,
      'end': 16,
      'body': [
        {
          'type': 'ExportDefaultDeclaration',
          'start': 0,
          'end': 16,
          'declaration': {
            'type': 'Literal',
            'start': 15,
            'end': 16,
            'value': 1,
            'raw': '1'
          }
        }
      ],
    })
  })

  test('export {} from ...', () => {
    const code = 'export {a, b as bb} from "c"'
    expect(Parser.parse(code)).toStrictEqual({
      'type': 'Program',
      'start': 0,
      'end': 28,
      'body': [
        {
          'type': 'ExportNamedDeclaration',
          'start': 0,
          'end': 28,
          'declaration': null,
          'specifiers': [
            {
              'type': 'ExportSpecifier',
              'start': 8,
              'end': 9,
              'local': {
                'type': 'Identifier',
                'start': 8,
                'end': 9,
                'name': 'a'
              },
              'exported': {
                'type': 'Identifier',
                'start': 8,
                'end': 9,
                'name': 'a'
              }
            },
            {
              'type': 'ExportSpecifier',
              'start': 11,
              'end': 18,
              'local': {
                'type': 'Identifier',
                'start': 11,
                'end': 12,
                'name': 'b'
              },
              'exported': {
                'type': 'Identifier',
                'start': 16,
                'end': 18,
                'name': 'bb'
              }
            }
          ],
          'source': {
            'type': 'Literal',
            'start': 25,
            'end': 28,
            'value': 'c',
            'raw': '"c"'
          }
        }
      ]
    }) 
  })
   
})