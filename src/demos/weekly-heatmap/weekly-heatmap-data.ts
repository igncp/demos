import { tsv } from "d3"

import { ChartConfig } from "./weekly-heatmap-chart"

export type TimeItem = {
  day: number
  hour: number
  value: number
}

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const hours = Array.from({ length: 24 }).map((_, index: number) => {
  const num = index % 12

  return `${num + 1} ${index >= 11 && index !== 23 ? "pm" : "am"}`
})

const workingHourMin = 7
const workingHourMax = 16
const workingDayMin = 0
const workingDayMax = 4

export const fetchData = async (): Promise<TimeItem[]> => {
  const data: any = await tsv(`${ROOT_PATH}data/d3js/weekly-heatmap/data.tsv`)

  return data.map((timeItem: TimeItem) => ({
    day: +timeItem.day,
    hour: +timeItem.hour,
    value: +timeItem.value,
  }))
}

type Config = ChartConfig<TimeItem>

const getItemValue: Config["getItemValue"] = (item) => item.value
const getItemTooltip: Config["getItemTooltip"] = (timeItem) =>
  `Value: ${timeItem.value}`
const getItemHorizontalIndex: Config["getItemHorizontalIndex"] = (timeItem) =>
  timeItem.hour - 1
const getItemVerticalIndex: Config["getItemVerticalIndex"] = (timeItem) =>
  timeItem.day - 1
const getIsHorizontalLabelBold: Config["getIsHorizontalLabelBold"] = (
  _hour,
  hourIndex
) => hourIndex >= workingHourMin && hourIndex <= workingHourMax

const getIsVerticalLabelBold: Config["getIsVerticalLabelBold"] = (
  _day,
  dayIndex
) => dayIndex >= workingDayMin && dayIndex <= workingDayMax

const getLegendText: Config["getLegendText"] = (value) =>
  `≥ ${value.toFixed(2)}`

export const createChartConfig = (data: TimeItem[]): Config => ({
  data,
  getIsHorizontalLabelBold,
  getIsVerticalLabelBold,
  getItemHorizontalIndex,
  getItemTooltip,
  getItemValue,
  getItemVerticalIndex,
  getLegendText,
  horizontalLabels: hours,
  rootElId: "chart",
  verticalLabels: days,
})
