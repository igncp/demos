import { max as maxD3, scaleQuantile, select } from "d3"

import * as styles from "./weekly-heatmap.module.css"

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
const { length: buckets } = colors

const margin = {
  bottom: 100,
  left: 50,
  right: 50,
  top: 50,
}

const rectRadiusSize = 100
const extraHeight = 60
const axisOffset = -6

const legendStroke = "#ccc"

export type ChartConfig<ChartData> = {
  data: ChartData[]
  getIsHorizontalLabelBold: (a: string, i: number) => boolean
  getIsVerticalLabelBold: (a: string, i: number) => boolean
  getItemHorizontalIndex: (a: ChartData) => number
  getItemTooltip: (a: ChartData) => string
  getItemValue: (a: ChartData) => number
  getItemVerticalIndex: (a: ChartData) => number
  getLegendText: (value: number) => string
  horizontalLabels: string[]
  rootElId: string
  verticalLabels: string[]
}

export const renderChart = <ChartData>(chartConfig: ChartConfig<ChartData>) => {
  const { data, rootElId } = chartConfig
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.weeklyHeatmapChart)

  const { horizontalLabels, verticalLabels } = chartConfig

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right
  const height =
    Math.ceil((width * 10) / horizontalLabels.length) -
    margin.top -
    margin.bottom +
    extraHeight
  const cellSize = Math.floor(width / horizontalLabels.length)
  const legendElementWidth = cellSize * 2

  const max = maxD3(data, (item) => chartConfig.getItemValue(item))

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
    .selectAll(".verticalLabel")
    .data(verticalLabels)
    .enter()
    .append("text")
    .text((label) => label)
    .attr(
      "class",
      (label, labelIndex) =>
        `verticalLabel ${styles.mono} axis${
          chartConfig.getIsVerticalLabelBold(label, labelIndex)
            ? ` ${styles.axisBold}`
            : ""
        }`
    )
    .attr("transform", `translate(${axisOffset},${cellSize / 1.5})`)
    .attr("x", 0)
    .attr("y", (_label, labelIndex) => labelIndex * cellSize)
    .style("text-anchor", "end")

  svg
    .selectAll(".horizontalLabel")
    .data(horizontalLabels)
    .enter()
    .append("text")
    .text((label) => label)
    .attr(
      "class",
      (label, labelIndex) =>
        `horizontalLabel ${styles.mono} axis${
          chartConfig.getIsHorizontalLabelBold(label, labelIndex)
            ? ` ${styles.axisBold}`
            : ""
        }`
    )
    .attr("transform", `translate(${cellSize / 2}, ${axisOffset})`)
    .attr("x", (_label, labelIndex) => labelIndex * cellSize)
    .attr("y", 0)
    .style("text-anchor", "middle")

  const heatMap = svg
    .selectAll(".cell")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", `cell ${styles.bordered}`)
    .attr("height", cellSize)
    .attr("rx", rectRadiusSize)
    .attr("ry", rectRadiusSize)
    .attr("width", cellSize)
    .attr("x", (item) => chartConfig.getItemHorizontalIndex(item) * cellSize)
    .attr("y", (item) => chartConfig.getItemVerticalIndex(item) * cellSize)
    .attr("title", chartConfig.getItemTooltip)
    .style("fill", colors[0])

  heatMap
    .transition()
    .duration(6000)
    .style("fill", (item) => colorScale(chartConfig.getItemValue(item)))

  $(".cell").tooltip()

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
    .attr("class", styles.mono)
    .text(chartConfig.getLegendText)
    .style("text-anchor", "middle")
    .attr(
      "x",
      (_value, valueIndex) =>
        legendElementWidth * valueIndex + legendElementWidth / 2
    )
    .attr("y", height + cellSize)
}
