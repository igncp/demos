import { csv, timeParse } from "d3"
import qs from "query-string"

import { ChartConfig, SortOrder } from "./timeline-bands-brush-chart"

export const CONTAINER_ID = "chart"

export type TimeBandItem = {
  end: Date
  instant: boolean
  label: string
  start: Date
  track: number
}

const toYear = (date: Date) => {
  const bcString = " BC"
  const year = date.getUTCFullYear()

  if (year >= 0) {
    return year.toString()
  }

  return bcString + Math.abs(year)
}

const parseDate = (dateString: string) => {
  const format = timeParse("%Y-%m-%d")

  let date = format(dateString)

  if (date !== null) {
    return date
  }

  const year = isNaN(Number(dateString))
    ? -dateString.replace(/[^0-9]/g, "")
    : +dateString

  if (year < 0 || year > 99) {
    date = new Date(year, 6, 1)
  } else if (year === 0) {
    date = new Date(-1, 6, 1)
  } else {
    date = new Date(year, 6, 1)
    date.setUTCFullYear(year)
  }

  return date
}

const yearMillis = 31622400000

export const fetchData = async (): Promise<TimeBandItem[]> => {
  const timeBandItems = (await csv(
    `${ROOT_PATH}data/d3js/philosophers-timeline/data.csv`
  )) as unknown as TimeBandItem[]
  const today = new Date()
  const instantOffset = 100 * yearMillis

  timeBandItems.forEach((timeBandItem) => {
    timeBandItem.start = parseDate(timeBandItem.start.toString())

    if ((timeBandItem.end as unknown) === "") {
      timeBandItem.end = new Date(timeBandItem.start.getTime() + instantOffset)
      timeBandItem.instant = true
    } else {
      timeBandItem.end = parseDate(timeBandItem.end.toString())
      timeBandItem.instant = false
    }

    if (timeBandItem.end > today) {
      timeBandItem.end = today
    }
  })

  return timeBandItems
}

type Config = ChartConfig<TimeBandItem>

const getItemLimitLeft: Config["getItemLimitLeft"] = (timeBandItem) =>
  timeBandItem.start

const getItemLimitRight: Config["getItemLimitRight"] = (timeBandItem) =>
  timeBandItem.end

const getSortFn: Config["getSortFn"] =
  (sortOrder) =>
  (...[timeBandItemA, timeBandItemB]: [TimeBandItem, TimeBandItem]) => {
    const factor = sortOrder === SortOrder.Ascending ? 1 : -1
    const startDiff = Number(timeBandItemA.start) - Number(timeBandItemB.start)

    if (startDiff !== 0) {
      return startDiff * factor
    }

    return (Number(timeBandItemB.end) - Number(timeBandItemA.end)) * factor
  }

const getItemText: Config["getItemText"] = ({
  chartItem: timeBandItem,
  maxLetters,
}) => {
  if (timeBandItem.label.length > maxLetters) {
    return `${timeBandItem.label.substr(0, maxLetters - 1)}..`
  }

  return timeBandItem.label
}

const getItemTitle: Config["getItemTitle"] = (timeBandItem) => {
  if (timeBandItem.instant) {
    return `${timeBandItem.label}: ${toYear(timeBandItem.start)}`
  }

  return `${timeBandItem.label}: ${toYear(timeBandItem.start)} - ${toYear(
    timeBandItem.end
  )}`
}

const onChartItemClick: Config["onChartItemClick"] = (timelineChart) => {
  const query = !timelineChart.instant
    ? `Philosopher ${timelineChart.label} ${
        (timelineChart.end as unknown) ? timelineChart.end.getFullYear() : ""
      }`.trim()
    : timelineChart.label

  window.open(
    `https://www.google.com/search?${qs.stringify({
      q: query,
    })}`
  )
}

const chartTitle = "Philosophers through History"

export const getChartConfig = (): Config => ({
  chartTitle,
  getItemLimitLeft,
  getItemLimitRight,
  getItemText,
  getItemTitle,
  getSortFn,
  onChartItemClick,
  rootElId: CONTAINER_ID,
})
