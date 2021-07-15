type DemoBase = {
  data: string[]
  name: string
  notes: string[]
  sources: string[]
}

export type DemoInfo = DemoBase & {
  category: string
  files: {
    d3utils: string
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

export type DemoSummary = DemoBase & {
  category: string
  key: string
  route: string
}

export type DemoPageProps = {
  pageContext: {
    demoInfo: DemoInfo
  }
}
