import { csv } from "d3"

import { ChartConfig } from "./area-chart"

type PointBase = {
  percent: number
  year: number
}

export type Point = PointBase & {
  index: number
}

export const fetchData = async (): Promise<Point[]> => {
  const result = (await (csv(
    `${ROOT_PATH}data/d3js/area/data.csv`
  ) as unknown)) as PointBase[]

  return result.map((p, index) => ({
    ...p,
    index,
  }))
}

type Config = ChartConfig<Point>

const getItemXValue: Config["getItemXValue"] = (point) => point.year
const getItemYValue: Config["getItemYValue"] = (point) => point.percent / 100
const getItemId: Config["getItemId"] = (point) => point.index
const getItemTitle: Config["getItemTitle"] = (point: Point) =>
  `Year: ${point.year}, Percent: ${point.percent}%`
const getChartTitle = () =>
  "Share of top decile [aka top 10%] in national income"

export const createChartConfig = (items: Point[]): ChartConfig<Point> => ({
  getChartTitle,
  getItemId,
  getItemTitle,
  getItemXValue,
  getItemYValue,
  items,
  rootElId: "chart",
})
