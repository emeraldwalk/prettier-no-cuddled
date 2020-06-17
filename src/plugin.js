const prettier = require('prettier')
const { concat, hardline } = prettier.doc.builders

const name = 'no-cuddled'

const plugin = {
  parsers: {
    [name]: {
      astFormat: name,
      parse(text, parsers, options) {
        // const thisParser = findPluginParser(options.plugins, name)
        const thisPrinter = findPluginPrinter(options.plugins, name)
        const estreePrinter = findPluginPrinter(options.plugins, 'estree')
        const typescriptParser = findPluginParser(options.plugins, 'typescript')

        options.locStart = typescriptParser.locStart
        options.locEnd = typescriptParser.locEnd

        const print = thisPrinter.print
        Object.assign(thisPrinter, estreePrinter, { print })
        return typescriptParser.parse(text, parsers, options)
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
}

module.exports = plugin

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
