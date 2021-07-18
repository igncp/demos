import {
  area as areaD3,
  axisBottom,
  axisLeft,
  csv,
  format,
  line as lineD3,
  max,
  min,
  scaleLinear,
  select,
} from "d3"
import { Delaunay } from "d3-delaunay"

import "./area.styl"

type Point = {
  index?: number
  percent: number
  year: number
}

const fetchData = (): Promise<Point[]> =>
  (csv(`${ROOT_PATH}data/d3js/area/data.csv`) as unknown) as Promise<Point[]>

const texts = {
  pointTitle: (point: Point) =>
    `Year: ${point.year}, ` + `Percent: ${point.percent}%`,
  title: "Share of top decile [aka top 10%] in national income",
}

const margin = {
  bottom: 50,
  left: 70,
  right: 50,
  top: 50,
}

const height = 400 - margin.top - margin.bottom
const titleYOffset = -15
const axisTickSize = 10

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

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("class", "area-chart")

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${String(width / 2)},${titleYOffset})`)
    .text(texts.title)
    .style("font-weight", "bold")

  filterBlackOpacity("points", svg, 2, 0.5)

  const xMax = max(data, (point) => point.year) as number
  const xMin = min(data, (point) => point.year) as number

  const yMax = max(data, (point) => point.percent / 100) as number
  const yMin = min(data, (point) => point.percent / 100) as number

  const xScale = scaleLinear().domain([xMin, xMax]).range([0, width])
  const yScale = scaleLinear()
    .domain([yMax + 0.05, yMin - 0.05])
    .range([0, height])

  const xAxis = axisBottom(xScale)
    .tickFormat(format(".0f"))
    .tickSize(axisTickSize)
  const yAxis = axisLeft(yScale)
    .tickFormat(format(".0%"))
    .tickSize(axisTickSize)

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

  const area = areaD3<Point>()
    .x((point: Point) => xScale(point.year))
    .y0(height)
    .y1((point: Point) => yScale(point.percent / 100))

  const line = lineD3<Point>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.percent / 100))

  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("clip-path", "url(#clip)")

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
    .attr("d", area)
    .attr("clip-path", "url(#clip)")

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

  const mouseleave = (_mouseEvent: unknown, point: Point) => {
    select(`.point-${point.index}`).style("display", "none")
  }

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr(
      "transform",
      (point: Point) =>
        `translate(${xScale(point.year)},${yScale(point.percent / 100)})`
    )
    .attr("r", "5px")
    .attr(
      "class",
      (_point: Point, pointIndex: number) => `point point-${pointIndex}`
    )
    .style("filter", "url(#drop-shadow-points)")

  const voronoiGroup = svg.append("g").attr("class", "voronoi")

  voronoiGroup
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (point: Point, pointIndex: number) => {
      point.index = pointIndex

      return voronoi.renderCell(pointIndex)
    })
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .append("title")
    .text(texts.pointTitle)

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

const filterBlackOpacity = (
  id: string,
  svg: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  deviation: number,
  slope: number
) => {
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
