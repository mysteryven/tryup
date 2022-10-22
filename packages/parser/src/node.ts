// https://github.com/estree
export function createNode(start = 0): Node {
  return {
    start,
    end: 0
  }
}
export interface Node {
  type?: string;
  start: number;
  end: number;
  body?: Node[];
}

export type Pattern = Node
export type Expression = Node
export type Statement = Node
export type Declaration = Statement

export interface Identifier extends Expression {
  type: 'Identifier';
  name: string
}

export type VariableKind = 'var' | 'let' | 'const'

export interface VariableDeclaration extends Declaration {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: VariableKind;
}

export interface VariableDeclarator extends Node{
  type: 'VariableDeclarator';
  id: Pattern;
  init: Expression | null;
}

export interface Literal extends Expression  {
  type: 'Literal';
  value: string | boolean | null | number | RegExp;
  raw: string
}

export function beType<T>(node: Node) {
  return node as unknown as T
}

export type ModuleDeclaration = Node 
export interface ModuleSpecifier extends Node {
  local: Identifier;
}

export interface ImportDeclaration extends ModuleDeclaration {
  type: 'ImportDeclaration';
  specifiers: (ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier)[];
  source: Literal;
}

export interface ImportSpecifier extends ModuleSpecifier {
  type: 'ImportSpecifier';
  imported: Identifier;
}

export interface ImportDefaultSpecifier extends ModuleSpecifier {
  type: 'ImportDefaultSpecifier';
}

export interface ImportNamespaceSpecifier extends ModuleSpecifier {
  type: 'ImportNamespaceSpecifier';
}

export type ImportSpecifierUnion = ImportDefaultSpecifier | ImportSpecifier | ImportNamespaceSpecifier

export interface ExportNamedDeclaration extends ModuleDeclaration {
  type: 'ExportNamedDeclaration';
  declaration: Declaration | null;
  specifiers: ExportSpecifier [];
  source: Literal | null;
}

export interface ExportSpecifier extends ModuleSpecifier {
  type: 'ExportSpecifier';
  exported: Identifier;
}

export interface ExportAllDeclaration extends ModuleDeclaration {
  type: 'ExportAllDeclaration';
  source: Literal;
}

export interface ExportDefaultDeclaration extends ModuleDeclaration {
  type: 'ExportDefaultDeclaration';
  declaration: Expression; // TODO only support Expression now, maybe add another in the future.
}

export type ExportDeclarationUnion = ExportDefaultDeclaration | ExportNamedDeclaration | ExportAllDeclaration