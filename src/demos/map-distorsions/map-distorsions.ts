import * as d3 from "d3"
import sortBy from "lodash/sortBy"

import d3utils from "@/demos/_utils/d3utils"

import "./map-distorsions.styl"

type Data = {
  "Acc. 40º 150%": string
  Angular: string
  Areal: string
  Scale: string
  name: string
}

const fetchData = (): Promise<Data[]> =>
  d3.tsv(`${ROOT_PATH}data/d3js/map-distorsions/data.tsv`) as Promise<any>

const margin = {
  bottom: 20,
  left: 200,
  right: 40,
  top: 90,
}
const height = 750 - margin.top - margin.bottom

const colors = ["#7C7CC9", "#429742", "#63BD28", "#D14141"]

const texts = {
  title:
    "Comparison of 41 map projections by four different types of distortion. Lower is better.",
}

type RenderChart = (o: { data: Data[]; rootElId: string }) => void

type Dimension = {
  name: string
  scale: any
  type: Function
}

const renderChart: RenderChart = ({ data, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add("map-distorsions-chart")

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const dimensions: Dimension[] = [
    {
      name: "name",
      scale: d3.scalePoint().range([0, height]),
      type: String,
    },
    {
      name: "Acc. 40º 150%",
      scale: d3.scaleLinear().range([0, height]),
      type: Number,
    },
    {
      name: "Scale",
      scale: d3.scaleLinear().range([height, 0]),
      type: Number,
    },
    {
      name: "Areal",
      scale: d3.scaleSqrt().range([height, 0]),
      type: Number,
    },
    {
      name: "Angular",
      scale: d3.scaleLinear().range([height, 0]),
      type: Number,
    },
  ]

  const svg = d3utils.svg(`#${rootElId}`, width, height, margin)

  d3utils.middleTitle(svg, width, texts.title, -60)

  const x = d3
    .scalePoint()
    .domain(dimensions.map((d) => d.name))
    .range([0, width])

  const line = d3.line().defined((d) => !isNaN(d[1]))

  const dimension = svg
    .selectAll(".dimension")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", (d) => `translate(${x(d.name)})`)

  d3utils.filterColor("lines", svg, 2, 0.4)

  const sortedData: Data[] = sortBy<Data>(data, "name")
  const colorFn = d3utils.colorsScale(colors, [0, sortedData.length - 1])

  dimensions.forEach((dimItem: Dimension) =>
    dimItem.scale.domain(
      dimItem.type === Number
        ? d3.extent(sortedData, (d: Data) => +d[dimItem.name as keyof Data])
        : sortedData.map((d: Data) => d[dimItem.name as keyof Data]).sort()
    )
  )

  const draw = function (d: any) {
    return line(
      dimensions.map((dimItem) => [
        x(dimItem.name),
        dimItem.scale(d[dimItem.name]),
      ]) as any
    )
  }

  const tooltipText = function (d: Data) {
    const keys = [
      "Acc. 40º 150%",
      "Scale",
      "Areal",
      "Angular",
    ] as (keyof Data)[]
    const vals = keys.map((item) => String(Number(d[item]).toFixed(2)))

    return `${d.name}:  ${vals.join(" - ")}`
  }

  svg
    .append("g")
    .attr("class", "background")
    .selectAll("path")
    .data<Data>(sortedData)
    .enter()
    .append("path")
    .attr("d", draw)
    .attr("data-title", tooltipText)

  svg
    .append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(sortedData)
    .enter()
    .append("path")
    .attr("d", draw)
    .attr("data-title", tooltipText)

  dimension
    .append("g")
    .attr("class", "axis")
    .each(function (d: Dimension) {
      const yAxis = d3.axisLeft(d.scale)

      return d3.select(this).call(yAxis)
    })
    .append("text")
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("y", -9)
    .text((d) => d.name)

  svg
    .select(".axis")
    .selectAll<SVGElement, Data>("text:not(.title)")
    .attr("class", "label")
    .data(sortedData, (d: any) => d.name || d)
    .style("fill", (_d, i) => colorFn(i))

  const moveToFront = function (this: SVGElement) {
    const el = this.parentNode as HTMLElement

    el.appendChild(this)
  }

  const mouseover = (_e: unknown, d: Data) => {
    svg.selectAll(".foreground path").style("filter", "none")
    svg.classed("active", true)
    projection.classed("inactive", (p: Data) => p.name !== d.name)

    projection.filter((p: Data) => p.name === d.name).each(moveToFront)
  }

  const mouseout = () => {
    svg.selectAll(".foreground path").style("filter", "url(#drop-shadow-lines)")
    svg.classed("active", false)
    projection.classed("inactive", false)
  }

  svg
    .selectAll(".foreground path")
    .style("filter", "url(#drop-shadow-lines)")
    .style("stroke", (_d, i) => colorFn(i))

  const projection = svg
    .selectAll<SVGElement, Data>(".axis text,.background path,.foreground path")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)

  d3utils.tooltip(".background path, .foreground path", {
    followMouse: true,
    leftOffst: 100,
    topOffst: 50,
  })
}

const main = async () => {
  const data = await fetchData()
  const rootElId = "chart"

  renderChart({ data, rootElId })
}

export default main
