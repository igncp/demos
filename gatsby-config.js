module.exports = {
  pathPrefix: process.env.ROOT_PATH
    ? process.env.ROOT_PATH.replace(/\/$/, "")
    : "/",
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
      resolve: `gatsby-source-filesystem`,
    },
    `gatsby-plugin-stylus`,
    {
      options: {
        alias: {
          "@": "src",
        },
        extensions: ["js"],
      },
      resolve: `gatsby-plugin-alias-imports`,
    },
  ],
}
