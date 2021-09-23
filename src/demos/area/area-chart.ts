import {
  Selection,
  area as areaD3,
  axisBottom,
  axisLeft,
  format,
  line as lineD3,
  max,
  min,
  scaleLinear,
  scaleQuantize,
  select,
} from "d3"
import { Delaunay } from "d3-delaunay"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./area-chart.module.css"

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

type ChartConfig<AreaPoint> = {
  areaPoints: AreaPoint[]
  chartTitle: string
  getItemId: (areaPoint: AreaPoint) => number
  getItemTitle: (areaPoint: AreaPoint) => string
  getItemXValue: (areaPoint: AreaPoint) => number
  getItemYValue: (areaPoint: AreaPoint) => number
  rootElId: string
}

type ChartReturn = {
  toggleVoronoi: () => void
}

const renderChart = <AreaPoint>(
  chartConfig: ChartConfig<AreaPoint>
): ChartReturn => {
  const { areaPoints, rootElId } = chartConfig
  const { width: elWidth } = (
    document.getElementById(rootElId) as HTMLElement
  ).getBoundingClientRect()
  const isSmallDevice = elWidth < 500

  const voronoiGroupClass = `voronoi-group-${uuidv1().slice(0, 6)}`
  const pointClassPrefix = `point-${uuidv1().slice(0, 6)}-`

  const margin = {
    bottom: 50,
    left: isSmallDevice ? 50 : 70,
    right: isSmallDevice ? 10 : 50,
    top: 50,
  }

  const height = 400 - margin.top - margin.bottom
  const titleYOffset = -15
  const axisTickSize = 10

  const width = elWidth - margin.left - margin.right

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("class", styles.areaChart)

  svg
    .append("text")
    .attr("class", styles.chartTitle)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2},${titleYOffset})`)
    .text(chartConfig.chartTitle)
    .style("font-weight", "bold")

  filterBlackOpacity({
    deviation: 2,
    id: "points",
    slope: 0.5,
    svg,
  })

  const xMax = max(areaPoints, chartConfig.getItemXValue) as number
  const xMin = min(areaPoints, chartConfig.getItemXValue) as number

  const yMax = max(areaPoints, chartConfig.getItemYValue) as number
  const yMin = min(areaPoints, chartConfig.getItemYValue) as number

  const xScale = scaleLinear().domain([xMin, xMax]).range([0, width])
  const yScale = scaleLinear()
    .domain([yMax + 0.05, yMin - 0.05])
    .range([0, height])

  const extractXScale = (areaPoint: AreaPoint) =>
    xScale(chartConfig.getItemXValue(areaPoint))
  const extractYScale = (areaPoint: AreaPoint) =>
    yScale(chartConfig.getItemYValue(areaPoint))

  const getSmallDeviceTicksScale = () =>
    scaleQuantize()
      .domain([0, 500])
      .range(Array.from({ length: 6 }).map((...[, rangeIndex]) => rangeIndex))

  const ticks = isSmallDevice ? getSmallDeviceTicksScale()(elWidth) : null

  const xAxis = axisBottom(xScale).tickFormat(format(".0f")).ticks(ticks)
  const yAxis = axisLeft(yScale)
    .tickFormat(format(".0%"))
    .tickSize(axisTickSize)

  svg
    .append("g")
    .attr("class", `${styles.x} ${styles.axis}`)
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("dy", "1.25em")

  svg
    .append("g")
    .attr("class", `${styles.y} ${styles.axis}`)
    .call(yAxis)
    .selectAll("text")
    .attr("dx", "-.25em")

  const area = areaD3<AreaPoint>().x(extractXScale).y0(height).y1(extractYScale)
  const line = lineD3<AreaPoint>().x(extractXScale).y(extractYScale)

  svg
    .append("path")
    .datum(areaPoints)
    .attr("class", styles.line)
    .attr("d", line)
    .attr("clip-path", "url(#clip)")

  svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("height", height)
    .attr("width", width)

  svg
    .append("path")
    .datum(areaPoints)
    .attr("class", styles.area)
    .attr("d", area)
    .attr("clip-path", "url(#clip)")

  const voronoi = Delaunay.from(
    areaPoints,
    extractXScale,
    extractYScale
  ).voronoi([
    -margin.left,
    -margin.top,
    width + margin.right,
    height + margin.bottom,
  ])

  const mouseover = (...[, areaPoint]: [unknown, AreaPoint]) => {
    select(`.${pointClassPrefix}${chartConfig.getItemId(areaPoint)}`).style(
      "display",
      "block"
    )
  }

  const mouseleave = (...[, areaPoint]: [unknown, AreaPoint]) => {
    select(`.${pointClassPrefix}${chartConfig.getItemId(areaPoint)}`).style(
      "display",
      "none"
    )
  }

  svg
    .selectAll("circle")
    .data(areaPoints)
    .enter()
    .append("circle")
    .attr(
      "transform",
      (areaPoint: AreaPoint) =>
        `translate(${extractXScale(areaPoint)},${extractYScale(areaPoint)})`
    )
    .attr("r", "5px")
    .attr(
      "class",
      (areaPoint) =>
        `${styles.point} ${pointClassPrefix}${chartConfig.getItemId(areaPoint)}`
    )
    .style("filter", "url(#drop-shadow-points)")

  const voronoiGroup = svg.append("g").attr("class", styles.voronoi)

  voronoiGroup
    .selectAll("path")
    .data(areaPoints)
    .enter()
    .append("path")
    .attr("d", (areaPoint) =>
      voronoi.renderCell(chartConfig.getItemId(areaPoint))
    )
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .attr("class", voronoiGroupClass)
    .attr("title", chartConfig.getItemTitle)

  $(`.${voronoiGroupClass}`).tooltip({
    track: true,
  })

  return {
    toggleVoronoi: () => {
      const currentClass = voronoiGroup.attr("class")
      const { showVoronoi } = styles

      const newClass = currentClass.includes(showVoronoi)
        ? currentClass.replace(showVoronoi, "").trim()
        : `${currentClass} ${showVoronoi}`

      voronoiGroup.attr("class", newClass)
    },
  }
}

export { ChartConfig, renderChart }
