import {describe, it, assert, expect} from 'vitest' 
import { walk } from '../src'

describe('AST Walker', () => {  
  it('walks an AST', () => {
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'a' },
              init: { type: 'Literal', value: 1, raw: '1' }
            },
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'b' },
              init: { type: 'Literal', value: 2, raw: '2' }
            }
          ],
          kind: 'var'
        }
      ],
      sourceType: 'module'
    }

    const entered: any = []
    const left: any = []

    walk(ast, {
      enter(node) {
        entered.push(node)
      },
      leave(node) {
        left.push(node)
      }
    })

    expect(entered).toStrictEqual([
      ast,
      ast.body[0],
      ast.body[0].declarations[0],
      ast.body[0].declarations[0].id,
      ast.body[0].declarations[0].init,
      ast.body[0].declarations[1],
      ast.body[0].declarations[1].id,
      ast.body[0].declarations[1].init
    ])

    expect(left).toStrictEqual([
      ast.body[0].declarations[0].id,
      ast.body[0].declarations[0].init,
      ast.body[0].declarations[0],
      ast.body[0].declarations[1].id,
      ast.body[0].declarations[1].init,
      ast.body[0].declarations[1],
      ast.body[0],
      ast
    ])
  })
})


