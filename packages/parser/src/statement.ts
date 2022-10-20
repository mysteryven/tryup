import { Parser } from './parser'
import { types as tt } from './tokentype'
import { Node } from './node'

// will called from parser by `parserStatement.call(this)`
export function parseStatement(this: Parser, context: Node) {
  let startType = this.type
  const node = this.startNode()
  let kind: string = this.value!

  if (isLet(this)) {
    startType = tt._var
    kind = 'let'
  }

  switch (startType) {
  case tt._const: case tt._var:
    return parseVarStatement(this, node, kind)
  }
}

function parseVarStatement(context: Parser, node: Node, kind: string) {
  context.next()
  parseVar(context, node, kind)
  return context.finishNode(node, 'VariableDeclaration')
}

function parseVar(context: Parser, node: Node, kind: string) {
  node.declarations = []
  node.kind = kind
  for (;;) {
    const decl = context.startNode()
    parseVarId(context, decl, kind)

    if (context.eat(tt.eq)) {
      decl.init = parseMaybeAssign(context)
    } else {
      decl.init = null
    }
    node.declarations.push(context.finishNode(decl, 'VariableDeclarator'))
    if (!context.eat(tt.comma)) break
  }
  return node
}

function parseMaybeAssign(context: Parser) {
  switch(context.type) {
  case tt.num:
  case tt.string:
    return parseLiteral(context, context.value!)
  }
}


function parseLiteral(context: Parser, value: string | number) {
  const node = context.startNode()
  node.value = value
  node.raw = this.input.slice(this.start, this.end)
  context.next()
  return context.finishNode(node, 'Literal')
}

function parseVarId(context: Parser, decl: Node, kind: string) {
  decl.id = parseBindingAtom(context)
}

function parseBindingAtom(context: Parser) {

  return parseIdent(context)
}

function parseIdent(context: Parser): Node {
  const node = this.startNode()
  if (this.type === tt.name) {
    node.name = this.value
  } else if (this.type.keyword) {
    node.name = this.type.keyword
  }

  context.next()
  this.finishNode(node, 'Identifier')
  return node
}

export function isLet(context: Parser) {
  return context.isContextual('let')
}