import {
  geoMercator,
  geoPath,
  interpolateRdYlGn,
  json,
  scaleLinear,
  select,
} from "d3"
import { feature } from "topojson-client"

type Data = {
  id: number
} & d3.GeoPermissibleObjects

const fetchData = () => json(`${ROOT_PATH}data/d3js/world-map/world.json`)

const transitionDuration = 1500

type RenderChart = (o: { world: any; rootElId: string }) => void

const renderChart: RenderChart = ({ world, rootElId }) => {
  const state: {
    lastZoomId: null | number
  } = {
    lastZoomId: null,
  }

  const data = (feature(world, world.objects.countries) as any).features

  const colorScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, 1])
  const colorFn = (_d: Data, index: number) =>
    interpolateRdYlGn(colorScale(index))

  const { width } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()
  const height = 500

  const setZoom = (_e: unknown, d: Data) => {
    if (!d || state.lastZoomId === d.id) {
      state.lastZoomId = null

      countries
        .transition()
        .duration(transitionDuration)
        .attr(
          "transform",
          `translate(${width / 2},${height / 2})scale(${1})translate(${
            -width / 2
          },${-height / 2})`
        )

      return
    }

    state.lastZoomId = d.id

    const centroid = path.centroid(d)

    const x = centroid[0]
    const y = centroid[1]

    countries
      .transition()
      .duration(transitionDuration)
      .attr(
        "transform",
        `translate(${width / 2},${height / 2})scale(${8})translate(${-x},${-y})`
      )
  }

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .append("rect")
    .attr("class", "background")
    .attr("height", height)
    .attr("width", width)
    .on("click", setZoom as any)
    .style("fill", "#daedff")

  const content = svg.append("g")

  const projection = geoMercator()
    .center([0, 45.4])
    .scale(150)
    .translate([width / 2, height / 2])

  const path = geoPath().projection(projection)

  const countries = content
    .selectAll(".country")
    .data<Data>(data)
    .enter()
    .append("path")
    .attr("class", (d: Data) => `country ${d.id}`)
    .attr("d", path)
    .style("fill", colorFn)
    .style("stroke", "#FFF")
    .style("stroke-width", 0.2)

  countries.on("mouseover", function () {
    return select(this).style("stroke", "black").style("stroke-width", "1px")
  })

  countries.on("mouseout", function () {
    return select(this).style("stroke", "white").style('"stroke-width"', ".2px")
  })

  countries.on("click", setZoom)
}

const main = async () => {
  const world = await fetchData()

  renderChart({
    rootElId: "chart",
    world,
  })
}

export default main
