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
import { v1 as uuidv1 } from "uuid"

import * as styles from "./bars.module.css"

type ChartData = {
  id: number
  metric: number
}

const height = 500
const margin = { left: 160, top: 100 }
const floor = height - margin.top * 2

const barWidth = 30
const barHeight = 7

const colours = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const barYFn = (barItem: ChartData) => floor - barHeight * barItem.metric
const barHeightFn = (barItem: ChartData) => barItem.metric * barHeight

export type ChartConfig = {
  bars: ChartData[]
  rootElId: string
}

type Interval = ReturnType<typeof setInterval>
type Chart = Selection<SVGGElement, ChartData, HTMLElement, unknown>
type ColorFn = (c: ChartData) => string

class BarsChart {
  private readonly bars: ChartData[]
  private readonly rootElId: string
  private interval: Interval | null
  private readonly barClassName: string
  private chart: Chart | null
  private color: ColorFn | null

  public constructor({ bars, rootElId }: ChartConfig) {
    this.bars = bars
    this.rootElId = rootElId
    this.barClassName = `bars-${uuidv1().slice(0, 6)}`

    this.interval = null
    this.chart = null
    this.color = null
  }

  public render() {
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

    const svg = select<HTMLElement, ChartData>(`#${rootElId}`).append("svg")

    svg
      .attr("height", height)
      .attr("width", width)
      .attr("class", styles.barsChart)

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

    const chart = svg.append("g")

    this.chart = chart

    chart.attr("transform", `translate(${margin.left},${margin.top})`)

    this.interval = setInterval(this.getIntervalFn(), 1000)

    const x = scaleLinear()
      .domain([0.5, bars.length + 0.5])
      .range([1, barWidth * bars.length])

    const y = scaleLinear()
      .domain([0, max(bars, (bar) => bar.metric) as number])
      .rangeRound([
        0,
        -1 * barHeight * (max(bars, (bar) => bar.metric) as number),
      ])

    const xAxisG = chart.append("g")

    xAxisG
      .attr("class", `xAxis ${styles.axis}`)
      .attr("transform", `translate(0,${floor})`)
      .call(axisBottom(x))

    xAxisG
      .append("text")
      .attr("transform", `translate(${(barWidth * bars.length) / 2} ,0)`)
      .attr("class", "xAxisLabel")
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Number")

    const yAxisG = chart.append("g")

    yAxisG
      .attr("class", `yAxis ${styles.axis}`)
      .attr("transform", `translate(0,${floor})`)
      .call(axisLeft(y))

    yAxisG
      .append("text")
      .attr("transform", `translate(-30,${(-1 * (height - 60)) / 2})`)
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Value")

    this.drawRectangles()
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

  private clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  private getBarsSelection() {
    const { chart } = this

    return (chart as Chart).selectAll<SVGRectElement, ChartData>("rect")
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
        this.interval = setInterval(this.getIntervalFn(), 1000)
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
    const { bars, chart, color } = this

    if (!chart) {
      return
    }

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
  }
}

export { BarsChart }
