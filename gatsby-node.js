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

const getDemo = (demoName) => {
  const demo = {
    content: readIfExists(`src/demos/${demoName}/${demoName}.ts`),
    type: "ts",
  }

  if (demo.content) {
    return demo
  }

  return {
    content: readIfExists(`src/demos/${demoName}/${demoName}.js`),
    type: "js",
  }
}

const getPage = (demoName, category) => {
  const page = {
    content: readIfExists(`src/pages/${category}/${demoName}.tsx`),
    type: "tsx",
  }

  if (page.content) {
    return page
  }

  return {
    content: readIfExists(`src/pages/${category}/${demoName}.js`),
    type: "js",
  }
}

const getDemoInfo = (slugs) => {
  const [category, demoName] = slugs

  if (!categoryToData[category] || !demoName) {
    return null
  }

  const demo = getDemo(demoName)
  const page = getPage(demoName, category)

  return {
    ...categoryToData[category][demoName],
    category,
    files: {
      demo,
      page,
      styl: readIfExists(`src/demos/${demoName}/${demoName}.styl`),
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
        ROOT_PATH: JSON.stringify(process.env.ROOT_PATH || "/"),
      }),
    ],
  })
}
