type DocName = string
type DocLink = string

type Meta = {
  description: string
}

type DemoBase = {
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

type DemoInfo = DemoBase & {
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

type DemoSummary = {
  category: string
  key: string
  name: DemoBase["name"]
  route: string
}

type IndexPageProps = {
  pageContext: {
    groupedDemos: DemoSummary[][]
    meta: Meta
    numberPerGroup: number
  }
}

type DemoPageProps = {
  pageContext: {
    demoInfo: DemoInfo
    meta: Meta
  }
}

enum SPECIAL_DEMO_KEYS {
  STORYBOOK = "storybook",
  TESTING = "testing",
}

const JQUERYUI = {
  SCRIPT: "/vendors/jquery-ui/jquery-ui.min.js",
  STYLE: "/vendors/jquery-ui/themes/base/jquery-ui.min.css",
}

export {
  DemoBase,
  DemoInfo,
  DemoPageProps,
  DemoSummary,
  IndexPageProps,
  JQUERYUI,
  Meta,
  SPECIAL_DEMO_KEYS,
}
