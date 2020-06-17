const prettier = require("prettier");
const { hardline } = prettier.doc.builders;

const name = "no-cuddled";

/**
 * This plugin is basically a thin wrapper around prettier's built in .js / .ts
 * parser + printer.
 */
const plugin = {
  parsers: {
    [name]: {
      astFormat: name,

      /**
       * Parse runs once, and then print will run multiple times, so we copy
       * some things from some built in plugins and attach them to our plugin
       * before running the real logic. Javascript is typically parsed via
       * the 'typescript' parser and printed via the 'estree' printer. We want
       * to re-use these for the heavy lifting, so we copy pieces of them and
       * override minimal parts.
       */
      parse(text, parsers, options) {
        // TODO: delegate to other parsers to not lose support for non-js / ts
        const isSupported = /\.(js|jsx|ts|tsx)$/.test(options.filepath || '')
        if (!isSupported) {
          throw Error(`${options.filepath} is not supported.`)
        }

        const thisPrinter = findPluginPrinter(options.plugins, name);
        const estreePrinter = findPluginPrinter(options.plugins, "estree");
        const typescriptParser = findPluginParser(
          options.plugins,
          "typescript"
        );

        // attach typescript parser props such as locStart & locEnd to options
        // so that it can be used in the print function below
        Object.assign(options, typescriptParser, {
          astFormat: name,
          // There are some things that check for this in the estree printer
          // that impact things like dangling commas in generic type parameters,
          // so we want to override the no-cuddled parser name.
          parser: "typescript",
        });

        // copy estree printer properties onto our printer
        // (except for our implementation of print)
        Object.assign(thisPrinter, estreePrinter, { print: thisPrinter.print });

        return parsers.typescript(text, parsers, options);
      },
    },
  },
  printers: {
    [name]: {
      print(path, options, print, args) {
        // use estree parser for standard parsing
        const estreePrinter = findPluginPrinter(options.plugins, "estree");
        const result = estreePrinter.print(path, options, print, args);

        const node = path.getValue();
        if (!node) {
          return result;
        }

        // replace the leading space in front of the else with a newline
        if (
          node.type === "IfStatement" &&
          result.parts[0] &&
          result.parts[0].parts[1] === " " &&
          result.parts[0].parts[2] === "else"
        ) {
          result.parts[0].parts[1] = hardline;
        }
        else if (node.type === "TryStatement" && result.parts[0]) {
          // If a catch block is present, it will be an object.
          // Otherwise an empty string
          const catchBlock = result.parts[0].parts[2];

          // If a finally block is present, it will be an object.
          // Otherwise an empty string
          const finallyBlock = result.parts[0].parts[3];

          // replace leading space in front of catch with newline
          if (catchBlock && catchBlock.parts[0] === " ") {
            catchBlock.parts[0] = hardline;
          }

          // replace leading space in front of finally with newline
          if (finallyBlock && finallyBlock.parts[0] === " finally ") {
            finallyBlock.parts[0] = "finally ";
            finallyBlock.parts.unshift(hardline);
          }
        }

        return result;
      },
    },
  },
};

module.exports = plugin;

/**
 * Find parser in list of plugins.
 */
function findPluginParser(plugins, parserName) {
  const plugin = plugins.find(
    (plugin) => plugin.parsers && plugin.parsers[parserName]
  );
  return plugin.parsers[parserName];
}

/**
 * Find printer in list of plugins.
 */
function findPluginPrinter(plugins, printerName) {
  const plugin = plugins.find(
    (plugin) => plugin.printers && plugin.printers[printerName]
  );
  return plugin.printers[printerName];
}
