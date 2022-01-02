import { json } from "d3"

import { FishEyeChartOpts } from "./fish-eye-chart"
import { CONTAINER_ID } from "./ui-constants"

const RANDOM_UPDATE_ID = "random-update"

type IncomeMetric = {
  income: number
  lifeExpectancy: number
  name: string
  population: number
  region: string
}

const fetchData = async () =>
  json(`${ROOT_PATH}data/d3js/fish-eye/data.json`) as Promise<IncomeMetric[]>

type Opts = FishEyeChartOpts<IncomeMetric>

const getXValue: Opts["getXValue"] = (incomeMetric) => incomeMetric.income
const getYValue: Opts["getYValue"] = (incomeMetric) =>
  incomeMetric.lifeExpectancy
const getRadiusValue: Opts["getRadiusValue"] = (incomeMetric) =>
  incomeMetric.population
const getColorValue: Opts["getColorValue"] = (incomeMetric) =>
  incomeMetric.region

const humanizeNumber = (initialN: number): string => {
  let numStr = initialN.toFixed(0)

  while (true) {
    const numStrFormatted = numStr.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3")

    if (numStrFormatted === numStr) {
      break
    }

    numStr = numStrFormatted
  }

  return numStr
}

const getCircleTitle: Opts["getCircleTitle"] = (incomeMetric) =>
  `${incomeMetric.name}:\n- Income: ${humanizeNumber(
    incomeMetric.income
  )} $/P.C.\n` +
  `- Population: ${humanizeNumber(incomeMetric.population)}\n` +
  `- Life expectancy: ${incomeMetric.lifeExpectancy} years`

const regions = [
  "Sub-Saharan Africa",
  "South Asia",
  "Middle East & North Africa",
  "America",
  "Europe & Central Asia",
  "East Asia & Pacific",
]

const longTitle =
  "Income Per Capita vs " +
  "Life Expectancy vs Population vs Region - 180 Countries"
const shortTitle = "Income Per Capita vs Life Expectancy"

const xAxisLabel = "income per capita, inflation-adjusted (dollars)"
const yAxisLabel = "life expectancy (years)"

const getChartConfig = (incomeMetrics: IncomeMetric[]): Opts => ({
  chartItems: incomeMetrics,
  colorDomain: regions,
  getCircleTitle,
  getColorValue,
  getRadiusValue,
  getXValue,
  getYValue,
  rootElId: CONTAINER_ID,
  titles: {
    long: longTitle,
    short: shortTitle,
  },
  xAxisLabel,
  yAxisLabel,
})

export { RANDOM_UPDATE_ID, fetchData, getChartConfig }
