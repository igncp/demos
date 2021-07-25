type DocName = string
type DocLink = string

export type Meta = {
  description: string
}

export type DemoBase = {
  data: string[]
  docs: Array<[DocName, DocLink]>
  isCompleted: boolean
  name: string
  notes: string[]
  sources: string[]
  summary: string[]
}

export type DemoInfo = DemoBase & {
  category: string
  files: {
    cssModule: string
    demo: {
      content: string
      type: string
    }
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
