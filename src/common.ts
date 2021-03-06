type DocName = string
type DocLink = string

type DemoBase = {
  data: string[]
  docs: [DocName, DocLink][]
  name: string
  notes: string[]
  sources: string[]
  summary: string[]
}

export type DemoInfo = DemoBase & {
  category: string
  files: {
    demo: {
      content: string
      type: string
    }
    page: {
      content: string
      type: string
    }
    styl: string
  }
  key: string
}

export type DemoSummary = {
  name: DemoBase["name"]
  category: string
  key: string
  route: string
}

export type IndexPageProps = {
  pageContext: {
    groupedDemos: DemoSummary[][]
    numberPerGroup: number
  }
}

export type DemoPageProps = {
  pageContext: {
    demoInfo: DemoInfo
  }
}
