import {
  BaseType,
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

const animationDuration = 1000

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
  chartTitleShort: string
  getItemId: (areaPoint: AreaPoint) => number
  getItemTitle: (areaPoint: AreaPoint) => string
  getItemXValue: (areaPoint: AreaPoint) => number
  getItemYValue: (areaPoint: AreaPoint) => number
  rootElId: string
}

interface BaseChart {
  refresh: () => void
  tearDown: () => void
  toggleVoronoi: () => void
}

type CommonSelection<El extends BaseType> = Selection<
  El,
  unknown,
  HTMLElement,
  unknown
>

class AreaChart<AreaPoint> implements BaseChart {
  private readonly config: ChartConfig<AreaPoint>
  private readonly elements: {
    areaSel: CommonSelection<SVGPathElement>
    chartTitleSel: CommonSelection<SVGTextElement>
    clipRect: CommonSelection<SVGRectElement>
    lineSel: CommonSelection<SVGPathElement>
    svg: CommonSelection<SVGSVGElement>
    svgG: CommonSelection<SVGGElement>
    voronoiGroup: CommonSelection<SVGGElement>
    xAxisSel: CommonSelection<SVGGElement>
    yAxisSel: CommonSelection<SVGGElement>
  }

  private hasVoronoi = false

  private dimensions!: {
    height: number
    innerWidth: number
    isSmallDevice: boolean
    margin: {
      bottom: number
      left: number
      right: number
      top: number
    }
    width: number
  }

  private constructor(chartConfig: ChartConfig<AreaPoint>) {
    this.config = chartConfig

    const { rootElId } = chartConfig

    const svg = select(`#${rootElId}`).append("svg")
    const svgG = svg.append("g").attr("class", styles.areaChart)
    const chartTitleSel = svgG
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
    const xAxisSel = svgG.append("g")
    const yAxisSel = svgG.append("g")
    const lineSel = svgG.append("path")
    const areaSel = svgG.append("path")
    const voronoiGroup = svgG.append("g")
    const clipRect = svgG.append("clipPath").attr("id", "clip").append("rect")

    filterBlackOpacity({
      deviation: 2,
      id: "points",
      slope: 0.5,
      svg: svgG,
    })

    this.elements = {
      areaSel,
      chartTitleSel,
      clipRect,
      lineSel,
      svg,
      svgG,
      voronoiGroup,
      xAxisSel,
      yAxisSel,
    }

    this.render()

    window.addEventListener("resize", this.handleWindowResize)
  }

  public static renderChart<AreaPoint>(chartConfig: ChartConfig<AreaPoint>) {
    return new AreaChart(chartConfig)
  }

  public toggleVoronoi() {
    this.hasVoronoi = !this.hasVoronoi
    this.setVoronoi()
  }

  public refresh() {
    this.render()
  }

  public tearDown() {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  private render() {
    this.setDimensions()

    const { config: chartConfig } = this

    const { areaPoints } = chartConfig
    const tooltipItemClass = `tooltip-item-${uuidv1().slice(0, 6)}`
    const pointClassPrefix = `point-${uuidv1().slice(0, 6)}-`

    const titleYOffset = -15
    const axisTickSize = 10

    const {
      dimensions: { height, innerWidth, isSmallDevice, margin, width },
      elements: {
        areaSel,
        chartTitleSel,
        clipRect,
        lineSel,
        svg,
        svgG,
        voronoiGroup,
        xAxisSel,
        yAxisSel,
      },
    } = this

    svg
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", innerWidth + margin.left + margin.right)

    svgG.attr("transform", `translate(${margin.left},${margin.top})`)

    chartTitleSel
      .attr(
        "transform",
        `translate(${width / 2 - margin.left},${titleYOffset})`
      )
      .text(() =>
        isSmallDevice ? chartConfig.chartTitleShort : chartConfig.chartTitle
      )

    const xMax = max(areaPoints, chartConfig.getItemXValue) as number
    const xMin = min(areaPoints, chartConfig.getItemXValue) as number

    const yMax = max(areaPoints, chartConfig.getItemYValue) as number
    const yMin = min(areaPoints, chartConfig.getItemYValue) as number

    const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth])
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

    const ticks = isSmallDevice ? getSmallDeviceTicksScale()(width) : null

    const xAxis = axisBottom(xScale).tickFormat(format(".0f")).ticks(ticks)
    const yAxis = axisLeft(yScale)
      .tickFormat(format(".0%"))
      .tickSize(axisTickSize)

    xAxisSel
      .attr("class", `${styles.x} ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("dy", "1.25em")

    yAxisSel
      .attr("class", `${styles.y} ${styles.axis}`)
      .call(yAxis)
      .selectAll("text")
      .attr("dx", "-.25em")

    const area = areaD3<AreaPoint>()
      .x(extractXScale)
      .y0(height)
      .y1(extractYScale)
    const line = lineD3<AreaPoint>().x(extractXScale).y(extractYScale)

    lineSel
      .datum(areaPoints)
      .attr("clip-path", "url(#clip)")
      .attr("class", styles.line)
      .transition()
      .duration(animationDuration)
      .attr("d", line)

    clipRect.attr("height", height).attr("width", innerWidth)

    areaSel
      .datum(areaPoints)
      .attr("class", styles.area)
      .attr("clip-path", "url(#clip)")
      .transition()
      .duration(animationDuration)
      .attr("d", area)

    const voronoi = Delaunay.from(
      areaPoints,
      extractXScale,
      extractYScale
    ).voronoi([
      -margin.left,
      -margin.top,
      innerWidth + margin.right,
      height + margin.bottom,
    ])

    const mouseenter = (...[, areaPoint]: [unknown, AreaPoint]) => {
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

    const circleData = svgG.selectAll("circle").data(areaPoints)

    circleData.enter().append("circle")
    circleData.exit().remove()

    svgG
      .selectAll<SVGCircleElement, AreaPoint>("circle")
      .attr("r", "5px")
      .style("filter", "url(#drop-shadow-points)")
      .attr(
        "transform",
        (areaPoint: AreaPoint) =>
          `translate(${extractXScale(areaPoint)},${extractYScale(areaPoint)})`
      )
      .attr(
        "class",
        (areaPoint) =>
          `${
            styles.point
          } ${tooltipItemClass} ${pointClassPrefix}${chartConfig.getItemId(
            areaPoint
          )}`
      )
      .on("mouseenter", mouseenter)
      .on("mouseleave", mouseleave)
      .attr("title", chartConfig.getItemTitle)

    const voronoiData = voronoiGroup
      .selectAll<SVGPathElement, AreaPoint>("path")
      .data(areaPoints, (point) => chartConfig.getItemId(point))

    voronoiData.enter().append("path")
    voronoiData.exit().remove()

    voronoiGroup
      .attr("class", styles.voronoi)
      .selectAll<SVGPathElement, AreaPoint>("path")
      .on("mouseenter", mouseenter)
      .on("mouseleave", mouseleave)
      .attr("class", tooltipItemClass)
      .attr("title", chartConfig.getItemTitle)
      .transition()
      .duration(animationDuration)
      .attr("d", (areaPoint) =>
        voronoi.renderCell(chartConfig.getItemId(areaPoint))
      )

    $(`.${tooltipItemClass}`).tooltip({
      track: true,
    })

    this.setVoronoi()
  }

  private setVoronoi() {
    const {
      elements: { voronoiGroup },
      hasVoronoi,
    } = this
    const currentClass = voronoiGroup.attr("class")
    const { showVoronoi } = styles

    const currentClassWithoutVoronoi = currentClass
      .replace(showVoronoi, "")
      .trim()

    const newClass = hasVoronoi
      ? `${currentClassWithoutVoronoi} ${showVoronoi}`
      : currentClassWithoutVoronoi

    voronoiGroup.attr("class", newClass)
  }

  private setDimensions() {
    const {
      config: { rootElId },
    } = this
    const { width } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()
    const isSmallDevice = width < 500

    const margin = {
      bottom: 50,
      left: isSmallDevice ? 50 : 70,
      right: isSmallDevice ? 10 : 50,
      top: 50,
    }

    const innerWidth = width - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    this.dimensions = {
      height,
      innerWidth,
      isSmallDevice,
      margin,
      width,
    }
  }

  private readonly handleWindowResize = () => {
    this.render()
  }
}

export { ChartConfig, AreaChart }
