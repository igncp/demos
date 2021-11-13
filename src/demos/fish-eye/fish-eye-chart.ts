import {
  Axis,
  AxisScale,
  ScaleOrdinal,
  ScalePower,
  Selection,
  axisBottom,
  axisLeft,
  format,
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

const margin = {
  bottom: 70,
  left: 70,
  right: 50,
  top: 80,
}
const height = 700 - margin.top - margin.bottom

type FishEyeChartOpts<ChartData> = Readonly<{
  chartItems: ChartData[]
  chartTitle: string
  colorDomain: string[]
  getCircleTitle: (chartItem: ChartData) => string
  getColorValue: (chartItem: ChartData) => string
  getRadiusValue: (chartItem: ChartData) => number
  getXValue: (chartItem: ChartData) => number
  getYValue: (chartItem: ChartData) => number
  rootElId: string
  xAxisLabel: string
  yAxisLabel: string
}>

class FishEyeChart<ChartData> {
  private readonly config: FishEyeChartOpts<ChartData>

  private width = 0

  private dom!: {
    dot?: Selection<SVGCircleElement, ChartData, SVGGElement, unknown>
    pointer?: Selection<SVGTextElement, unknown, HTMLElement, unknown>
    svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
    svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
    xAxis?: Axis<number>
    yAxis?: Axis<number>
  }

  private vars!: {
    colorScale: ScaleOrdinal<string, string>
    focused: boolean
    radiusScale: ScalePower<number, number>
    xScale: FishEyeScale
    yScale: FishEyeScale
  }

  public constructor(chartConfig: FishEyeChartOpts<ChartData>) {
    this.config = chartConfig

    this.setupRootEl()
    this.setVars()
    this.setDom()
  }

  public render() {
    this.setChartTitle()
    this.setBackground()
    this.setPointer()
    this.setAxis()
    this.setLabels()
    this.setDots()
    this.setTitles()
    this.updateDimensions()
    this.bindMousemove()
    this.bindMouseLeave()
    this.bindClick()
    this.bindResize()
  }

  private setupRootEl() {
    const rootEl = document.getElementById(this.config.rootElId) as HTMLElement

    rootEl.classList.add(styles.fishEyeChart)

    this.width =
      rootEl.getBoundingClientRect().width - margin.left - margin.right
  }

  private setDom() {
    const svg = select(`#${this.config.rootElId}`).append("svg")
    const svgG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    this.dom = {
      svg,
      svgG,
    }
  }

  private setChartTitle() {
    this.dom.svgG
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .text(this.config.chartTitle)
      .style("font-weight", "bold")
  }

  private setVars() {
    const colorScale = scaleOrdinal<string>()
      .domain(this.config.colorDomain)
      .range(schemePastel2)

    const radiusScale = scaleSqrt().domain([0, 5e8]).range([5, 60])
    const xScale = d3Fisheye
      .scale(scaleLog)
      .domain([300, 1e5])
      .range([0, this.width]) as FishEyeScale
    const yScale = d3Fisheye
      .scale(scaleLinear)
      .domain([20, 90])
      .range([height, 0]) as FishEyeScale

    this.vars = {
      colorScale,
      focused: false,
      radiusScale,
      xScale,
      yScale,
    }
  }

  private setAxis() {
    const formatFn = format(",d")

    this.dom.xAxis = axisBottom(this.vars.xScale as AxisScale<number>)
      .tickFormat((tickNumber) => {
        if (tickNumber < 1000) {
          return formatFn(tickNumber)
        }

        const reducedNum = Math.round(tickNumber / 1000)

        return `${formatFn(reducedNum)}k`
      })
      .tickSize(-height)
    this.dom.yAxis = axisLeft(this.vars.yScale as AxisScale<number>).tickSize(
      -this.width
    )
    this.dom.svgG
      .append("g")
      .attr("class", `x ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(this.dom.xAxis)
    this.dom.svgG
      .append("g")
      .attr("class", `y ${styles.axis}`)
      .call(this.dom.yAxis)
  }

  private setBackground() {
    return this.dom.svgG.append("rect").attr("class", styles.background)
  }

  private setLabels() {
    this.dom.svgG
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .text(this.config.xAxisLabel)

    this.dom.svgG
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text(this.config.yAxisLabel)
  }

  private position(animationDuration: number) {
    this.dom
      .dot!.transition()
      .duration(animationDuration)
      .attr("cx", (chartItem) => {
        const xValue = this.config.getXValue(chartItem)

        return this.vars.xScale(xValue) as number
      })
      .attr("cy", (chartItem) => {
        const yValue = this.config.getYValue(chartItem)

        return this.vars.yScale(yValue) as number
      })
      .attr("r", (chartItem) => {
        const radiusValue = this.config.getRadiusValue(chartItem)

        return this.vars.radiusScale(radiusValue)
      })
    this.dom.svgG
      .select<SVGGElement>(`.x.${styles.axis}`)
      .transition()
      .duration(animationDuration)
      .call(this.dom.xAxis!)
    this.dom.svgG
      .select<SVGGElement>(`.y.${styles.axis}`)
      .transition()
      .duration(animationDuration)
      .call(this.dom.yAxis!)
  }

  private setDots() {
    this.dom.dot = this.dom.svgG
      .append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data<ChartData>(this.config.chartItems)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill", (chartItem) => {
        const colorValue = this.config.getColorValue(chartItem)

        return this.vars.colorScale(colorValue)
      })
      .style("stroke", "black")
      .style('"stroke-width"', "1px")
      .sort(
        (...[chartItemA, chartItemB]) =>
          this.config.getRadiusValue(chartItemB) -
          this.config.getRadiusValue(chartItemA)
      )

    this.position(0)
  }

  private setTitles() {
    this.dom
      .dot!.append("title")
      .text((chartItem) => this.config.getCircleTitle(chartItem))
  }

  private setZoom({
    animationDuration,
    distortion,
    focus,
  }: {
    animationDuration: number
    distortion: number
    focus: [number, number]
  }) {
    this.vars.xScale.distortion(distortion).focus(focus[0])
    this.vars.yScale.distortion(distortion).focus(focus[1])
    this.position(animationDuration)
  }

  private zoom(interactionEvent: Event) {
    const focus = pointerD3(interactionEvent)

    this.setZoom({
      animationDuration: 0,
      distortion: 2.5,
      focus,
    })
  }

  private setPointer() {
    this.dom.pointer = this.dom.svgG
      .append("text")
      .text("+")
      .attr("class", styles.pointer)
  }

  private bindMousemove() {
    return this.dom.svgG.on("mousemove", (interactionEvent) => {
      if (!this.vars.focused) {
        this.zoom(interactionEvent)
      }
    })
  }

  private bindMouseLeave() {
    return this.dom.svgG.on("mouseleave", () => {
      if (!this.vars.focused) {
        this.setZoom({
          animationDuration: 1000,
          distortion: 0,
          focus: [0, 0],
        })
      }
    })
  }

  private bindClick() {
    this.dom.svgG.on("click", (interactionEvent: Event) => {
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

      this.zoom(interactionEvent)
    })
  }

  private updateDimensions() {
    this.setupRootEl()
    // this.vars.xScale.range([0, this.width])
    this.dom.svg
      .attr("width", this.width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    this.dom.svgG
      .select(`.${styles.chartTitle}`)
      .attr("transform", `translate(${this.width / 2},-40)`)

    this.dom.svgG
      .select(`.${styles.background}`)
      .attr("width", this.width)
      .attr("height", height)

    this.dom.svgG
      .select(".x.label")
      .attr("y", height + 26)
      .attr("x", this.width / 2)

    this.vars.xScale.range([0, this.width])
    this.position(0)
  }

  private bindResize() {
    window.addEventListener("resize", () => {
      this.updateDimensions()
    })
  }
}

export { FishEyeChart, FishEyeChartOpts }
