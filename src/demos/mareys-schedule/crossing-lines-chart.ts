import {
  D3DragEvent,
  Selection,
  axisBottom,
  axisTop,
  drag as dragD3,
  extent,
  line as lineD3,
  scaleLinear,
  scaleTime,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuid } from "uuid"

import * as styles from "./crossing-lines-chart.module.css"
import { MIN_WIDTH } from "./ui-constants"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

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

type TimeRange = [Date, Date]

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

type ChartElements = {
  chartTitle: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  clipPath: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  horizongalAxis: Selection<SVGGElement, unknown, HTMLElement, unknown>
  linesWrapper: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgDrag: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
  xAxisBottom: Selection<SVGGElement, unknown, HTMLElement, unknown>
  xAxisTop: Selection<SVGGElement, unknown, HTMLElement, unknown>
}

class CrossingLinesChart {
  private readonly elements: ChartElements
  private readonly config: ChartConfig
  private readonly selectors: {
    clipId: string
    filterId: string
    linePathClass: string
    pointCircleClass: string
  }

  private dragX: number

  private latesTimeRange: TimeRange

  public constructor(chartConfig: ChartConfig) {
    this.config = chartConfig

    const { rootElId } = chartConfig
    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.mareysScheduleChart)

    this.selectors = {
      clipId: `clip-${uuid().slice(0, 6)}`,
      filterId: `lines-${uuid().slice(0, 6)}`,
      linePathClass: `line-${uuid().slice(0, 6)}`,
      pointCircleClass: `point-${uuid().slice(0, 6)}`,
    }

    const svg = select(`#${rootElId}`).append("svg")
    const svgDrag = svg.append("g")
    const svgG = svgDrag.append("g")
    const chartTitle = svgG.append("text")
    const clipPath = svgG
      .append("defs")
      .append("clipPath")
      .attr("id", this.selectors.clipId)
      .append("rect")
    const horizongalAxis = svgG
      .append("g")
      .attr("class", styles.horizontalMarker)
    const xAxisTop = svgG.append("g").attr("class", `x top ${styles.axis}`)
    const xAxisBottom = svgG
      .append("g")
      .attr("class", `x bottom ${styles.axis}`)
    const linesWrapper = svgG.append("g")

    filterBlackOpacity({
      deviation: 2,
      id: this.selectors.filterId,
      slope: 0.2,
      svg: svgG,
    })

    this.elements = {
      chartTitle,
      clipPath,
      horizongalAxis,
      linesWrapper,
      svg,
      svgDrag,
      svgG,
      xAxisBottom,
      xAxisTop,
    }

    this.dragX = 0

    this.latesTimeRange = [new Date(), new Date()]

    window.addEventListener("resize", this.handleResize)
  }

  public refresh(timeRange: TimeRange) {
    this.latesTimeRange = timeRange

    const [timeStart, timeEnd] = timeRange

    const {
      config: { crossingLinesData, rootElId },
      config,
      elements: {
        chartTitle,
        clipPath,
        horizongalAxis,
        linesWrapper,
        svg,
        svgG,
        xAxisBottom,
        xAxisTop,
      },
      selectors: { clipId, filterId, linePathClass, pointCircleClass },
    } = this
    const { horizontalMarkers, lines } = crossingLinesData
    const rootEl = document.getElementById(rootElId) as HTMLElement
    const realWidth =
      rootEl.getBoundingClientRect().width - margin.left - margin.right
    const width = Math.max(realWidth, MIN_WIDTH)
    const x = scaleTime().domain([timeStart, timeEnd]).range([0, width])
    const y = scaleLinear().range([0, height])
    const xAxisTopFn = axisTop<Date>(x)
      .ticks(8)
      .tickFormat(config.getXAxisLabel)
    const xAxisBottomFn = axisBottom<Date>(x)
      .ticks(8)
      .tickFormat(config.getXAxisLabel)

    svg
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    svgG.attr("transform", `translate(${margin.left},${margin.top})`)

    chartTitle
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2},-40)`)
      .text(config.chartTitle)
      .style("font-weight", "bold")

    clipPath
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

    y.domain(
      extent(
        horizontalMarkers,
        (horizontalMarker) => horizontalMarker.position
      ) as [number, number]
    )

    const horizontalMarkersSelection = horizongalAxis
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
    xAxisTop.call(xAxisTopFn)
    xAxisBottom.attr("transform", `translate(0,${height})`).call(xAxisBottomFn)

    const mouseover = (...[, line]: [unknown, Line]) => {
      select(`.line-${line.id}`).select("path").style("stroke-width", "5px")
    }

    const mouseleave = (...[, line]: [unknown, Line]) => {
      select(`.line-${line.id}`).select("path").style("stroke-width", "2.5px")
    }

    const linesSelection = linesWrapper
      .attr("class", styles.line)
      .attr("clip-path", `url(#${clipId})`)
      .selectAll("g")
      .data(lines)
      .enter()
      .append("g")
      .attr("class", (crossingLine) => {
        const lineStyle = config.getLineStyle(crossingLine)
        const { [lineStyle]: lineClass } = lineStyleToClassName

        return `${lineClass} line-${crossingLine.id}`
      })
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

    const line = lineD3<Point>()
      .x((point) => x(point.x!))
      .y((point) => y(point.horizontalMarker.position))

    linesSelection.append("path")

    const lineGroup = linesWrapper.selectAll("g")

    lineGroup
      .selectAll<SVGPathElement, Line>("path")
      .attr("d", (crossingLine) => line(crossingLine.points))
      .attr("class", linePathClass)
      .attr("title", config.getLineTitle)

    linesSelection
      .selectAll("circle")
      .data((crossingLine) => crossingLine.points)
      .enter()
      .append("circle")
      .style("cursor", "pointer")
      .on("click", (...[, point]) => {
        config.onPointClick(point)
      })
      .style("filter", `url(#drop-shadow-${filterId})`)
      .attr("r", "5px")
      .attr("class", pointCircleClass)

    lineGroup
      .selectAll<SVGCircleElement, Point>("circle")
      .attr(
        "transform",
        (point) =>
          `translate(${x(point.x!)},${y(point.horizontalMarker.position)})`
      )
      .attr("title", (point) => config.getPointTitle(point))

    $(`.${linePathClass}`).tooltip({
      track: true,
    })

    $(`.${pointCircleClass}`).tooltip({
      track: true,
    })

    this.setupDrag(realWidth)
  }

  private setupDrag(containerWidth: number) {
    const { elements } = this

    const canUseDrag = containerWidth < MIN_WIDTH

    const updateDrag = () => {
      if (canUseDrag) {
        this.dragX = Math.min(0, this.dragX)
        this.dragX = Math.max(containerWidth - MIN_WIDTH, this.dragX)
      } else {
        this.dragX = 0
      }

      this.elements.svgDrag.attr("transform", `translate(${this.dragX},0)`)
    }

    const dragHandler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      if (!canUseDrag) {
        return
      }

      this.dragX += dragEvent.dx

      updateDrag()
    }

    const dragBehavior = dragD3<SVGSVGElement, unknown>().on(
      "drag",
      dragHandler
    )

    elements.svg
      .style("cursor", canUseDrag ? "move" : "default")
      .call(dragBehavior)
      .on("drag", dragHandler)

    updateDrag()
  }

  private readonly handleResize = () => {
    this.refresh(this.latesTimeRange)
  }
}

export {
  ChartConfig,
  CrossingLinesChart,
  HorizontalMarker,
  LineStyle,
  TimeRange,
}
