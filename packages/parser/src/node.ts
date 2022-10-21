// https://github.com/estree/estree/blob/master/es5.md
export class Node {
  type: string
  end = 0
  body: Node[] | undefined
  declarations: Node[] | undefined
  kind: string | undefined
  init: Node | undefined | null
  id: Node | undefined
  value: number | string | undefined
  raw: string | undefined
  name: string | undefined

  constructor(public start: number){}
}
