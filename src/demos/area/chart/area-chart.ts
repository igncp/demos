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
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./area-chart.module.css"
import { VoronoiGroup } from "./voronoi-group"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
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

type ChartElements<AreaPoint> = Readonly<{
  areaSel: CommonSelection<SVGPathElement>
  backgroundBands: CommonSelection<SVGGElement>
  chartTitleSel: CommonSelection<SVGTextElement>
  clipRect: CommonSelection<SVGRectElement>
  clipTopRect: CommonSelection<SVGRectElement>
  lineSel: CommonSelection<SVGPathElement>
  svg: CommonSelection<SVGSVGElement>
  svgG: CommonSelection<SVGGElement>
  voronoiGroup: VoronoiGroup<AreaPoint>
  xAxisSel: CommonSelection<SVGGElement>
  yAxisSel: CommonSelection<SVGGElement>
}>

class AreaChart<AreaPoint> implements BaseChart {
  private readonly config: ChartConfig<AreaPoint>
  private readonly svgOpacityFilter: string
  private readonly elements: ChartElements<AreaPoint>

  private constructor(chartConfig: ChartConfig<AreaPoint>) {
    this.config = chartConfig

    const { rootElId } = chartConfig

    const svg = select(`#${rootElId}`).append("svg")
    const svgG = svg.append("g").attr("class", styles.areaChart)
    const backgroundBands = svgG.append("g")
    const chartTitleSel = svgG
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
    const xAxisSel = svgG.append("g")
    const yAxisSel = svgG.append("g")
    const lineSel = svgG.append("path")
    const areaSel = svgG.append("path")
    const voronoiGroup = new VoronoiGroup<AreaPoint>(svgG)
    const clipRect = svgG.append("clipPath").attr("id", "clip").append("rect")

    // This is exclusively for clipping the vertical axis
    const clipTopRect = svgG
      .append("clipPath")
      .attr("id", "clip-top")
      .append("rect")

    this.svgOpacityFilter = `opacity-${uuidv1().slice(0, 6)}`

    filterBlackOpacity({
      deviation: 2,
      id: this.svgOpacityFilter,
      slope: 0.5,
      svg: svgG,
    })

    this.elements = {
      areaSel,
      backgroundBands,
      chartTitleSel,
      clipRect,
      clipTopRect,
      lineSel,
      svg,
      svgG,
      voronoiGroup,
      xAxisSel,
      yAxisSel,
    }

    this.render(true)

    window.addEventListener("resize", this.handleWindowResize)
  }

  public static renderChart<AreaPoint>(chartConfig: ChartConfig<AreaPoint>) {
    return new AreaChart(chartConfig)
  }

  public refresh() {
    this.render(false)
  }

  public tearDown() {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  public toggleVoronoi() {
    this.elements.voronoiGroup.toggleVoronoi()
  }

  private render(cancelAnimation: boolean) {
    const {
      config: { rootElId },
    } = this
    const { width } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()
    const isSmallDevice = width < 500
    const animationDuration = cancelAnimation || isSmallDevice ? 0 : 1000

    const margin = {
      bottom: 50,
      left: isSmallDevice ? 50 : 70,
      right: isSmallDevice ? 10 : 50,
      top: 50,
    }

    const innerWidth = width - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const { config: chartConfig } = this

    const { areaPoints } = chartConfig
    const tooltipItemClass = `tooltip-item-${uuidv1().slice(0, 6)}`
    const pointClassPrefix = `point-${uuidv1().slice(0, 6)}-`

    const titleYOffset = -15
    const axisTickSize = 10

    const {
      elements: {
        areaSel,
        backgroundBands,
        chartTitleSel,
        clipRect,
        clipTopRect,
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
      .attr("clip-path", "url(#clip-top)")
      .transition()
      .duration(animationDuration)
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

    clipTopRect
      .attr("height", height)
      .attr("width", innerWidth)
      .attr("transform", "translate(-50,-5)")

    areaSel
      .datum(areaPoints)
      .attr("class", styles.area)
      .attr("clip-path", "url(#clip)")
      .transition()
      .duration(animationDuration)
      .attr("d", area)

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

    const bandsPercentage = 2.5
    const bandsData = Array.from({ length: 100 / bandsPercentage }).map(
      (...[, bandIndex]) => (bandIndex * bandsPercentage) / 100
    )
    const bandHeight = Math.abs(yScale(bandsPercentage / 100) - yScale(0))

    const bands = backgroundBands.selectAll("rect").data(bandsData)

    bands.enter().append("rect")
    bands.exit().remove()

    backgroundBands
      .selectAll<SVGRectElement, number>("rect")
      .attr("clip-path", "url(#clip)")
      .attr("x", 0)
      .attr("width", innerWidth)
      .attr("fill", (...[, bandIndex]) =>
        bandIndex % 2 ? "#f7f7f7" : "#ffffff"
      )
      .attr("class", "backgroundBands")
      .transition()
      .duration(animationDuration)
      .attr("height", bandHeight)
      .attr("y", (bandPercentage) => yScale(bandPercentage))

    const circleData = svgG.selectAll("circle").data(areaPoints)

    circleData.enter().append("circle")
    circleData.exit().remove()

    svgG
      .selectAll<SVGCircleElement, AreaPoint>("circle")
      .attr("r", "5px")
      .style("filter", `url(#drop-shadow-${this.svgOpacityFilter})`)
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

    voronoiGroup.render({
      animationDuration,
      boundaries: [
        -margin.left,
        -margin.top,
        innerWidth + margin.right,
        height + margin.bottom,
      ],
      className: tooltipItemClass,
      clipPath: "url(#clip)",
      extractXScale,
      extractYScale,
      filter: `url(#drop-shadow-${this.svgOpacityFilter})`,
      getItemId: chartConfig.getItemId,
      getTitle: chartConfig.getItemTitle,
      mouseenter,
      mouseleave,
      points: areaPoints,
    })

    $(`.${tooltipItemClass}`).tooltip({
      track: true,
    })
  }

  private readonly handleWindowResize = () => {
    this.render(true)
  }
}

export { ChartConfig, AreaChart }
