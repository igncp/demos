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
  getIsHorizontalLabelBold: (label: string, labelIndex: number) => boolean
  getIsVerticalLabelBold: (label: string, labelIndex: number) => boolean
  getItemHorizontalIndex: (cell: ChartData) => number
  getItemTooltip: (cell: ChartData) => string
  getItemValue: (cell: ChartData) => number
  getItemVerticalIndex: (cell: ChartData) => number
  getLegendText: (cellValue: number) => string
  horizontalLabels: string[]
  rootElId: string
  verticalLabels: string[]
  weeklyData: ChartData[]
}

export const renderChart = <ChartData>(chartConfig: ChartConfig<ChartData>) => {
  const { rootElId, weeklyData } = chartConfig
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

  const max = maxD3(weeklyData, (cell) => chartConfig.getItemValue(cell))

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
      (...[label, labelIndex]) =>
        `verticalLabel ${styles.mono} axis${
          chartConfig.getIsVerticalLabelBold(label, labelIndex)
            ? ` ${styles.axisBold}`
            : ""
        }`
    )
    .attr("transform", `translate(${axisOffset},${cellSize / 1.5})`)
    .attr("x", 0)
    .attr("y", (...[, labelIndex]) => labelIndex * cellSize)
    .style("text-anchor", "end")

  svg
    .selectAll(".horizontalLabel")
    .data(horizontalLabels)
    .enter()
    .append("text")
    .text((label) => label)
    .attr(
      "class",
      (...[label, labelIndex]) =>
        `horizontalLabel ${styles.mono} axis${
          chartConfig.getIsHorizontalLabelBold(label, labelIndex)
            ? ` ${styles.axisBold}`
            : ""
        }`
    )
    .attr("transform", `translate(${cellSize / 2}, ${axisOffset})`)
    .attr("x", (...[, labelIndex]) => labelIndex * cellSize)
    .attr("y", 0)
    .style("text-anchor", "middle")

  const heatMap = svg
    .selectAll(".cell")
    .data(weeklyData)
    .enter()
    .append("rect")
    .attr("class", `cell ${styles.bordered}`)
    .attr("height", cellSize)
    .attr("rx", rectRadiusSize)
    .attr("ry", rectRadiusSize)
    .attr("width", cellSize)
    .attr(
      "x",
      (cellItem) => chartConfig.getItemHorizontalIndex(cellItem) * cellSize
    )
    .attr(
      "y",
      (cellItem) => chartConfig.getItemVerticalIndex(cellItem) * cellSize
    )
    .attr("title", chartConfig.getItemTooltip)
    .style("fill", colors[0])

  heatMap
    .transition()
    .duration(6000)
    .style("fill", (cellItem) => colorScale(chartConfig.getItemValue(cellItem)))

  $(".cell").tooltip()

  const legend = svg
    .selectAll(".legend")
    .data(
      [0].concat(colorScale.quantiles()),
      (legendValue) => legendValue as number
    )
    .enter()
    .append("g")
    .attr("class", "legend")

  legend
    .append("rect")
    .attr("x", (...[, valueIndex]) => legendElementWidth * valueIndex)
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", cellSize / 2)
    .style("fill", (...[, valueIndex]) => colors[valueIndex])
    .style("stroke", legendStroke)

  legend
    .append("text")
    .attr("class", styles.mono)
    .text(chartConfig.getLegendText)
    .style("text-anchor", "middle")
    .attr(
      "x",
      (...[, valueIndex]) =>
        legendElementWidth * valueIndex + legendElementWidth / 2
    )
    .attr("y", height + cellSize)
}
