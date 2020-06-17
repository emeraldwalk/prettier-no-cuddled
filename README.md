# Prettier plugin to uncuddle else, catch, and finally blocks.

## Config
Set the parser to `no-cuddled` and add this plugin to the `plugins` array.

> NOTE: Setting the `parser` option has the side-effect of disabling prettier on non js, ts, jsx, and tsx files.

.prettierrc.js
```
module.exports = {
  parser: "no-cuddled",
  plugins: ["@emeraldwalk/prettier-plugin-no-cuddled"],
}
```

NOTE: You can also copy the `src/plugin.js` file from this repo and set
the path to the file in the `plugins` directory.

.prettierrc.js
```
module.exports = {
  parser: "no-cuddled",
  plugins: ["./some-path/plugin.js"],
};
```