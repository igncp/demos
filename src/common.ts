type DocName = string
type DocLink = string

export type Meta = {
  description: string
}

export type DemoBase = {
  dataFiles: string[]
  docs: Array<[DocName, DocLink]>
  isCompleted: boolean
  name: string
  notes: string[]
  sources: string[]
  summary: string[]
}

type DemoFile = {
  content: string
  fileName: string
}

export type DemoInfo = DemoBase & {
  category: string
  files: {
    demoCSS: DemoFile[]
    demoTS: DemoFile[]
    page: {
      content: string
      type: string
    }
  }
  key: string
}

export type DemoSummary = {
  category: string
  key: string
  name: DemoBase["name"]
  route: string
}

export type IndexPageProps = {
  pageContext: {
    groupedDemos: DemoSummary[][]
    meta: Meta
    numberPerGroup: number
  }
}

export type DemoPageProps = {
  pageContext: {
    demoInfo: DemoInfo
    meta: Meta
  }
}

export const STORYBOOK_DEMO_KEY = "storybook"

export const JQUERYUI = {
  SCRIPT: "/vendors/jquery-ui/jquery-ui.min.js",
  STYLE: "/vendors/jquery-ui/themes/base/jquery-ui.min.css",
}
