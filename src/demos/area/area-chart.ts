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

import * as styles from "./area.module.css"

const filterBlackOpacity = (
  id: string,
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>,
  deviation: number,
  slope: number
) => {
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

export type ChartConfig<A> = {
  getChartTitle: () => string
  getItemId: (a: A) => number
  getItemTitle: (a: A) => string
  getItemXValue: (a: A) => number
  getItemYValue: (a: A) => number
  items: A[]
  rootElId: string
}

type ChartReturn = {
  toggleVoronoi: () => void
}

export const renderChart = <A>(chartConfig: ChartConfig<A>): ChartReturn => {
  const { items, rootElId } = chartConfig
  const { width: elWidth } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()
  const isSmallDevice = elWidth < 500

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
    .text(chartConfig.getChartTitle())
    .style("font-weight", "bold")

  filterBlackOpacity("points", svg, 2, 0.5)

  const xMax = max(items, chartConfig.getItemXValue) as number
  const xMin = min(items, chartConfig.getItemXValue) as number

  const yMax = max(items, chartConfig.getItemYValue) as number
  const yMin = min(items, chartConfig.getItemYValue) as number

  const xScale = scaleLinear().domain([xMin, xMax]).range([0, width])
  const yScale = scaleLinear()
    .domain([yMax + 0.05, yMin - 0.05])
    .range([0, height])

  const extractXScale = (d: A) => xScale(chartConfig.getItemXValue(d))
  const extractYScale = (d: A) => yScale(chartConfig.getItemYValue(d))

  const getSmallDeviceTicksScale = () =>
    scaleQuantize()
      .domain([0, 500])
      .range(Array.from({ length: 6 }).map((_, i) => i))

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

  const area = areaD3<A>().x(extractXScale).y0(height).y1(extractYScale)
  const line = lineD3<A>().x(extractXScale).y(extractYScale)

  svg
    .append("path")
    .datum(items)
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
    .datum(items)
    .attr("class", styles.area)
    .attr("d", area)
    .attr("clip-path", "url(#clip)")

  const voronoi = Delaunay.from(items, extractXScale, extractYScale).voronoi([
    -margin.left,
    -margin.top,
    width + margin.right,
    height + margin.bottom,
  ])

  const mouseover = (_e: unknown, d: A) => {
    select(`.point-${chartConfig.getItemId(d)}`).style("display", "block")
  }

  const mouseleave = (_mouseEvent: unknown, d: A) => {
    select(`.point-${chartConfig.getItemId(d)}`).style("display", "none")
  }

  svg
    .selectAll("circle")
    .data(items)
    .enter()
    .append("circle")
    .attr(
      "transform",
      (item: A) => `translate(${extractXScale(item)},${extractYScale(item)})`
    )
    .attr("r", "5px")
    .attr(
      "class",
      (item) => `${styles.point} point-${chartConfig.getItemId(item)}`
    )
    .style("filter", "url(#drop-shadow-points)")

  const voronoiGroup = svg.append("g").attr("class", styles.voronoi)

  voronoiGroup
    .selectAll("path")
    .data(items)
    .enter()
    .append("path")
    .attr("d", (item) => voronoi.renderCell(chartConfig.getItemId(item)))
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .attr("class", "voronoi-group")
    .attr("title", chartConfig.getItemTitle)

  $(".voronoi-group").tooltip({
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
