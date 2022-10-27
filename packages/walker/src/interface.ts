export interface BaseNode {
  type: string;
  range?: [number, number];
}

export type SyncHandler = ( 
  this: any, // TODO remain add context next
  node: BaseNode,
  parent?: BaseNode,  
  key?: string,
  index?: number
) => void


export interface WalkerHooks {
  enter?: SyncHandler;
  leave?: SyncHandler
}