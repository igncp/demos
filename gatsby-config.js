module.exports = {
  pathPrefix: process.env.ROOT_PATH
    ? process.env.ROOT_PATH.replace(/\/$/, "")
    : "/",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      options: {
        alias: {
          "@": "src",
        },
        extensions: ["js"],
      },
      resolve: `gatsby-plugin-alias-imports`,
    },
    `gatsby-plugin-postcss`,
  ],
}
