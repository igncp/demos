import fs from "fs"
import { GatsbyNode } from "gatsby"

import {
  DemoBase,
  DemoPageProps,
  DemoSummary,
  IndexPageProps,
  STORYBOOK_DEMO_KEY,
} from "../src/common"

import { ROOT_PATH } from "./constants"
import d3Data from "./info/d3js"
import metas from "./info/metas"
import raphaelData from "./info/raphael"

const categoryToData = {
  d3js: d3Data,
  raphael: raphaelData,
}

type Category = keyof typeof categoryToData

const readIfExists = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch (_) {
    return ""
  }
}

const getDemoTSFiles = (demoName: string) => {
  const tsFiles = fs
    .readdirSync(`${__dirname}/../src/demos/${demoName}`)
    .filter((file) => /\.ts$/.test(file))
    .filter((file) => !file.includes(".css") && file !== demoName)
  const mainStr = "export default main" // move the main demo file to the top

  return tsFiles
    .map((fileName) => ({
      content: readIfExists(`src/demos/${demoName}/${fileName}`),
      fileName,
    }))
    .filter((file) => !!file.content)
    .sort((...[fileA, fileB]) => {
      if (fileA.content.includes(mainStr)) {
        return -1
      }

      return fileB.content.includes(mainStr) ? 1 : 0
    })
}

const getDemoCSSFiles = (demoName: string) => {
  const cssFiles = fs
    .readdirSync(`${__dirname}/../src/demos/${demoName}`)
    .filter((file) => /\.css$/.test(file))

  return cssFiles
    .map((fileName) => ({
      content: readIfExists(`src/demos/${demoName}/${fileName}`),
      fileName,
    }))
    .filter((file) => !!file.content)
}

const getPage = ({
  category,
  demoName,
}: {
  category: Category
  demoName: string
}) => ({
  content: readIfExists(`src/pages/${category}/${demoName}.tsx`),
  type: "tsx",
})

const getDemoInfo = (slugs: string[]) => {
  const [category, demoName] = slugs as [Category, string]
  const { [category]: categoryData } = categoryToData

  if (!(categoryData as unknown) || !demoName) {
    return null
  }

  const page = getPage({ category, demoName })

  type DemoKey = keyof typeof categoryData

  const demoBase = categoryData[demoName as DemoKey] as DemoBase

  return {
    ...demoBase,
    category,
    files: {
      demoCSS: getDemoCSSFiles(demoName),
      demoTS: getDemoTSFiles(demoName),
      page,
    },
    key: demoName,
  }
}

const d3jsDemosSummaries: DemoSummary[] = []
const raphaelDemosSummaries: DemoSummary[] = []

for (const d3DemoName in d3Data) {
  const demoSummary: DemoSummary = {
    ...d3Data[d3DemoName as keyof typeof d3Data],
    category: "d3js",
    key: d3DemoName,
    route: `${ROOT_PATH}d3js/${d3DemoName}`,
  }

  d3jsDemosSummaries.push(demoSummary)
}

for (const raphaelDemoName in raphaelData) {
  const demoSummary = {
    ...raphaelData[raphaelDemoName as keyof typeof raphaelData],
    category: "raphael",
    key: raphaelDemoName,
    route: `${ROOT_PATH}raphael/${raphaelDemoName}`,
  }

  raphaelDemosSummaries.push(demoSummary)
}

const storybookSummary = {
  category: STORYBOOK_DEMO_KEY,
  key: STORYBOOK_DEMO_KEY,
  name: "Storybook Demos",
  route: `${ROOT_PATH}storybook`,
}

const demosSummaries = d3jsDemosSummaries
  .concat(raphaelDemosSummaries)
  .sort((...[demoSummaryA, demoSummaryB]) => {
    if (demoSummaryA.name === demoSummaryB.name) {
      return 0
    }

    return demoSummaryA.name < demoSummaryB.name ? -1 : 1
  })
  .concat(storybookSummary)

const onCreatePage: GatsbyNode["onCreatePage"] = ({ actions, page }) => {
  const slugs = page.path.split("/").filter(Boolean)
  const demoInfo = getDemoInfo(slugs)

  const { createPage, deletePage } = actions

  if (page.path === "/") {
    deletePage(page)

    const numberPerGroup = Math.ceil(demosSummaries.length / 2)
    const groupedDemos = [
      demosSummaries.slice(0, numberPerGroup),
      demosSummaries.slice(numberPerGroup, demosSummaries.length),
    ]

    const context: IndexPageProps["pageContext"] = {
      groupedDemos,
      meta: metas.home,
      numberPerGroup,
    }

    createPage({
      ...page,
      context,
    })
  } else if (demoInfo) {
    deletePage(page)

    const { [demoInfo.category as Category]: categoryMetas } = metas

    const context: DemoPageProps["pageContext"] = {
      demoInfo,
      meta: categoryMetas[demoInfo.key as keyof typeof categoryMetas],
    }

    createPage({
      ...page,
      context,
    })
  }
}

export { onCreatePage }
