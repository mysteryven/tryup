// https://github.com/estree/estree/blob/master/es5.md
export class Node {
  type: string
  end = 0

  constructor(public start: number){}
}