const path = require("path")

module.exports = {
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  features: {
    postcss: false,
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  webpackFinal: (config) => {
    config.module.rules = config.module.rules.filter(
      (r) => !r.test.test(".css")
    )

    config.module.rules.push({
      include: path.resolve(__dirname, "../"),
      test: /\.css$/,
      use: ["style-loader", "css-loader?modules=true", "postcss-loader"],
    })

    return config
  },
}
