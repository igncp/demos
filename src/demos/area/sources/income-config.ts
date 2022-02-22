import { format } from "d3"

import { ChartConfig } from "../chart/area-chart"
import { ConfigResult } from "../config-types"
import { CONTAINER_ID } from "../ui-constants"

import { IncomeItem } from "./income-item-model"

type Config = ChartConfig<IncomeItem>

const getItemXValue: Config["getItemXValue"] = (incomeItem) =>
  incomeItem.getYear()
const getItemYValue: Config["getItemYValue"] = (incomeItem) =>
  incomeItem.getNormalizedValue()
const getItemId: Config["getItemId"] = (incomeItem) =>
  `${incomeItem.source}-${incomeItem.getId()}`
const getItemTitle: Config["getItemTitle"] = (incomeItem: IncomeItem) =>
  incomeItem.getSummary()
const chartTitle = "Share of top decile [aka top 10%] in national income"
const chartTitleShort = chartTitle.replace(" [aka top 10%]", "")

type IncomeResult = ConfigResult<IncomeItem>

const getIncomeConfig = async (): Promise<IncomeResult> => {
  const dataPoints = await IncomeItem.fetchAndCreateCollection()

  const config = {
    getAreaPoints: () => dataPoints,
    getChartTitle: () => chartTitle,
    getChartTitleShort: () => chartTitleShort,
    getItemId,
    getItemTitle,
    getItemXValue,
    getItemYValue,
    getPointClickHandler: () => null,
    getRootElId: () => CONTAINER_ID,
    getVerticalOffset: () => 0.05,
    getXAxisFormat: () => format(".0f"),
    getYAxisFormat: () => format(".0%"),
  }

  const onUpdateRandomValue = () => {
    Array.from({ length: 50 }).forEach(() => {
      const randomIndex = Math.floor(Math.random() * dataPoints.length)
      const randomChange = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)

      dataPoints[randomIndex].changePercentage(randomChange)
    })
  }

  return {
    config,
    onUpdateRandomValue,
  }
}

export { getIncomeConfig, IncomeResult }
