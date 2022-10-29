import ModuleLoader from './ModuleLoader'
import { type InputOptions } from './rollup/types'
export default class Graph {
  moduleLoader: ModuleLoader

  constructor(private readonly options: InputOptions) {
    this.moduleLoader = new ModuleLoader(this.options)
  }

  build() {
    console.log('build')
  }
}