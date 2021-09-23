import {
  Selection,
  axisBottom,
  axisTop,
  extent,
  line as lineD3,
  scaleLinear,
  scaleTime,
  select,
} from "d3"
import { v1 as uuid } from "uuid"

import * as styles from "./crossing-lines-chart.module.css"

// @TODO make it more generic to allow other y type in addition to Date

type HorizontalMarker = {
  key: string
  label: string
  position: number
}

type Point = {
  horizontalMarker: HorizontalMarker
  lineId: number
  x: Date | null
}

enum LineStyle {
  Black = "Black",
  Orange = "Orange",
  Red = "Red",
}

type Line = {
  id: number
  points: Point[]
}

type CrossingLines = {
  horizontalMarkers: HorizontalMarker[]
  lines: Line[]
}

type Redraw = (range: [Date, Date]) => void

const lineStyleToClassName: { [key in LineStyle]: string } = {
  [LineStyle.Red]: styles.redLine,
  [LineStyle.Orange]: styles.orangeLine,
  [LineStyle.Black]: styles.blackLine,
}

const filterBlackOpacity = ({
  deviation,
  id,
  slope,
  svg,
}: {
  deviation: number
  id: string
  slope: number
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
}) => {
  const defs = svg.append("defs")
  const filter = defs
    .append("filter")
    .attr("height", "500%")
    .attr("id", `drop-shadow-${id}`)
    .attr("width", "500%")
    .attr("x", "-200%")
    .attr("y", "-200%")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", deviation)

  filter.append("feOffset").attr("dx", 1).attr("dy", 1)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", slope)
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")

  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const margin = {
  bottom: 50,
  left: 120,
  right: 50,
  top: 80,
}

const height = 600 - margin.top - margin.bottom

type ChartConfig = {
  chartTitle: string
  crossingLinesData: CrossingLines
  getLineStyle: (line: Line) => LineStyle
  getLineTitle: (line: Line) => string
  getPointTitle: (point: Point) => string
  getXAxisLabel: (date: Date) => string
  onPointClick: (point: Point) => void
  rootElId: string
}

const renderChart = (chartConfig: ChartConfig) => {
  const { crossingLinesData, rootElId } = chartConfig
  const { horizontalMarkers, lines } = crossingLinesData
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.mareysScheduleChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const linePathClass = `line-${uuid().slice(0, 6)}`
  const pointCircleClass = `point-${uuid().slice(0, 6)}`
  const filterId = `lines-${uuid().slice(0, 6)}`
  const clipId = `clip-${uuid().slice(0, 6)}`

  const redraw: Redraw = ([timeStart, timeEnd]) => {
    const x = scaleTime().domain([timeStart, timeEnd]).range([0, width])
    const y = scaleLinear().range([0, height])
    const xAxisTop = axisTop<Date>(x)
      .ticks(8)
      .tickFormat(chartConfig.getXAxisLabel)
    const xAxisBottom = axisBottom<Date>(x)
      .ticks(8)
      .tickFormat(chartConfig.getXAxisLabel)

    const svg = select(`#${rootElId}`)
      .text("")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    svg
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2},-40)`)
      .text(chartConfig.chartTitle)
      .style("font-weight", "bold")

    filterBlackOpacity({
      deviation: 2,
      id: filterId,
      slope: 0.2,
      svg,
    })

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

    y.domain(
      extent(
        horizontalMarkers,
        (horizontalMarker) => horizontalMarker.position
      ) as [number, number]
    )

    const horizontalMarkersSelection = svg
      .append("g")
      .attr("class", styles.horizontalMarker)
      .selectAll("g")
      .data(horizontalMarkers)
      .enter()
      .append("g")
      .attr(
        "transform",
        (horizontalMarker) => `translate(0,${y(horizontalMarker.position)})`
      )

    horizontalMarkersSelection
      .append("text")
      .attr("x", -6)
      .attr("dy", ".35em")
      .text((horizontalMarker) => horizontalMarker.label)

    horizontalMarkersSelection.append("line").attr("x2", width)
    svg.append("g").attr("class", `x top ${styles.axis}`).call(xAxisTop)
    svg
      .append("g")
      .attr("class", `x bottom ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(xAxisBottom)

    const mouseover = (...[, line]: [unknown, Line]) => {
      select(`.line-${line.id}`).select("path").style("stroke-width", "5px")
    }

    const mouseleave = (...[, line]: [unknown, Line]) => {
      select(`.line-${line.id}`).select("path").style("stroke-width", "2.5px")
    }

    const linesSelection = svg
      .append("g")
      .attr("class", styles.line)
      .attr("clip-path", `url(#${clipId})`)
      .selectAll("g")
      .data(lines)
      .enter()
      .append("g")
      .attr("class", (crossingLine) => {
        const lineStyle = chartConfig.getLineStyle(crossingLine)
        const { [lineStyle]: lineClass } = lineStyleToClassName

        return `${lineClass} line-${crossingLine.id}`
      })
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

    const line = lineD3<Point>()
      .x((point) => x(point.x!))
      .y((point) => y(point.horizontalMarker.position))

    linesSelection
      .append("path")
      .attr("d", (crossingLine) => line(crossingLine.points))
      .attr("class", linePathClass)
      .attr("title", chartConfig.getLineTitle)

    linesSelection
      .selectAll("circle")
      .data((crossingLine) => crossingLine.points)
      .enter()
      .append("circle")
      .style("cursor", "pointer")
      .on("click", (...[, point]) => chartConfig.onPointClick(point))
      .attr(
        "transform",
        (point) =>
          `translate(${x(point.x!)},${y(point.horizontalMarker.position)})`
      )
      .style("filter", `url(#drop-shadow-${filterId})`)
      .attr("r", "5px")
      .attr("class", pointCircleClass)
      .attr("title", (point) => chartConfig.getPointTitle(point))

    $(`.${linePathClass}`).tooltip({
      track: true,
    })
    $(`.${pointCircleClass}`).tooltip({
      track: true,
    })
  }

  return {
    refresh: (limits: [Date, Date]) => {
      redraw(limits)
    },
  }
}

export { ChartConfig, HorizontalMarker, LineStyle, Redraw, renderChart }
