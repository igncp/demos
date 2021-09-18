import { csv } from "d3"

type IncomeItemBase = {
  percent: number
  year: number
}

type IncomeItemData = IncomeItemBase & {
  pointIndex: number
}

class IncomeItem {
  private readonly incomeItemData: IncomeItemData

  private constructor(incomeItemData: IncomeItemData) {
    this.incomeItemData = incomeItemData
  }

  public static async fetchAndCreateCollection(): Promise<IncomeItem[]> {
    const response = (await (csv(
      `${ROOT_PATH}data/d3js/area/data.csv`
    ) as unknown)) as IncomeItemBase[]

    const incomeItemsData = response.map((...[point, pointIndex]) => ({
      ...point,
      pointIndex,
    }))

    return incomeItemsData.map(
      (incomeItemData) => new IncomeItem(incomeItemData)
    )
  }

  public getYear() {
    return this.incomeItemData.year
  }

  public getNormalizedValue() {
    return this.incomeItemData.percent / 100
  }

  public getId() {
    return this.incomeItemData.pointIndex
  }

  public getSummary(): string {
    const { incomeItemData } = this

    return `Year: ${incomeItemData.year}, Percent: ${incomeItemData.percent}%`
  }
}

export { IncomeItem }