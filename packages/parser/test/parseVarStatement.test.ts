import {describe, expect, test} from 'vitest'
import { Parser } from '../src/parser'


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
      'sourceType': 'module'
    })
  })
})