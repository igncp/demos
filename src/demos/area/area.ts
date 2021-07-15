import {
  area as d3Area,
  axisBottom,
  axisLeft,
  csv,
  format,
  line as d3Line,
  max,
  min,
  scaleLinear,
  select,
} from "d3"
import { Delaunay } from "d3-delaunay"

import d3utils from "@/demos/_utils/d3nextutils"

type Point = {
  index?: number
  percent: number
  year: number
}

const fetchData = (): Promise<Point[]> =>
  (csv(`${ROOT_PATH}data/d3js/area/data.csv`) as unknown) as Promise<Point[]>

const margin = {
  bottom: 50,
  left: 70,
  right: 50,
  top: 50,
}

const height = 400 - margin.top - margin.bottom

type RenderChart = (o: {
  data: Point[]
  rootElId: string
}) => {
  toggleVoronoi(): void
}

const renderChart: RenderChart = ({ data, rootElId }) => {
  const width =
    (document.getElementById(rootElId) as HTMLElement).getBoundingClientRect()
      .width -
    margin.left -
    margin.right

  const svg = d3utils.svg(`#${rootElId}`, width, height, margin)

  svg.attr("class", "area-chart")

  d3utils.middleTitle(
    svg,
    width,
    "Share of top decile [aka top 10%] in national income",
    null
  )
  d3utils.filterBlackOpacity("points", svg, 2, 0.5)

  const xMax = max(data, (d) => d.year) as number
  const xMin = min(data, (d) => d.year) as number
  const yMax = max(data, (d) => d.percent / 100) as number
  const yMin = min(data, (d) => d.percent / 100) as number

  const xScale = scaleLinear().range([0, width]).domain([xMin, xMax])
  const yScale = scaleLinear()
    .range([0, height])
    .domain([yMax + 0.05, yMin - 0.05])

  const xAxis = axisBottom(xScale).tickFormat(format(".0f")).tickSize(-height)
  const yAxis = axisLeft(yScale).tickFormat(format(".0%")).tickSize(-width)

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${String(height)})`)
    .call(xAxis)
    .selectAll("text")
    .attr("dy", "1.25em")

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .attr("dx", "-.25em")

  const area = d3Area<Point>()
    .x((d: Point) => xScale(d.year))
    .y0(height)
    .y1((d: Point) => yScale(d.percent / 100))

  const line = d3Line<Point>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.percent / 100))

  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr("d", line)

  svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("height", height)
    .attr("width", width)

  svg
    .append("path")
    .datum(data)
    .attr("class", "area")
    .attr("clip-path", "url(#clip)")
    .attr("d", area)

  const voronoi = Delaunay.from(
    data,
    (point) => xScale(point.year),
    (point) => yScale(point.percent / 100)
  ).voronoi([
    -margin.left,
    -margin.top,
    width + margin.right,
    height + margin.bottom,
  ])

  const mouseover = (_e: unknown, d: Point) => {
    select(`.point-${d.index}`).style("display", "block")
  }

  const mouseleave = (_e: unknown, d: Point) => {
    select(`.point-${d.index}`).style("display", "none")
  }

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr(
      "transform",
      (d: Point) =>
        `translate(${String(xScale(d.year))},${yScale(d.percent / 100)})`
    )
    .attr("r", "5px")
    .attr("class", (_d: Point, i: number) => `point point-${i}`)
    .style("filter", "url(#drop-shadow-points)")

  const voronoiGroup = svg.append("g").attr("class", "voronoi")

  voronoiGroup
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (d: Point, i: number) => {
      d.index = i

      return voronoi.renderCell(i)
    })
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .attr("class", "voronoi-area")
    .append("title")
    .text((d: Point) => `Year: ${d.year}, ` + `Percent: ${d.percent}%`)

  return {
    toggleVoronoi: () => {
      const currentClass = voronoiGroup.attr("class")

      const newClass = currentClass.includes("show-voronoi")
        ? currentClass.replace("show-voronoi", "").trim()
        : `${currentClass} show-voronoi`

      voronoiGroup.attr("class", newClass)
    },
  }
}

const main = async () => {
  const data = await fetchData()
  const rootElId = "chart"

  const { toggleVoronoi } = renderChart({
    data,
    rootElId,
  })

  ;(document.getElementById("toggle-voronoi") as HTMLElement).addEventListener(
    "click",
    (e) => {
      e.preventDefault()

      toggleVoronoi()
    }
  )
}

export default main
