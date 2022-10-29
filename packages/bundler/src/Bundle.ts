import Graph from './Graph'

export default class Bundle {
  constructor(private readonly graph: Graph){}

  generate() {
    console.log('generate')
  }
}