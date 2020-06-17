# Prettier plugin to uncuddle else, catch, and finally blocks.

## Installation
This is not yet available as an `npm` package, so you will have to install
this from git. Alternatively you can copy the `src/plugin.js` file and reference
it explicitly as shown in the config section below.

```
npm i -D emeraldwalk/prettier-plugin-no-cuddled#master
```

## Config
Set the `parser` option to `no-cuddled` and add this plugin to the `plugins` option array.

> NOTE: Setting the `parser` option has the side-effect of disabling prettier on non js, ts, jsx, and tsx files. Hopefully can fix this in the future.

Here's an example using `.prettierrc.js`, but other forms of providing options to Prettier should also work.

```javascript
module.exports = {
  parser: "no-cuddled",
  plugins: ["./node_modules/@emeraldwalk/prettier-plugin-no-cuddled"],
}
```

You can also copy the `src/plugin.js` file from this repo and set
the path to the file in the `plugins` directory.

```javascript
module.exports = {
  parser: "no-cuddled",
  plugins: ["./some-path/plugin.js"],
};
```

## Known Issues
* Enabling this plugin disables Prettier on non-js / ts file extensions. This can possibly be worked around by using multiple config files, but it's likely that things like format on save will only work for 1 or the other for now.
* catch / finally blocks with comments in front of them move the comments inside the block. Need to investigate this one.