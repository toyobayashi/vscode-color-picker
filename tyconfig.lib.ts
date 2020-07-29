import { Configuration } from '@tybys/ty'
import * as path from 'path'

const CopyWebpackPlugin = require('copy-webpack-plugin')

const config: Configuration = {
  indexHtml: [],
  target: 'web',
  entry: {
    web: {
      'vscode-color-picker': [path.join(__dirname, 'src/ColorPicker.ts')]
    }
  },
  output: {
    web: 'lib'
  },
  configureWebpack: {
    web (conf) {
      conf.output.library = 'vscodeColorPicker'
      conf.output.libraryTarget = 'umd'
      conf.node = false
      
      for (let i = 0; i < conf.plugins.length; i++) {
        if (conf.plugins[i] instanceof CopyWebpackPlugin) {
          conf.plugins.splice(i, 1)
          i--
        }
      }
    }
  },
  alias: {
    'vs': path.join(__dirname, 'src/vs')
  }
}

export default config
