module.exports = {
  pathPrefix: process.env.ROOT_PATH
    ? process.env.ROOT_PATH.replace(/\/$/, "")
    : "/",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      options: {
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "bundles-sizes-report.html",
      },
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    },
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
