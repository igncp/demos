import {
  Selection,
  axisBottom,
  axisLeft,
  extent,
  max,
  range,
  scaleLinear,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuidv1 } from "uuid"

import { DragModule } from "./bars-chart-drag"
import * as styles from "./bars.module.css"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

type ChartData = {
  id: number
  metric: number
}

const height = 500
const smallMarginWidth = 600

const margin = { left: 160, top: 100 }
const floor = height - margin.top * 2

const barWidth = 30
const barHeight = 7

const colours = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const barYFn = (barItem: ChartData) => floor - barHeight * barItem.metric
const barHeightFn = (barItem: ChartData) => barItem.metric * barHeight

type ChartConfig = {
  bars: ChartData[]
  rootElId: string
  withoutInterval?: boolean
}

type ChartElements = {
  chart: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  dragArea: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, ChartData, HTMLElement, unknown>
  xAxisG: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  xAxisText: Selection<SVGTextElement, ChartData, HTMLElement, unknown>
  yAxisG: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  yAxisText: Selection<SVGTextElement, ChartData, HTMLElement, unknown>
}

type Interval = ReturnType<typeof setInterval>
type ColorFn = (c: ChartData) => string

class BarsChart {
  private readonly bars: ChartData[]
  private readonly elements: ChartElements
  private readonly rootElId: string
  private readonly withoutInterval: boolean
  private readonly barClassName: string
  private readonly dragModule: DragModule<ChartData>
  private color: ColorFn | null
  private readonly state: {
    interval: Interval | null
  } = {
    interval: null,
  }

  public constructor({ bars, rootElId, withoutInterval }: ChartConfig) {
    this.withoutInterval = withoutInterval ?? false
    this.bars = bars
    this.rootElId = rootElId
    this.barClassName = `bars-${uuidv1().slice(0, 6)}`

    const svg = select<HTMLElement, ChartData>(`#${rootElId}`).append("svg")

    svg
      .append("g")
      .append("filter")
      .attr("height", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%")
      .attr("id", "blur")
      .attr("width", "300%")
      .append("feGaussianBlur")
      .attr("stdDeviation", "2 2")

    const dragArea = svg.append("g")
    const chart = dragArea.append("g")
    const xAxisG = chart.append("g")
    const xAxisText = xAxisG.append("text")
    const yAxisG = chart.append("g")
    const yAxisText = yAxisG.append("text")

    this.elements = {
      chart,
      dragArea,
      svg,
      xAxisG,
      xAxisText,
      yAxisG,
      yAxisText,
    }

    this.dragModule = new DragModule({
      chart,
      dragArea,
      svg,
    })

    this.color = null

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  public addBar(newBar: ChartData) {
    this.bars.push(newBar)
  }

  public getBars(): ChartData[] {
    return this.bars.slice()
  }

  public refresh() {
    this.drawRectangles()
    this.redraw()
  }

  private render() {
    const { bars, rootElId } = this
    const { width } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()

    const colorScale = scaleLinear()
      .domain(extent(bars, (bar) => bar.metric) as [number, number])
      .range([0, 1])
    const heatmapColour = scaleLinear<string>()
      .domain(range(0, 1, 1.0 / colours.length))
      .range(colours)

    const color = (barItem: ChartData) =>
      heatmapColour(colorScale(barItem.metric))

    this.color = color

    const {
      elements: { chart, svg, xAxisG, xAxisText, yAxisG, yAxisText },
    } = this

    svg
      .attr("height", height)
      .attr("width", width)
      .attr("class", styles.barsChart)

    const marginLeft = width > smallMarginWidth ? margin.left : 80

    this.dragModule.setDimensions({
      marginLeft,
      width,
    })

    chart.attr("transform", `translate(${marginLeft},${margin.top})`)

    if (this.state.interval) {
      clearInterval(this.state.interval)
    }

    if (!this.withoutInterval) {
      this.state.interval = setInterval(this.getIntervalFn(), 1000)
    }

    const x = scaleLinear()
      .domain([0.5, bars.length + 0.5])
      .range([1, barWidth * bars.length])

    const y = scaleLinear()
      .domain([0, max(bars, (bar) => bar.metric) as number])
      .rangeRound([
        0,
        -1 * barHeight * (max(bars, (bar) => bar.metric) as number),
      ])

    xAxisG
      .attr("class", `xAxis ${styles.axis}`)
      .attr("transform", `translate(0,${floor})`)
      .call(axisBottom(x))

    xAxisText
      .attr("transform", `translate(${(barWidth * bars.length) / 2} ,0)`)
      .attr("class", "xAxisLabel")
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Number")

    yAxisG
      .attr("class", `yAxis ${styles.axis}`)
      .attr("transform", `translate(0,${floor})`)
      .call(axisLeft(y))

    yAxisText
      .attr("transform", `translate(-30,${(-1 * (height - 60)) / 2})`)
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Value")

    this.dragModule.reset()
    this.drawRectangles()
  }

  private clearInterval() {
    if (this.state.interval) {
      clearInterval(this.state.interval)
    }
  }

  private getBarsSelection() {
    const {
      elements: { chart },
    } = this

    return chart.selectAll<SVGRectElement, ChartData>("rect")
  }

  private drawRectangles() {
    const { bars, color } = this

    this.getBarsSelection()
      .data(bars)
      .enter()
      .append("rect")
      .attr("x", (...[, barIndex]) => barWidth * barIndex)
      .attr("y", barYFn)
      .attr("width", barWidth)
      .attr("height", barHeightFn)
      .attr("class", this.barClassName)
      .attr("fill", (barItem) => color!(barItem))
      .on("mouseover", (...[, mouseBar]) => {
        this.getBarsSelection().style("filter", (bar) =>
          bar.id === mouseBar.id ? null : "url(#blur)"
        )
        this.clearInterval()
      })
      .on("mouseleave", () => {
        this.getBarsSelection().style("filter", null)
        this.clearInterval()

        if (!this.withoutInterval) {
          this.state.interval = setInterval(this.getIntervalFn(), 1000)
        }
      })
      .attr("title", (bar) => bar.metric)

    $(`.${this.barClassName}`).tooltip({
      track: true,
    })
  }

  private getIntervalFn() {
    return () => {
      const { bars } = this

      bars.unshift(bars.pop() as ChartData)

      this.redraw()
    }
  }

  private redraw() {
    const {
      bars,
      color,
      elements: { chart },
    } = this

    const newX = scaleLinear()
      .domain([0.5, bars.length + 0.5])
      .range([1, barWidth * bars.length])

    const newAxis = axisBottom(newX)

    chart.select<SVGGElement>(".xAxis").transition().duration(500).call(newAxis)

    chart
      .select(".xAxisLabel")
      .transition()
      .duration(500)
      .attr("transform", `translate(${(barWidth * bars.length) / 2} ,0)`)

    chart
      .selectAll("rect")
      .data(bars)
      .transition()
      .duration(500)
      .attr("y", barYFn)
      .attr("height", barHeightFn)
      .attr("fill", color!)
      .select("title")
      .text((barItem) => barItem.metric)

    this.dragModule.refresh()
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { BarsChart, ChartConfig }
