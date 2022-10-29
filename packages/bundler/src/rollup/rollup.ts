import Graph from '../Graph'
import Bundle from '../Bundle'
import { type InputOptions } from './types'

export function rollup() {
  return rollupInternal()
}

function rollupInternal() {
  const inputOptions: InputOptions = {
    entry: './a.js'
  }
  const graph = new Graph(inputOptions) 

  

  graph.build()

  const bundle = new Bundle(graph)
  bundle.generate()
}