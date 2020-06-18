const fs = require("fs")
const { join } = require("path")
const prettier = require("prettier")
const plugin = require("../src/plugin")

const inDir = join(__dirname, "in")
const outDir = join(__dirname, "out")

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir)
}

const fileNames = fs.readdirSync(inDir)
fileNames.filter(f => f.indexOf('json') > -1).forEach((fileName) => {
  const inputFile = String(fs.readFileSync(join(inDir, fileName)))

  const result = prettier.format(inputFile, {
    filepath: fileName,
    parser: "no-cuddled",
    singleQuote: true,
    plugins: [plugin],
  })

  fs.writeFileSync(join(outDir, fileName), result)
})
