const fs = require("fs")
const d3Data = require("./src/info/d3js")
const raphaelData = require("./src/info/raphael")

const categoryToData = {
  d3js: d3Data,
  raphael: raphaelData,
}

const readIfExists = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch (_) {
    return null
  }
}

const getDemoInfo = (slugs) => {
  const [category, demoName] = slugs

  if (!categoryToData[category] || !demoName) {
    return null
  }

  return {
    ...categoryToData[category][demoName],
    category,
    files: {
      js: readIfExists(`src/demos/${demoName}/${demoName}.js`, "utf-8"),
      page:
        readIfExists(`src/pages/${category}/${demoName}.ts`, "utf-8") ||
        readIfExists(`src/pages/${category}/${demoName}.js`, "utf-8"),
      styl: readIfExists(`src/demos/${demoName}/${demoName}.styl`),
      ts: readIfExists(`src/demos/${demoName}/${demoName}.ts`, "utf-8"),
    },
    key: demoName,
  }
}

module.exports.onCreatePage = ({ page, actions }) => {
  const slugs = page.path.split("/").filter(Boolean)
  const demoInfo = getDemoInfo(slugs)

  const { createPage, deletePage } = actions

  if (demoInfo) {
    deletePage(page)

    createPage({
      ...page,
      context: {
        demoInfo,
      },
    })
  }
}

exports.onCreateWebpackConfig = ({ plugins, actions }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ROOT_PATH: process.env.ROOT_PATH || "/",
      }),
    ],
  })
}
