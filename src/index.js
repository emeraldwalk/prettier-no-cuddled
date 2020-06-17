const fs = require('fs')
const { join } = require('path')
const prettier = require('prettier')

const { concat, hardline } = prettier.doc.builders
const { locStart, locEnd } = require('./loc')

const inputFile = String(fs.readFileSync(join(__dirname, '..', 'test/test.js')))
const name = 'no-cuddled'

function findPluginParser(plugins, parserName) {
  const plugin = plugins.find(
    (plugin) => plugin.parsers && plugin.parsers[parserName]
  )
  return plugin.parsers[parserName]
}

function findPluginPrinter(plugins, printerName) {
  const plugin = plugins.find(
    (plugin) => plugin.printers && plugin.printers[printerName]
  )
  return plugin.printers[printerName]
}

const result = prettier.format(inputFile, {
  parser: name,
  singleQuote: true,
  plugins: [
    {
      parsers: {
        [name]: {
          astFormat: name,
          parse(text, parsers, options) {
            // const thisParser = findPluginParser(options.plugins, name)
            const thisPrinter = findPluginPrinter(options.plugins, name)
            const estreePrinter = findPluginPrinter(options.plugins, 'estree')
            const typescriptParser = findPluginParser(
              options.plugins,
              'typescript'
            )

            options.locStart = typescriptParser.locStart
            options.locEnd = typescriptParser.locEnd

            const print = thisPrinter.print
            Object.assign(thisPrinter, estreePrinter, { print })
            return typescriptParser.parse(text, parsers, options)
            // return parsers.typescript(text, parsers, options)
          },
        },
      },
      printers: {
        [name]: {
          print(path, options, print) {
            const estreePrinter = findPluginPrinter(options.plugins, 'estree')

            const node = path.getValue()

            if (!node) {
              return ''
            }

            if (node.type === 'IfStatement') {
              const result = estreePrinter.print(path, options, print)

              if (
                result.parts[0] &&
                result.parts[0].parts[1] === ' ' &&
                result.parts[0].parts[2] === 'else'
              ) {
                result.parts[0].parts.splice(1, 1, hardline)
              }
              return result
            }

            return estreePrinter.print(path, options, print)
          },
        },
      },
    },
  ],
})

console.log(result)

// const parserName = 'no-cuddled-parse'
// const astFormatName = 'no-cuddled-ast'

// const languages = [
//   { name: 'NoCuddledElses', parsers: [parserName], extensions: ['.js'] }
// ]

// const parsers = {
//   [parserName]: {
//     astFormat: astFormatName
//   }
// }

// const printers = {
//   'estree': {
//     print(path, options, print) {
//       console.log(arguments)
//       throw 'Some error'
//       return ''
//     }
//   }
// }

// module.exports = {
//   // languages,
//   // parsers,
//   printers
// }
