type TechItemBase = {
  readonly label: string
  readonly val: number // eslint-disable-line id-denylist
}

type TechItemData = {
  arbitraryValue: number
  readonly techLabel: string
}

export class TechItem {
  private readonly techItemData: TechItemData

  private constructor(techItemData: TechItemData) {
    this.techItemData = techItemData
  }

  public static async fetchAndCreateCollection(): Promise<TechItem[]> {
    const response = await fetch(`${ROOT_PATH}data/d3js/pie/data.json`)
    const techItemsBase = (await response.json()) as TechItemBase[]

    const techItemsData = techItemsBase.map((techItemBase) => ({
      arbitraryValue: techItemBase.val,
      techLabel: techItemBase.label,
    }))

    return techItemsData.map((techItemData) => new TechItem(techItemData))
  }

  public getValue() {
    return this.techItemData.arbitraryValue
  }

  public setValue(newValue: number) {
    this.techItemData.arbitraryValue = newValue
  }

  public getSummary(): string {
    const { techItemData } = this

    return `${techItemData.techLabel}: ${techItemData.arbitraryValue}`
  }
}
