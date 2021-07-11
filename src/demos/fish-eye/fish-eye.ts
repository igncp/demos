import * as d3 from "d3"

import d3Fisheye, { FishEyeScale } from "@/demos/_utils/fish-eye"
import d3utils from "@/demos/_utils/d3nextutils"

type DataItem = {
  income: number
  lifeExpectancy: number
  name: string
  population: number
  region: string
}
type Data = DataItem[]

const fetchData = async (): Promise<Data | undefined> =>
  d3.json(`${ROOT_PATH}data/d3js/fish-eye/data.json`)

const humanizeNumber = (initialN: number): string => {
  let n = initialN.toString()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3")

    if (n === n2) {
      break
    }

    n = n2
  }

  return n
}

const margin = {
  bottom: 70,
  left: 70,
  right: 50,
  top: 80,
}
const height = 700 - margin.top - margin.bottom

type FishEyeChartOpts = {
  rootElId: string
  data: Data
}

class FishEyeChart {
  private rootElId: string
  private data: Data

  private width!: number
  private dom!: {
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
    dot?: d3.Selection<SVGCircleElement, DataItem, SVGGElement, unknown>
    pointer?: d3.Selection<SVGTextElement, unknown, HTMLElement, unknown>
    xAxis?: d3.Axis<DataItem["income"]>
    yAxis?: d3.Axis<DataItem["lifeExpectancy"]>
  }
  private vars!: {
    colorScale: d3.ScaleOrdinal<string, string, never>
    focused: boolean
    radiusScale: d3.ScalePower<number, number, never>
    xScale: FishEyeScale
    yScale: FishEyeScale
  }

  public constructor({ rootElId, data }: FishEyeChartOpts) {
    this.rootElId = rootElId
    this.data = data

    this.setWidth()
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

  private setWidth() {
    this.width =
      (document.getElementById(
        this.rootElId
      ) as HTMLElement).getBoundingClientRect().width -
      margin.left -
      margin.right
  }

  private setDom() {
    this.dom = {
      svg: d3
        .select(`#${this.rootElId}`)
        .append("svg")
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`),
    }
  }

  private setChartTitle() {
    return d3utils.middleTitle(
      this.dom.svg,
      this.width,
      "Income Per Capita vs " +
        "Life Expectancy vs Population vs Region - 180 Countries",
      -40
    )
  }

  private setVars() {
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain([
        "Sub-Saharan Africa",
        "South Asia",
        "Middle East & North Africa",
        "America",
        "Europe & Central Asia",
        "East Asia & Pacific",
      ])
      .range(d3.schemePastel2)

    const radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([5, 60])
    const xScale = d3Fisheye
      .scale(d3.scaleLog)
      .domain([300, 1e5])
      .range([0, this.width])
    const yScale = d3Fisheye
      .scale(d3.scaleLinear)
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
    this.dom.xAxis = d3
      .axisBottom<DataItem["population"]>(this.vars.xScale)
      .tickFormat(d3.format(",d"))
      .tickSize(-height)
    this.dom.yAxis = d3
      .axisLeft<DataItem["income"]>(this.vars.yScale)
      .tickSize(-this.width)
    this.dom.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(this.dom.xAxis)
    this.dom.svg.append("g").attr("class", "y axis").call(this.dom.yAxis)
  }

  private setBackground() {
    return this.dom.svg
      .append("rect")
      .attr("class", "background")
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
    return d3utils.filterColor("circles", this.dom.svg, 1.5, 0.6, true)
  }

  private position() {
    this.dom
      .dot!.attr("cx", (d) => this.vars.xScale(d.income))
      .attr("cy", (d) => this.vars.yScale(d.lifeExpectancy))
      .attr("r", (d) => this.vars.radiusScale(d.population))
  }

  private setDots() {
    this.dom.dot = this.dom.svg
      .append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data<DataItem>(this.data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill", (d: DataItem) => this.vars.colorScale(d.region))
      .style("filter", "url(#drop-shadow-circles)")
      .style("stroke", "black")
      .style('"stroke-width"', "1px")
      .sort((a, b) => b.population - a.population)

    this.position()
  }

  private setTitles() {
    this.dom
      .dot!.append("title")
      .text(
        (d) =>
          `${d.name}:\n- Income: ${humanizeNumber(d.income)} $/P.C.\n` +
          `- Population: ${humanizeNumber(d.population)}\n` +
          `- Life expectancy: ${d.lifeExpectancy} years`
      )
  }

  private zoom(ev: Event) {
    const mouse = d3.pointer(ev)

    this.vars.xScale.distortion(2.5).focus(mouse[0])
    this.vars.yScale.distortion(2.5).focus(mouse[1])
    this.position()

    this.dom.svg.select<SVGGElement>(".x.axis").call(this.dom.xAxis!)
    this.dom.svg.select<SVGGElement>(".y.axis").call(this.dom.yAxis!)
  }

  private setPointer() {
    this.dom.pointer = this.dom.svg
      .append("text")
      .text("+")
      .attr("class", "pointer")
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
        const pointer = d3.pointer(this)

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
  const data = await fetchData()

  const chart = new FishEyeChart({
    data: data as Data,
    rootElId: "chart",
  })

  chart.render()
}

export default main
