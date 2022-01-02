import { timeFormat, timeParse, tsv } from "d3"

import { ChartConfig } from "./multiline-voronoi-chart"
import { CONTAINER_ID } from "./ui-constants"

const SHOW_VORONOI_ID = "show-voronoi"

type InitialDataItem = {
  [monthKey: string]: string
  name: string
}

type CityMetric = {
  cityName: string
  date: Date
  employmentRate: number
}

type City = {
  metrics: CityMetric[]
  name: string
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const formatStr = "%Y-%m"

const fetchData = async () => {
  const monthFormat = timeFormat(formatStr)
  const monthParse = timeParse(formatStr)

  const dataItems = (await tsv(
    `${ROOT_PATH}data/d3js/multiline-voronoi/data.tsv`
  )) as unknown as InitialDataItem[]

  const months: Date[] = Object.keys(dataItems[0])
    .map((v) => monthParse(v)!)
    .filter(Number)

  const cities: City[] = dataItems.map((initialCity: InitialDataItem) => {
    const name = initialCity.name
      .replace(/(msa|necta div|met necta|met div)$/i, "")
      .trim()

    return {
      metrics: months.map((date: Date) => {
        const itemKey = monthFormat(date)
        const { [itemKey as keyof InitialDataItem]: itemValue } = initialCity
        const employmentRate: number = Number(itemValue) / 100

        return {
          cityName: name,
          date,
          employmentRate,
        }
      }),
      name,
    }
  })

  return { cities, months }
}

type Config = ChartConfig<City, City["metrics"][number]>

const getLineId: Config["getLineId"] = (city) => city.name

const getLinePoints: Config["getLinePoints"] = (city) => city.metrics
const getPointYValue: Config["getPointYValue"] = (cityMetric) =>
  cityMetric.employmentRate

const getTooltipPart1: Config["getTooltipPart1"] = (cityMetric: CityMetric) =>
  `${cityMetric.cityName.trim()}: `

const getTooltipPart2: Config["getTooltipPart2"] = (cityMetric: CityMetric) => {
  const date = `${
    monthNames[cityMetric.date.getMonth()]
  } of ${cityMetric.date.getFullYear()}`

  return ` ${(cityMetric.employmentRate * 100).toFixed(2)}% - ${date}`
}

const getLineIdFromPoint: Config["getLineIdFromPoint"] = (cityMetric) =>
  cityMetric.cityName

const getPointXValue: Config["getPointXValue"] = (cityMetric) => cityMetric.date

const getChartConfig = ({
  cities,
  months,
}: {
  cities: City[]
  months: Date[]
}): Config => ({
  chartTitle: "US Unemployment Rate",
  getLineId,
  getLineIdFromPoint,
  getLinePoints,
  getPointXValue,
  getPointYValue,
  getTooltipPart1,
  getTooltipPart2,
  lines: cities,
  rootElId: CONTAINER_ID,
  times: months,
})

export { SHOW_VORONOI_ID, fetchData, getChartConfig }
