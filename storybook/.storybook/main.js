module.exports = {
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  features: {
    postcss: false,
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
}
