const { join, isAbsolute, resolve, dirname, basename } = require('path')
const fs = require('fs')
const rollup = require('rollup')

const context = __dirname

function getPath (...args) {
  if (!args.length) return context
  return isAbsolute(args[0]) ? join(...args) : join(context, ...args)
}

const inputPrefix = 'lib/esm'
const outputPrefix = getPath('lib')

/**
 * @param {{ entry: string; output: string; ns: string; minify?: boolean; terserOptions?: import('rollup-plugin-terser').Options }} opts 
 */
function getRollupConfig (opts) {
  const { entry, output, ns, minify, terserOptions, format } = opts

  const rollupTerser = require('rollup-plugin-terser').terser
  const rollupAlias = require('@rollup/plugin-alias')
  const rollupReplace = require('@rollup/plugin-replace')
  const rollupNodeResolve = require('@rollup/plugin-node-resolve').default
  const rollupInject = require('@rollup/plugin-inject')

  const outputFilename = minify ? getPath(outputPrefix, `${output}.min.js`) : getPath(outputPrefix, `${output}.js`)
  const fmt = format || 'umd'
  return {
    input: {
      input: getPath(entry),
      plugins: [
        ...(format !== 'es' ? [
          rollupNodeResolve(),
          // https://github.com/microsoft/TypeScript/issues/36841#issuecomment-669014853
          rollupInject({
            '__classPrivateFieldGet': ['tslib', '__classPrivateFieldGet'],
            '__classPrivateFieldSet': ['tslib', '__classPrivateFieldSet'],
          }),
        ] : []),
        rollupReplace({
          __PKG_VERSION__: JSON.stringify(require('./package.json').version)
        }),
        rollupAlias({
          entries: [
            { find: /^vs\/(.+)/, replacement: getPath(inputPrefix, 'vs') + '/$1.js' }
          ]
        }),
        {
          resolveId (source, importer) {
            if (source.endsWith('.css')) {
              return resolve(dirname(importer).replace(/lib[/\\]esm/g, 'src'), source)
            }
          },
          load (id) {
            if (id.endsWith('.css')) {
              if (fmt !== 'umd') return ''
              const re = /url\(\s*['"](.+)['"]\s*\)/g
              if (minify) {
                const cssnano = require('cssnano')
                let content = fs.readFileSync(id, 'utf8')
                content = content.replace(re, (match, p1) => {
                  return `url(data:image/png;base64,${fs.readFileSync(join(dirname(id), p1)).toString('base64')})`
                })
                return new Promise((resolve, reject) => {
                  cssnano.process(content, { from: id }, { preset: 'default' }).then(result => {
                    const referenceId = this.emitFile({
                      type: 'asset',
                      fileName: 'vscode-color-picker.min.css',
                      name: basename(id),
                      source: result.css
                    });
                    resolve(`export default import.meta.ROLLUP_FILE_URL_${referenceId};`)
                  });
                })
              }
              let content = fs.readFileSync(id, 'utf8')
              content = content.replace(re, (match, p1) => {
                return `url(data:image/png;base64,${fs.readFileSync(join(dirname(id), p1)).toString('base64')})`
              })
              const referenceId = this.emitFile({
                type: 'asset',
                fileName: 'vscode-color-picker.css',
                name: basename(id),
                source: content
              });
              return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`
            }
          }
        },
        ...(minify ? [rollupTerser({
          output: {
            comments: false,
            beautify: false
          },
          ...(terserOptions || {}),
          module: (terserOptions && terserOptions.module) || (['es', 'esm', 'module']).includes(fmt)
        })] : [])
      ],
      context: 'this',
      onwarn(warning, warn) {
        // suppress eval warnings
        if (warning.code === 'EVAL') return
        warn(warning)
      }
    },
    output: {
      file: outputFilename,
      format: fmt,
      name: ns,
      exports: 'named'
    }
  }
}

function createConfig () {
  const prefix = inputPrefix
  return [
    getRollupConfig({
      entry: `${prefix}/ColorPicker.js`,
      output: 'vscode-color-picker',
      ns: `vscodeColorPicker`,
      minify: false
    }),
    getRollupConfig({
      entry: `${prefix}/ColorPicker.js`,
      output: 'vscode-color-picker',
      ns: `vscodeColorPicker`,
      minify: true
    }),
    getRollupConfig({
      entry: `${prefix}/ColorPicker.js`,
      output: 'vscode-color-picker.esm',
      ns: `vscodeColorPicker`,
      minify: false,
      format: 'es'
    }),
    getRollupConfig({
      entry: `${prefix}/ColorPicker.js`,
      output: 'vscode-color-picker.esm',
      ns: `vscodeColorPicker`,
      minify: true,
      format: 'es'
    })
  ]
}

Promise.all(createConfig().map(conf => {
  return rollup.rollup(conf.input).then(bundle => bundle.write(conf.output))
})).catch(err => {
  console.error(err)
  process.exitCode = 1
})
