import { csv } from "d3"

import { ChartConfig } from "./area-chart"

type IncomeItemBase = {
  percent: number
  year: number
}

export type IncomeItem = IncomeItemBase & {
  pointIndex: number
}

export const fetchData = async (): Promise<IncomeItem[]> => {
  const response = (await (csv(
    `${ROOT_PATH}data/d3js/area/data.csv`
  ) as unknown)) as IncomeItemBase[]

  return response.map((...[point, pointIndex]) => ({
    ...point,
    pointIndex,
  }))
}

type Config = ChartConfig<IncomeItem>

const getItemXValue: Config["getItemXValue"] = (incomeItem) => incomeItem.year
const getItemYValue: Config["getItemYValue"] = (incomeItem) =>
  incomeItem.percent / 100
const getItemId: Config["getItemId"] = (incomeItem) => incomeItem.pointIndex
const getItemTitle: Config["getItemTitle"] = (incomeItem: IncomeItem) =>
  `Year: ${incomeItem.year}, Percent: ${incomeItem.percent}%`
const getChartTitle = () =>
  "Share of top decile [aka top 10%] in national income"

export const createChartConfig = (
  dataPoints: IncomeItem[]
): ChartConfig<IncomeItem> => ({
  areaPoints: dataPoints,
  getChartTitle,
  getItemId,
  getItemTitle,
  getItemXValue,
  getItemYValue,
  rootElId: "chart",
})
