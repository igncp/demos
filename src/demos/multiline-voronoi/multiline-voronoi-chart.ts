import {
  Selection,
  axisBottom,
  axisLeft,
  extent,
  line as lineD3,
  max,
  scaleLinear,
  scaleOrdinal,
  scaleTime,
  schemePastel2,
  select,
} from "d3"
import { Delaunay } from "d3-delaunay"

import * as styles from "./multiline-voronoi.module.css"

type LineId = string

type ChartConfig<ChartLine, ChartPoint> = Readonly<{
  chartTitle: string
  getLineId: (line: ChartLine) => LineId
  getLineIdFromPoint: (point: ChartPoint) => LineId
  getLinePoints: (line: ChartLine) => ChartPoint[]
  getPointXValue: (point: ChartPoint) => Date
  getPointYValue: (point: ChartPoint) => number
  getTooltipPart1: (point: ChartPoint) => string
  getTooltipPart2: (point: ChartPoint) => string
  lines: ChartLine[]
  rootElId: string
  times: Date[]
}>

const addFilter = (
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", "drop-shadow")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1)

  filter.append("feOffset").attr("dx", 1).attr("dy", 1)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", "1")
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const buildTooltip = (
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
) => {
  const tooltip = svgG
    .append("g")
    .attr("class", styles.tooltip)
    .attr("transform", "translate(-100,-100)")

  tooltip
    .append("rect")
    .attr("transform", "translate(-150,-50)")
    .attr("fill", "white")
    .attr("height", 50)
    .attr("width", 300)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("filter", "url(#drop-shadow)")
    .style("opacity", "0.65")
    .style("pointer-events", "none")
    .style("cursor", "default")

  tooltip.append("circle").attr("r", 3.5)
  tooltip.append("text").attr("class", "text1").attr("y", -30)
  tooltip.append("text").attr("class", "text2").attr("y", -10)

  return tooltip
}

type ChartElements = Readonly<{
  linesWrapper: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
  tooltip: Selection<SVGGElement, unknown, HTMLElement, unknown>
  voronoiGroup: Selection<SVGGElement, unknown, HTMLElement, unknown>
  xAxis: Selection<SVGGElement, unknown, HTMLElement, unknown>
  yAxis: Selection<SVGGElement, unknown, HTMLElement, unknown>
}>

class MultilineVoronoiChart<ChartLine, ChartPoint> {
  private readonly config: ChartConfig<ChartLine, ChartPoint>
  private readonly elements: ChartElements
  private readonly state: {
    clickToggle: boolean
    usedLines: ChartLine[]
  }

  public constructor(config: ChartConfig<ChartLine, ChartPoint>) {
    this.config = config

    const svg = select(`#${this.config.rootElId}`).append("svg")
    const svgG = svg.append("g")
    const xAxis = svgG.append("g").attr("class", `${styles.axis} axis--x`)
    const yAxis = svgG.append("g").attr("class", `${styles.axis} axis--y`)

    svgG
      .append("text")
      .attr("x", 20)
      .attr("dy", ".32em")
      .style("font-weight", "bold")
      .text(this.config.chartTitle)

    addFilter(svgG)

    const linesWrapper = svgG.append("g").attr("class", styles.lines)
    const voronoiGroup = svgG.append("g").attr("class", styles.voronoi)

    const tooltip = buildTooltip(svgG)

    this.elements = {
      linesWrapper,
      svg,
      svgG,
      tooltip,
      voronoiGroup,
      xAxis,
      yAxis,
    }

    this.state = {
      clickToggle: false,
      usedLines: this.config.lines,
    }

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  private static getMargin(width: number) {
    const defaultMargin = {
      bottom: 70,
      left: 80,
      right: 70,
      top: 60,
    }

    if (width < 530) {
      return {
        ...defaultMargin,
        left: 35,
        right: 5,
      }
    }

    return defaultMargin
  }

  public setVoronoi(newValue: boolean) {
    this.elements.voronoiGroup.classed(styles.voronoiShow, newValue)
  }

  private render() {
    const {
      config: { lines, rootElId, times },
      elements,
    } = this
    const color = scaleOrdinal(schemePastel2)

    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.multilineVoronoiChart)

    const { width: elWidth } = rootEl.getBoundingClientRect()
    const margin = MultilineVoronoiChart.getMargin(elWidth)
    const width =
      rootEl.getBoundingClientRect().width - margin.left - margin.right
    const isSmallDevice = width < 530

    const height = 500 - margin.top - margin.bottom

    const xScale = scaleTime().range([0, width])
    const yScale = scaleLinear().range([height, 0])

    const lineXTransformer = (point: ChartPoint) =>
      xScale(this.config.getPointXValue(point))
    const lineYTransformer = (point: ChartPoint) =>
      yScale(this.config.getPointYValue(point))

    const lineIdToElement: { [lineId: string]: SVGPathElement } = {}

    elements.svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    elements.svgG.attr("transform", `translate(${margin.left},${margin.top})`)

    xScale.domain(extent<Date>(times) as [Date, Date])
    yScale
      .domain([
        0,
        max(lines, (line) =>
          max(this.config.getLinePoints(line), this.config.getPointYValue)
        ) as number,
      ])
      .nice()

    elements.xAxis
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(xScale).ticks(isSmallDevice ? 2 : undefined))

    elements.yAxis.call(axisLeft(yScale).ticks(10, "%"))

    const line = lineD3<ChartPoint>().x(lineXTransformer).y(lineYTransformer)

    const {
      config,
      state: { usedLines },
    } = this

    const updatedLines = elements.linesWrapper.selectAll("path").data(usedLines)

    updatedLines.enter().append("path").style("filter", "url(#drop-shadow)")
    updatedLines.exit().remove()

    elements.linesWrapper
      .selectAll<SVGPathElement, ChartLine>("path")
      .attr("d", function generateLine(usedLine) {
        const usedLineId = config.getLineId(usedLine)

        lineIdToElement[usedLineId] = this

        const points = config.getLinePoints(usedLine)

        return line(points)
      })
      .style("stroke", (...[, lineIndex]) => color(lineIndex.toString()))

    const mouseout = (...[, point]: [unknown, ChartPoint]) => {
      const lineId = config.getLineIdFromPoint(point)
      const { [lineId]: linePath } = lineIdToElement

      select(linePath).classed(styles.lineHover, false)

      return elements.tooltip.attr("transform", "translate(-100,-100)")
    }

    const clicked = (...[, point]: [unknown, ChartPoint]) => {
      this.state.clickToggle = !this.state.clickToggle

      this.state.usedLines = (() => {
        if (this.state.clickToggle) {
          const lineData = lines.find(
            (lineItem) =>
              config.getLineId(lineItem) === config.getLineIdFromPoint(point)
          ) as ChartLine

          return [lineData]
        }

        return lines
      })()

      elements.tooltip.on("mouseover", null).on("click", null)

      this.render()
    }

    const mouseover = (...[, point]: [unknown, ChartPoint]) => {
      const lineId = config.getLineIdFromPoint(point)
      const { [lineId]: linePath } = lineIdToElement

      select(linePath).classed(styles.lineHover, true)
      ;(linePath.parentNode as SVGGElement).appendChild(linePath)

      elements.tooltip
        .attr(
          "transform",
          `translate(${lineXTransformer(point)},${lineYTransformer(point)})`
        )
        .on("mouseover", () => {
          mouseover(null, point)
        })
        .on("click", () => {
          clicked(null, point)
        })

      elements.tooltip.select(".text1").text(config.getTooltipPart1(point))
      elements.tooltip.select(".text2").text(config.getTooltipPart2(point))
    }

    const flatPoints = usedLines.reduce<ChartPoint[]>((...[acc, usedLine]) => {
      const points = config.getLinePoints(usedLine)

      points.forEach((point) => {
        acc.push(point)
      })

      return acc
    }, [])

    const voronoi = Delaunay.from(
      flatPoints,
      lineXTransformer,
      lineYTransformer
    ).voronoi([
      -margin.left,
      -margin.top,
      width + margin.right,
      height + margin.bottom,
    ])

    const updatedVoronoi = this.elements.voronoiGroup
      .selectAll<SVGPathElement, ChartPoint>("path")
      .data(
        flatPoints,
        (point) =>
          `${config.getLineIdFromPoint(point)}-${config.getPointXValue(point)}`
      )

    updatedVoronoi.enter().append("path")
    updatedVoronoi.exit().remove()

    this.elements.voronoiGroup
      .selectAll<SVGPathElement, ChartPoint>("path")
      .attr("d", (...[, pointIndex]) => voronoi.renderCell(pointIndex))
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", clicked)
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { MultilineVoronoiChart, ChartConfig }
