import { ChartConfig } from "./chart/area-chart"
import { IncomeItem } from "./income-item-model"

const CONTAINER_ID = "chart"

type Config = ChartConfig<IncomeItem>

const getItemXValue: Config["getItemXValue"] = (incomeItem) =>
  incomeItem.getYear()
const getItemYValue: Config["getItemYValue"] = (incomeItem) =>
  incomeItem.getNormalizedValue()
const getItemId: Config["getItemId"] = (incomeItem) => incomeItem.getId()
const getItemTitle: Config["getItemTitle"] = (incomeItem: IncomeItem) =>
  incomeItem.getSummary()
const chartTitle = "Share of top decile [aka top 10%] in national income"
const chartTitleShort = chartTitle.replace(" [aka top 10%]", "")

const createChartConfig = (
  dataPoints: IncomeItem[]
): ChartConfig<IncomeItem> => ({
  areaPoints: dataPoints,
  chartTitle,
  chartTitleShort,
  getItemId,
  getItemTitle,
  getItemXValue,
  getItemYValue,
  rootElId: CONTAINER_ID,
})

export { CONTAINER_ID, createChartConfig }
