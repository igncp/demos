import {
  Line,
  Selection,
  axisBottom,
  axisLeft,
  line as d3Line,
  extent,
  max,
  min,
  range,
  scaleLinear,
  scaleQuantile,
  scaleTime,
  select,
} from "d3"

import * as styles from "./trend-line.module.css"
import { ANIMATION_MS } from "./ui-constants"

const margin = {
  bottom: 50,
  left: 50,
  right: 50,
  top: 50,
}

const height = 500 - margin.top - margin.bottom

const getInterpolation =
  <ChartData>({
    line,
    lineData,
  }: {
    line: Line<ChartData>
    lineData: ChartData[]
  }) =>
  () => {
    const interpolate = scaleQuantile()
      .domain([0, 1])
      .range(range(1, lineData.length + 1))

    return (t: number): string => {
      const interpolatedLine = lineData.slice(0, interpolate(t))

      return line(interpolatedLine)!
    }
  }

type ChartConfig<ChartData> = {
  chartText: string
  getDashedLineX: (lineData: ChartData) => Date
  getDashedLineY: (lineData: ChartData) => number
  getFullLineX: (lineData: ChartData) => Date
  getFullLineY: (lineData: ChartData) => number
  initialZoomed: boolean
  lineData: ChartData[]
  rootElId: string
}

type ChartElements = {
  chartText: Selection<SVGTextElement, unknown, HTMLElement, undefined>
  dashedLine: Selection<SVGPathElement, unknown, HTMLElement, undefined>
  fullLine: Selection<SVGPathElement, unknown, HTMLElement, undefined>
  rootEl: Selection<HTMLElement, unknown, HTMLElement, undefined>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, undefined>
  svgG: Selection<SVGGElement, unknown, HTMLElement, undefined>
  xAxis: Selection<SVGGElement, unknown, HTMLElement, undefined>
  yAxis: Selection<SVGGElement, unknown, HTMLElement, undefined>
}

class TrendLineChart<ChartData> {
  private readonly elements: ChartElements
  private readonly config: ChartConfig<ChartData>
  private readonly state: { isZoomed: boolean } = {
    isZoomed: false,
  }

  public constructor(config: ChartConfig<ChartData>) {
    const { initialZoomed, rootElId } = config

    const rootEl = select<HTMLElement, unknown>(`#${rootElId}`)
    const svg = rootEl.append("svg")
    const svgG = svg.append("g")
    const xAxis = svgG.append("g")
    const yAxis = svgG.append("g")
    const fullLine = svgG.append("path")
    const dashedLine = svgG.append("path")
    const chartText = svgG.append("text")

    this.elements = {
      chartText,
      dashedLine,
      fullLine,
      rootEl,
      svg,
      svgG,
      xAxis,
      yAxis,
    }

    this.config = config
    this.renderContent(initialZoomed)

    window.addEventListener("resize", this.handleResize)
  }

  public renderContent(isZoomed: boolean) {
    this.state.isZoomed = isZoomed

    this.render(true)
  }

  private render(withAnimation: boolean) {
    const finalAnimationTime = withAnimation ? ANIMATION_MS : 0
    const {
      config: {
        getDashedLineX,
        getDashedLineY,
        getFullLineX,
        getFullLineY,
        lineData,
        rootElId,
      },
      config,
      elements: {
        chartText,
        dashedLine,
        fullLine,
        svg,
        svgG,
        xAxis: xAxisSel,
        yAxis: yAxisSel,
      },
      state: { isZoomed },
    } = this
    const container = document.getElementById(rootElId) as HTMLElement

    container.classList.add(styles.trendLineChart)

    const width =
      container.getBoundingClientRect().width - margin.left - margin.right

    svg
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    svgG.attr("transform", `translate(${margin.left},${margin.right})`)

    const x = scaleTime()
      .range([0, width])
      .domain(extent(lineData, getFullLineX) as [Date, Date])
    const y = scaleLinear()
      .range([height, 0])
      .domain([
        isZoomed ? (min(lineData, getFullLineY) as number) : 0,
        max(lineData, getFullLineY) as number,
      ])
    const xAxis = axisBottom(x)
    const yAxis = axisLeft(y)

    const line = d3Line<ChartData>()
      .x((lineItem) => x(getFullLineX(lineItem)))
      .y((lineItem) => y(getFullLineY(lineItem)))

    xAxisSel
      .attr("class", `x ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
    yAxisSel.attr("class", `y ${styles.axis}`).call(yAxis)

    fullLine
      .datum(lineData)
      .interrupt()
      .transition()
      .duration(finalAnimationTime)
      .attrTween(
        "d",
        getInterpolation({
          line,
          lineData,
        })
      )
      .attr("class", styles.line)

    const regressionLine = d3Line<ChartData>()
      .x((lineItem) => x(getDashedLineX(lineItem)))
      .y((lineItem) => y(getDashedLineY(lineItem)))

    dashedLine
      .datum(lineData)
      .attr("d", null)
      .interrupt()
      .transition()
      .delay(finalAnimationTime)
      .duration(finalAnimationTime)
      .attrTween(
        "d",
        getInterpolation({
          line: regressionLine,
          lineData,
        })
      )
      .attr("class", styles.rline)

    chartText
      .attr("transform", `translate(${width * 0.7},${height * 0.7})`)
      .style("opacity", finalAnimationTime ? 0 : 1)
      .interrupt()
      .transition()
      .delay(finalAnimationTime * 2)
      .text(config.chartText)
      .style("opacity", 1)
  }

  private readonly handleResize = () => {
    this.render(false)
  }
}

export { TrendLineChart, ChartConfig }
