import { ChartConfig } from "./area-chart"
import { IncomeItem } from "./income-item-model"

export const CONTAINER_ID = "chart"

type Config = ChartConfig<IncomeItem>

const getItemXValue: Config["getItemXValue"] = (incomeItem) =>
  incomeItem.getYear()
const getItemYValue: Config["getItemYValue"] = (incomeItem) =>
  incomeItem.getNormalizedValue()
const getItemId: Config["getItemId"] = (incomeItem) => incomeItem.getId()
const getItemTitle: Config["getItemTitle"] = (incomeItem: IncomeItem) =>
  incomeItem.getSummary()
const chartTitle = "Share of top decile [aka top 10%] in national income"

export const createChartConfig = (
  dataPoints: IncomeItem[]
): ChartConfig<IncomeItem> => ({
  areaPoints: dataPoints,
  chartTitle,
  getItemId,
  getItemTitle,
  getItemXValue,
  getItemYValue,
  rootElId: CONTAINER_ID,
})
