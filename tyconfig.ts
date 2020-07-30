import { Configuration } from '@tybys/ty'
import * as path from 'path'

const config: Configuration = {
  entry: {
    web: {
      main1: [path.join(__dirname, 'test/index.js')],
      main2: [path.join(__dirname, 'test/react.tsx')]
    }
  },
  indexHtml: [
    {
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['main1']
    },
    {
      template: 'public/react.html',
      filename: 'react.html',
      chunks: ['main2']
    }
  ],
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
