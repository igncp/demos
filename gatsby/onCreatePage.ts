import fs from "fs"

import { DemoSummary, IndexPageProps, DemoPageProps } from "../src/common"

import d3Data from "../src/info/d3js"
import raphaelData from "../src/info/raphael"

import { ROOT_PATH } from "./constants"

const categoryToData: any = {
  d3js: d3Data,
  raphael: raphaelData,
}

const readIfExists = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch (_) {
    return null
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

const getDemoInfo = (slugs: any) => {
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

const d3jsDemosSummaries: DemoSummary[] = []
const raphaelDemosSummaries: DemoSummary[] = []

for (const item in d3Data) {
  const demoSummary: DemoSummary = {
    ...(d3Data as any)[item],
    category: "d3js",
    key: item,
    route: `${ROOT_PATH}d3js/${item}`,
  }

  d3jsDemosSummaries.push(demoSummary)
}

for (const item in raphaelData) {
  const demoSummary = {
    ...(raphaelData as any)[item],
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

const onCreatePage = ({ page, actions }: any) => {
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

    createPage({
      ...page,
      context: {
        groupedDemos,
        numberPerGroup,
      } as IndexPageProps["pageContext"],
    })
  } else if (demoInfo) {
    deletePage(page)

    createPage({
      ...page,
      context: {
        demoInfo,
      } as DemoPageProps["pageContext"],
    })
  }
}

export { onCreatePage }
