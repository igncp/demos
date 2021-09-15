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

import * as styles from "./bars.module.css"

type ChartData = number

const height = 500
const margin = { left: 160, top: 100 }
const floor = height - margin.top * 2

const barWidth = 30
const barHeight = 7

const colours = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const barYFn = (barItem: ChartData) => floor - barHeight * barItem
const barHeightFn = (barItem: ChartData) => barItem * barHeight

type BarsChartOpts = {
  bars: ChartData[]
  rootElId: string
}

type Interval = ReturnType<typeof setInterval>
type Chart = Selection<SVGGElement, unknown, HTMLElement, unknown>
type ColorFn = (c: ChartData) => string

class BarsChart {
  private readonly bars: ChartData[]
  private readonly rootElId: string
  private interval: Interval | null
  private chart: Chart | null
  private color: ColorFn | null

  public constructor({ bars, rootElId }: BarsChartOpts) {
    this.bars = bars
    this.rootElId = rootElId

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
      .domain(extent(bars) as [ChartData, ChartData])
      .range([0, 1])
    const heatmapColour: ColorFn = scaleLinear<string>()
      .domain(range(0, 1, 1.0 / colours.length))
      .range(colours)

    const color = (barItem: ChartData) => heatmapColour(colorScale(barItem))

    this.color = color as ColorFn

    const svg = select(`#${rootElId}`).append("svg")

    svg
      .attr("height", height)
      .attr("width", width)
      .attr("class", styles.barsChart)

    const chart = svg.append("g")

    this.chart = chart

    chart.attr("transform", `translate(${margin.left},${margin.top})`)

    this.interval = setInterval(this.getIntervalFn(), 1000)

    const x = scaleLinear()
      .domain([0.5, bars.length + 0.5])
      .range([1, barWidth * bars.length])

    const y = scaleLinear()
      .domain([0, max(bars) as number])
      .rangeRound([0, -1 * barHeight * (max(bars) as number)])

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

  public refresh() {
    this.drawRectangles()
    this.redraw()
  }

  private clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  private drawRectangles() {
    const { bars, chart, color } = this

    ;(chart as Chart)
      .selectAll("rect")
      .data(bars)
      .enter()
      .append("rect")
      .attr("x", (...[, barIndex]) => barWidth * barIndex)
      .attr("y", barYFn)
      .attr("width", barWidth)
      .attr("height", barHeightFn)
      .attr("fill", (barItem) => color!(barItem))
      .on("mouseover", () => {
        this.clearInterval()
      })
      .on("mouseleave", () => {
        this.clearInterval()
        this.interval = setInterval(this.getIntervalFn(), 1000)
      })
      .append("title")
      .text((barItem) => barItem)
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
      .attr("fill", color as ColorFn)
      .select("title")
      .text((barItem) => barItem)
  }
}

export { BarsChart }
