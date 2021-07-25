const postcssPresetEnv = require(`postcss-preset-env`)

module.exports = () => ({
  plugins: [
    postcssPresetEnv({
      stage: 0,
    }),
    require("postcss-nested"),
    require("postcss-simple-vars"),
  ],
})
