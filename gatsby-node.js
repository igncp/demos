require("source-map-support").install()
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
  },
})

const { onCreateWebpackConfig } = require("./gatsby/onCreateWebpackConfig.ts")
const { onCreatePage } = require("./gatsby/onCreatePage.ts")

module.exports = {
  onCreatePage,
  onCreateWebpackConfig,
}
