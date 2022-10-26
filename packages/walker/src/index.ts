import { BaseNode, SyncHandler } from './interface'


export default class Walker {
  enter?: SyncHandler
  leave?: SyncHandler

  constructor({enter, leave}: {enter?: SyncHandler, leave?: SyncHandler}) {
    this.enter = enter
    this.leave = leave
  }

  visit(node: BaseNode, parent?: BaseNode, prop?: string, index?: number) {
    if (this.enter) {
      this.enter(node, parent, prop, index)
    }

    let key: keyof typeof node
    for (key in node) {
      const value = node[key] as any

      if (typeof value !== 'object') {
        continue
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
          if (value[i] !== null ) {
            if (!this.visit(value[i], node, key, i)) {
      } else if (value !== null) {
            this.visit(value[i], node, key)
      } 
    }

    if (this.leave) {
      this.leave(node, parent, prop, index)
    }

    return node
  }


}