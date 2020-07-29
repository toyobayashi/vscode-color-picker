import { Configuration } from '@tybys/ty'
import * as path from 'path'

const config: Configuration = {
  ts: 0,
  entry: {
    web: {
      main: [path.join(__dirname, 'test/index.js')]
    }
  },
  output: {
    web: 'docs'
  },
  configureWebpack: {
    web (conf) {
      conf.node = false
      // conf.optimization.minimize = false
    }
  }
}

export default config
