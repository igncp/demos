import { max as maxD3, scaleQuantile, select, tsv } from "d3"

import "./weekly-heatmap.styl"

type TimeItem = {
  day: number
  hour: number
  value: number
}

const colors = [
  "#ffffd9",
  "#edf8b1",
  "#c7e9b4",
  "#7fcdbb",
  "#41b6c4",
  "#1d91c0",
  "#225ea8",
  "#253494",
  "#081d58",
]
const buckets = colors.length

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const hours = [
  "1 am",
  "2 am",
  "3 am",
  "4 am",
  "5 am",
  "6 am",
  "7 am",
  "8 am",
  "9 am",
  "10 am",
  "11 am",
  "12 am",
  "1 pm",
  "2 pm",
  "3 pm",
  "4 pm",
  "5 pm",
  "6 pm",
  "7 pm",
  "8 pm",
  "9 pm",
  "10 pm",
  "11 pm",
  "12 pm",
]

const fetchData = async (): Promise<TimeItem[]> => {
  const data: any = await tsv(`${ROOT_PATH}data/d3js/weekly-heatmap/data.tsv`)

  return data.map((timeItem: TimeItem) => ({
    day: +timeItem.day,
    hour: +timeItem.hour,
    value: +timeItem.value,
  }))
}

const margin = {
  bottom: 100,
  left: 50,
  right: 50,
  top: 50,
}

const hoursInDay = 24
const rectRadiusSize = 100
const extraHeight = 60
const axisOffset = -6

const workingDayMin = 0
const workingDayMax = 4
const workingHourMin = 7
const workingHourMax = 16

const legendStroke = "#ccc"

const renderChart = async ({
  data,
  rootElId,
}: {
  data: TimeItem[]
  rootElId: string
}) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add("weekly-heatmap-chart")

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right
  const height =
    Math.ceil((width * 10) / hoursInDay) -
    margin.top -
    margin.bottom +
    extraHeight
  const cellSize = Math.floor(width / hoursInDay)
  const legendElementWidth = cellSize * 2

  const max = maxD3(data, (timeItem) => timeItem.value)

  const colorScale = scaleQuantile<string>()
    .domain([0, buckets - 1, max])
    .range(colors)

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  svg
    .selectAll(".dayLabel")
    .data(days)
    .enter()
    .append("text")
    .text((day) => day)
    .attr("class", (_d, dayIndex) => {
      if (dayIndex >= workingDayMin && dayIndex <= workingDayMax) {
        return "dayLabel mono axis axis-workweek"
      }

      return "dayLabel mono axis"
    })
    .attr("transform", `translate(${axisOffset},${cellSize / 1.5})`)
    .attr("x", 0)
    .attr("y", (_d, dayIndex) => dayIndex * cellSize)
    .style("text-anchor", "end")

  svg
    .selectAll(".timeLabel")
    .data(hours)
    .enter()
    .append("text")
    .text((hourStr) => hourStr)
    .attr("class", (_d, hourIndex) => {
      if (hourIndex >= workingHourMin && hourIndex <= workingHourMax) {
        return "timeLabel mono axis axis-worktime"
      }

      return "timeLabel mono axis"
    })
    .attr("transform", `translate(${cellSize / 2}, ${axisOffset})`)
    .attr("x", (_d, hourIndex) => hourIndex * cellSize)
    .attr("y", 0)
    .style("text-anchor", "middle")

  const heatMap = svg
    .selectAll(".hour")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "hour bordered")
    .attr("height", cellSize)
    .attr("rx", rectRadiusSize)
    .attr("ry", rectRadiusSize)
    .attr("width", cellSize)
    .attr("x", (timeItem) => (timeItem.hour - 1) * cellSize)
    .attr("y", (timeItem) => (timeItem.day - 1) * cellSize)
    .style("fill", colors[0])

  heatMap
    .transition()
    .duration(6000)
    .style("fill", (timeItem) => colorScale(timeItem.value))

  heatMap.attr("data-title", (timeItem) => `Value: ${timeItem.value}`)

  tooltip(".hour")

  const legend = svg
    .selectAll(".legend")
    .data<any>([0].concat(colorScale.quantiles()), (d) => d)
    .enter()
    .append("g")
    .attr("class", "legend")

  legend
    .append("rect")
    .attr("x", (_value, valueIndex) => legendElementWidth * valueIndex)
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", cellSize / 2)
    .style("fill", (_value, valueIndex) => colors[valueIndex])
    .style("stroke", legendStroke)

  legend
    .append("text")
    .attr("class", "mono")
    .text((value) => `≥ ${value.toFixed(2)}`)
    .attr("x", (_value, valueIndex) => legendElementWidth * valueIndex)
    .attr("y", height + cellSize)
}

// @TODO: tooltip not working
const tooltip = (selector: string) => {
  const opts = {
    leftOffst: 60,
    tOpts: {
      container: "body",
      delay: {
        hide: 0,
        show: 500,
      },
      viewport: {
        selector: "#chart svg",
      },
    },
    topOffst: 40,
  }

  const sel: any = $(selector)

  sel.tooltip(opts.tOpts)
}

const main = async () => {
  const data = await fetchData()

  renderChart({ data, rootElId: "chart" })
}

export default main
