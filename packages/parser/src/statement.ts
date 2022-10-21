import { Parser } from './parser'
import { types as tt } from './tokentype'
import { Identifier, Literal, Node, VariableDeclaration, VariableDeclarator, VariableKind } from './node'

// will called from parser by `parserStatement.call(this)`
export function parseStatement(this: Parser) {
  let startType = this.type
  const node = this.startNode()
  let kind: string = this.value as string

  if (isLet(this)) {
    startType = tt._var
    kind = 'let'
  }

  switch (startType) {
  case tt._const: case tt._var:
    return parseVarStatement(this, node as VariableDeclaration, kind as unknown as VariableKind)
  }

  throw new Error('not support this type now')
}

function parseVarStatement(context: Parser, node: VariableDeclaration, kind: VariableKind) {
  context.next()
  parseVar(context, node, kind)
  return context.finishNode(node, 'VariableDeclaration')
}

function parseVar(context: Parser, node: VariableDeclaration, kind: VariableKind) {
  node.declarations = []
  node.kind = kind
  for (;;) {
    const decl = context.startNode() as VariableDeclarator
    parseVarId(context, decl)

    if (context.eat(tt.eq)) {
      decl.init = parseMaybeAssign(context)
    } else {
      decl.init = null
    }
    node.declarations.push(context.finishNode(decl, 'VariableDeclarator') as VariableDeclarator)
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

  throw new Error('not support this type now')
}


function parseLiteral(context: Parser, value: string | number) {
  const node = context.startNode() as Literal
  node.value = value
  node.raw = context.input.slice(context.start, context.end)
  context.next()
  return context.finishNode(node, 'Literal')
}

function parseVarId(context: Parser, decl: VariableDeclarator) {
  decl.id = parseBindingAtom(context)
}

function parseBindingAtom(context: Parser) {

  return parseIdent(context)
}

function parseIdent(context: Parser): Node {
  const node = context.startNode() as Identifier
  if (context.type === tt.name) {
    node.name = context.value as string
  } else if (context.type?.keyword) {
    node.name = context.type.keyword
  }

  context.next()
  context.finishNode(node, 'Identifier')
  return node
}

export function isLet(context: Parser) {
  return context.isContextual('let')
}