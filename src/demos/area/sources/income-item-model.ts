import { csv } from "d3"

import { DataSource } from "../config-types"

type IncomeItemBase = {
  percent: number
  year: number
}

type IncomeItemData = Omit<IncomeItemBase, "percent"> & {
  percentage: number
  pointIndex: number
}

class IncomeItem {
  public source: DataSource.INCOME
  private readonly incomeItemData: IncomeItemData

  private constructor(incomeItemData: IncomeItemData) {
    this.source = DataSource.INCOME
    this.incomeItemData = incomeItemData
    this.incomeItemData.percentage = Number(this.incomeItemData.percentage)
  }

  public static async fetchAndCreateCollection(): Promise<IncomeItem[]> {
    const response = (await (csv(
      `${ROOT_PATH}data/d3js/area/data.csv`
    ) as unknown)) as IncomeItemBase[]

    const incomeItemsData = response.map((...[point, pointIndex]) => ({
      ...point,
      percentage: point.percent,
      pointIndex,
    }))

    return incomeItemsData.map(
      (incomeItemData) => new IncomeItem(incomeItemData)
    )
  }

  public getYear() {
    return this.incomeItemData.year
  }

  public changePercentage(percentageChange: number) {
    const valueWithLowerBound = Math.max(
      this.incomeItemData.percentage + percentageChange,
      0
    )
    const newValue = Math.min(100, valueWithLowerBound)

    this.incomeItemData.percentage = newValue
  }

  public getNormalizedValue() {
    return this.incomeItemData.percentage / 100
  }

  public getId() {
    return this.incomeItemData.pointIndex
  }

  public getSummary(): string {
    const { incomeItemData } = this

    return `Year: ${
      incomeItemData.year
    }, Percentage: ${incomeItemData.percentage.toFixed(2)}%`
  }
}

export { IncomeItem }
