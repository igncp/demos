const path = require("path")

module.exports = {
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        actions: false,
      },
    },
  ],
  brandUrl: "https://igncp.github.io/demos/",
  features: {
    postcss: false,
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  webpackFinal: (config) => {
    config.module.rules = config.module.rules.filter(
      (rule) => !rule.test.test(".css")
    )

    config.module.rules.push({
      include: path.resolve(__dirname, "../"),
      test: /\.css$/,
      use: ["style-loader", "css-loader?modules=true", "postcss-loader"],
    })

    return config
  },
}
