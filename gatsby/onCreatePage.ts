import fs from "fs"
import { GatsbyNode } from "gatsby"

import {
  DemoBase,
  DemoPageProps,
  DemoSummary,
  IndexPageProps,
} from "../src/common"

import d3Data from "./info/d3js"
import raphaelData from "./info/raphael"
import metas from "./info/metas"

import { ROOT_PATH } from "./constants"

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

const getDemo = (demoName: string) => ({
  content: readIfExists(`src/demos/${demoName}/${demoName}.ts`),
  type: "ts",
})

const getPage = (demoName: string, category: string) => ({
  content: readIfExists(`src/pages/${category}/${demoName}.tsx`),
  type: "tsx",
})

const getDemoInfo = (slugs: string[]) => {
  const [category, demoName] = slugs
  const { [category as Category]: categoryData } = categoryToData

  if (!(categoryData as unknown) || !demoName) {
    return null
  }

  const demo = getDemo(demoName)
  const page = getPage(demoName, category)

  type DemoKey = keyof typeof categoryData

  const demoBase = categoryData[demoName as DemoKey] as DemoBase

  return {
    ...demoBase,
    category,
    files: {
      cssModule: readIfExists(`src/demos/${demoName}/${demoName}.module.css`),
      demo,
      page,
    },
    key: demoName,
  }
}

const d3jsDemosSummaries: DemoSummary[] = []
const raphaelDemosSummaries: DemoSummary[] = []

for (const item in d3Data) {
  const demoSummary: DemoSummary = {
    ...d3Data[item as keyof typeof d3Data],
    category: "d3js",
    key: item,
    route: `${ROOT_PATH}d3js/${item}`,
  }

  d3jsDemosSummaries.push(demoSummary)
}

for (const item in raphaelData) {
  const demoSummary = {
    ...raphaelData[item as keyof typeof raphaelData],
    category: "raphael",
    key: item,
    route: `${ROOT_PATH}raphael/${item}`,
  }

  raphaelDemosSummaries.push(demoSummary)
}

const demosSummaries = d3jsDemosSummaries
  .concat(raphaelDemosSummaries)
  .sort((a, b) => {
    if (a.name === b.name) return 0

    return a.name < b.name ? -1 : 1
  })

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
