import { Parser } from './parser'
import { types as tt } from './tokentype'
import { AssignmentExpression, ExportAllDeclaration, ExportDeclarationUnion, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, Identifier, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, ImportSpecifierUnion, Literal, Node, VariableDeclaration, VariableDeclarator, VariableKind } from './node'
import { empty } from './utils'

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

  case tt._import:
    return parseImport(this, node as ImportDeclaration)
  case tt._export:
    return parseExport(this, node as ExportDeclarationUnion)
  }

  throw new Error('not support this type now')
}

function parseExport(context: Parser, node: ExportDeclarationUnion) { 
  context.next()
  // export * from '...'
  if (context.eat(tt.star)) {
    if (context.eatContextual('as')) {
      throw new Error('not support now') 
    } else {
      (node as ExportAllDeclaration).exported = null
    }

    context.expectContextual('from');
    (node as ExportAllDeclaration).source = parseLiteral(context, context.value as string)
    return context.finishNode(node, 'ExportAllDeclaration')
  }

  // export default from '...'
  if (context.eat(tt._default)) {
    (node as ExportDefaultDeclaration).declaration = parseMaybeAssign(context)
    return context.finishNode(node, 'ExportDefaultDeclaration')
  }
  
  // export { x, y as z } [from '...'] 
  (node as ExportNamedDeclaration).declaration = null
  ;(node as ExportNamedDeclaration).specifiers = parseExportSpecifiers(context)

  if (context.eatContextual('from')) {
    (node as ExportNamedDeclaration).source = parseLiteral(context, context.value as string)
  } else {
    throw new Error('expect from keyword, export syntax error!')
  }
  
  return context.finishNode(node, 'ExportNamedDeclaration')
}

function parseExportSpecifiers(context: Parser) {
  const nodes: ExportSpecifier[] = []

  context.expect(tt.braceL)
  let first = true

  while(!context.eat(tt.braceR)) {
    if (!first) {
      context.expect(tt.comma)
    } else {
      first = false
    }

    const node = context.startNode() as ExportSpecifier
    node.local = parseIdent(context)
    node.exported = context.eatContextual('as') ? parseIdent(context) : node.local
    nodes.push(context.finishNode(node, 'ExportSpecifier') as ExportSpecifier)
  }

  return nodes
}

function parseImport(context: Parser, node: ImportDeclaration) {
  context.next()
  if (context.type === tt.string) {
    node.specifiers = empty 
    node.source = parseLiteral(context, context.value as string) 
  } else {
    node.specifiers = parseImportSpecifiers(context)
    context.expectContextual('from') 

    node.source = parseLiteral(context, context.value as string)
  }

  return context.finishNode(node, 'ImportDeclaration')
}

function parseImportSpecifiers(context: Parser): ImportSpecifierUnion[] {
  const nodes: any[] = [] 

  // import a from ''
  if (context.type === tt.name) {
    const node = context.startNode() as ImportDefaultSpecifier
    node.local = parseIdent(context)
    nodes.push(context.finishNode(node, 'ImportDefaultSpecifier'))
    if (!context.eat(tt.comma)) return nodes
  }
  if (context.type === tt.star) {
    const node = context.startNode() as ImportNamespaceSpecifier
    context.next()
    context.expectContextual('as')
    node.local = parseIdent(context)
    nodes.push(context.finishNode(node, 'ImportNamespaceSpecifier'))
    return nodes
  }
  context.expect(tt.braceL)
  let first = true
  while(!context.eat(tt.braceR)) {
    if (!first) {
      context.expect(tt.comma)
    } else {
      first = false
    }

    const node = context.startNode() as ImportSpecifier
    node.imported = parseIdent(context)
    if (context.eatContextual('as')) {
      node.local = parseIdent(context)
    } else {
      node.local = node.imported
    }
    nodes.push(context.finishNode(node, 'ImportSpecifier'))
  }

  return nodes 
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
  const startPos = context.start

  const left = parseExprAtom(context)

  if (context.type?.isAssign) {
    const node = context.startNodeAt(startPos) as AssignmentExpression
    node.operator = context.value as any
    node.left = left
    context.next()
    node.right = parseMaybeAssign(context)

    return context.finishNode(node, 'AssignmentExpression')
  }

  return left
}

function parseExprAtom(context: Parser) {
  switch(context.type) {
  case tt.num:
  case tt.string:
    return parseLiteral(context, context.value!)
  case tt.name:
    return parseIdent(context)
  }

  
  throw new Error('not support this type now')
}


function parseLiteral(context: Parser, value: string | number) {
  const node = context.startNode() as Literal
  node.value = value
  node.raw = context.input.slice(context.start, context.end)
  context.next()
  return context.finishNode(node, 'Literal') as Literal
}

function parseVarId(context: Parser, decl: VariableDeclarator) {
  decl.id = parseBindingAtom(context)
}

function parseBindingAtom(context: Parser) {

  return parseIdent(context)
}

function parseIdent(context: Parser): Identifier  {
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