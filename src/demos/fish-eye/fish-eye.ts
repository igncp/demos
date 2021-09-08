import {
  Axis,
  ScaleOrdinal,
  ScalePower,
  Selection,
  axisBottom,
  axisLeft,
  format,
  json,
  pointer as pointerD3,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scaleSqrt,
  schemePastel2,
  select,
} from "d3"

import d3Fisheye, { FishEyeScale } from "@/demos/_utils/fish-eye"

import * as styles from "./fish-eye.module.css"

const CONTAINER_ID = "chart"

type IncomeMetric = {
  income: number
  lifeExpectancy: number
  name: string
  population: number
  region: string
}

const fetchData = async (): Promise<IncomeMetric[] | undefined> =>
  json(`${ROOT_PATH}data/d3js/fish-eye/data.json`)

const humanizeNumber = (initialN: number): string => {
  let numStr = initialN.toString()

  while (true) {
    const numStrFormatted = numStr.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3")

    if (numStrFormatted === numStr) {
      break
    }

    numStr = numStrFormatted
  }

  return numStr
}

const margin = {
  bottom: 70,
  left: 70,
  right: 50,
  top: 80,
}
const height = 700 - margin.top - margin.bottom

type FishEyeChartOpts = {
  incomeMetrics: IncomeMetric[]
  rootElId: string
}

class FishEyeChart {
  private readonly rootElId: string
  private readonly incomeMetrics: IncomeMetric[]

  private width!: number

  private dom!: {
    dot?: Selection<SVGCircleElement, IncomeMetric, SVGGElement, unknown>
    pointer?: Selection<SVGTextElement, unknown, HTMLElement, unknown>
    svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
    xAxis?: Axis<IncomeMetric["income"]>
    yAxis?: Axis<IncomeMetric["lifeExpectancy"]>
  }

  private vars!: {
    colorScale: ScaleOrdinal<string, string>
    focused: boolean
    radiusScale: ScalePower<number, number>
    xScale: FishEyeScale
    yScale: FishEyeScale
  }

  public constructor({ incomeMetrics, rootElId }: FishEyeChartOpts) {
    this.rootElId = rootElId
    this.incomeMetrics = incomeMetrics

    this.setupRootEl()
    this.setVars()
    this.setDom()
  }

  public render() {
    this.setChartTitle()
    this.setBackground()
    this.setPointer()
    this.setFilter()
    this.setAxis()
    this.setLabels()
    this.setDots()
    this.setTitles()
    this.bindMousemove()
    this.bindClick()
  }

  private setupRootEl() {
    const rootEl = document.getElementById(this.rootElId) as HTMLElement

    rootEl.classList.add(styles.fishEyeChart)

    this.width =
      rootEl.getBoundingClientRect().width - margin.left - margin.right
  }

  private setDom() {
    this.dom = {
      svg: select(`#${this.rootElId}`)
        .append("svg")
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`),
    }
  }

  private setChartTitle() {
    this.dom.svg
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${this.width / 2},-40)`)
      .text(
        "Income Per Capita vs " +
          "Life Expectancy vs Population vs Region - 180 Countries"
      )
      .style("font-weight", "bold")
  }

  private setVars() {
    const colorScale = scaleOrdinal<string>()
      .domain([
        "Sub-Saharan Africa",
        "South Asia",
        "Middle East & North Africa",
        "America",
        "Europe & Central Asia",
        "East Asia & Pacific",
      ])
      .range(schemePastel2)

    const radiusScale = scaleSqrt().domain([0, 5e8]).range([5, 60])
    const xScale = d3Fisheye
      .scale(scaleLog)
      .domain([300, 1e5])
      .range([0, this.width])
    const yScale = d3Fisheye
      .scale(scaleLinear)
      .domain([20, 90])
      .range([height, 0])

    this.vars = {
      colorScale,
      focused: false,
      radiusScale,
      xScale,
      yScale,
    }
  }

  private setAxis() {
    this.dom.xAxis = axisBottom<IncomeMetric["population"]>(this.vars.xScale)
      .tickFormat(format(",d"))
      .tickSize(-height)
    this.dom.yAxis = axisLeft<IncomeMetric["income"]>(
      this.vars.yScale
    ).tickSize(-this.width)
    this.dom.svg
      .append("g")
      .attr("class", `x ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(this.dom.xAxis)
    this.dom.svg
      .append("g")
      .attr("class", `y ${styles.axis}`)
      .call(this.dom.yAxis)
  }

  private setBackground() {
    return this.dom.svg
      .append("rect")
      .attr("class", styles.background)
      .attr("width", this.width)
      .attr("height", height)
  }

  private setLabels() {
    this.dom.svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", this.width - 26)
      .attr("y", height + 26)
      .text("income per capita, inflation-adjusted (dollars)")

    this.dom.svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -26)
      .attr("y", -40)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)")
  }

  private setFilter() {
    const defs = this.dom.svg.append("defs")
    const filter = defs.append("filter").attr("id", `drop-shadow-circles`)

    filter
      .attr("height", "500%")
      .attr("width", "500%")
      .attr("x", "-200%")
      .attr("y", "-200%")

    filter
      .append("feOffset")
      .attr("dx", 0.5)
      .attr("dy", 0.5)
      .attr("in", "SourceGraphic")
      .attr("result", "offOut")

    filter
      .append("feGaussianBlur")
      .attr("in", "offOut")
      .attr("result", "blurOut")
      .attr("stdDeviation", 1.5)

    filter
      .append("feBlend")
      .attr("in", "SourceGraphic")
      .attr("in2", "blurOut")
      .attr("mode", "normal")

    filter
      .append("feComponentTransfer")
      .append("feFuncA")
      .attr("slope", 0.6)
      .attr("type", "linear")
  }

  private position() {
    this.dom
      .dot!.attr("cx", (incomeMetric) => this.vars.xScale(incomeMetric.income))
      .attr("cy", (incomeMetric) =>
        this.vars.yScale(incomeMetric.lifeExpectancy)
      )
      .attr("r", (incomeMetric) =>
        this.vars.radiusScale(incomeMetric.population)
      )
  }

  private setDots() {
    this.dom.dot = this.dom.svg
      .append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data<IncomeMetric>(this.incomeMetrics)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill", (incomeMetric) =>
        this.vars.colorScale(incomeMetric.region)
      )
      .style("filter", "url(#drop-shadow-circles)")
      .style("stroke", "black")
      .style('"stroke-width"', "1px")
      .sort(
        (...[incomeMetricA, incomeMetricB]) =>
          incomeMetricB.population - incomeMetricA.population
      )

    this.position()
  }

  private setTitles() {
    this.dom
      .dot!.append("title")
      .text(
        (incomeMetric) =>
          `${incomeMetric.name}:\n- Income: ${humanizeNumber(
            incomeMetric.income
          )} $/P.C.\n` +
          `- Population: ${humanizeNumber(incomeMetric.population)}\n` +
          `- Life expectancy: ${incomeMetric.lifeExpectancy} years`
      )
  }

  private zoom(ev: Event) {
    const mouse = pointerD3(ev)

    this.vars.xScale.distortion(2.5).focus(mouse[0])
    this.vars.yScale.distortion(2.5).focus(mouse[1])
    this.position()

    this.dom.svg.select<SVGGElement>(`.x.${styles.axis}`).call(this.dom.xAxis!)
    this.dom.svg.select<SVGGElement>(`.y.${styles.axis}`).call(this.dom.yAxis!)
  }

  private setPointer() {
    this.dom.pointer = this.dom.svg
      .append("text")
      .text("+")
      .attr("class", styles.pointer)
  }

  private bindMousemove() {
    return this.dom.svg.on("mousemove", (ev) => {
      if (!this.vars.focused) {
        this.zoom(ev)
      }
    })
  }

  private bindClick() {
    this.dom.svg.on("click", (ev: Event) => {
      this.vars.focused = !this.vars.focused

      if (this.vars.focused) {
        const pointer = pointerD3(this)

        this.dom
          .pointer!.attr("x", pointer[0])
          .attr("y", pointer[1])
          .style("opacity", 1)

        return
      }

      this.dom.pointer!.style("opacity", 0)

      this.zoom(ev)
    })
  }
}

const main = async () => {
  const incomeMetrics = await fetchData()

  const chart = new FishEyeChart({
    incomeMetrics: incomeMetrics as IncomeMetric[],
    rootElId: CONTAINER_ID,
  })

  chart.render()
}

export { CONTAINER_ID }

export default main
