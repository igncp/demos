const postcssPresetEnv = require(`postcss-preset-env`)

module.exports = () => ({
  plugins: [
    postcssPresetEnv({
      stage: 0,
    }),
    require("postcss-mixins"),
    require("postcss-nested"),
    require("postcss-simple-vars"),
    require("postcss-import"),
  ],
})
