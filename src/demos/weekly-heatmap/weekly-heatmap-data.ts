import { tsv } from "d3"

import { CONTAINER_ID } from "./ui-constants"
import { ChartConfig } from "./weekly-heatmap-chart"

const UPDATE_BUTTON_ID = "update-random"

type TimeItem = {
  arbitraryMetric: number
  day: number
  hour: number
}

type TimeItemOriginal = {
  day: number
  hour: number
  value: number // eslint-disable-line id-denylist
}

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const hours = Array.from({ length: 24 }).map(
  (...[, hourIndex]: [unknown, number]) => {
    const normalizedHour = hourIndex % 12

    return `${normalizedHour + 1}${
      hourIndex >= 11 && hourIndex !== 23 ? "pm" : "am"
    }`
  }
)

const workingHourMin = 7
const workingHourMax = 16
const workingDayMin = 0
const workingDayMax = 4

const fetchData = async (): Promise<TimeItem[]> => {
  const weeklyTSVData = (await tsv(
    `${ROOT_PATH}data/d3js/weekly-heatmap/data.tsv`
  )) as unknown as TimeItemOriginal[]

  return weeklyTSVData.map((timeItem) => ({
    arbitraryMetric: +timeItem.value,
    day: +timeItem.day,
    hour: +timeItem.hour,
  }))
}

type Config = ChartConfig<TimeItem>

const getItemValue: Config["getItemValue"] = (timeItem) =>
  timeItem.arbitraryMetric

const getItemTooltip: Config["getItemTooltip"] = (timeItem) =>
  `Arbitrary Metric: ${timeItem.arbitraryMetric.toFixed(2)}`

const getItemHorizontalIndex: Config["getItemHorizontalIndex"] = (timeItem) =>
  timeItem.hour - 1

const getItemVerticalIndex: Config["getItemVerticalIndex"] = (timeItem) =>
  timeItem.day - 1

const getIsHorizontalLabelBold: Config["getIsHorizontalLabelBold"] = (
  ...[, hourIndex]
) => hourIndex >= workingHourMin && hourIndex <= workingHourMax

const getIsVerticalLabelBold: Config["getIsVerticalLabelBold"] = (
  ...[, dayIndex]
) => dayIndex >= workingDayMin && dayIndex <= workingDayMax

const getLegendText: Config["getLegendText"] = (arbitraryMetric) =>
  `≥ ${arbitraryMetric.toFixed(2)}`

const createChartConfig = (weeklyData: TimeItem[]): Config => ({
  getIsHorizontalLabelBold,
  getIsVerticalLabelBold,
  getItemHorizontalIndex,
  getItemTooltip,
  getItemValue,
  getItemVerticalIndex,
  getLegendText,
  horizontalLabels: hours,
  rootElId: CONTAINER_ID,
  verticalLabels: days,
  weeklyData,
})

export { TimeItem, UPDATE_BUTTON_ID, createChartConfig, fetchData }
