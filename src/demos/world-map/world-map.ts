import * as d3 from "d3"
import * as topojson from "topojson-client"

type Data = {
  id: number
} & d3.GeoPermissibleObjects

const fetchData = () => d3.json(`${ROOT_PATH}data/d3js/world-map/world.json`)

const color = d3.scaleOrdinal(d3.schemePastel2)

type RenderChart = (o: { world: any; rootElId: string }) => void

const renderChart: RenderChart = ({ world, rootElId }) => {
  const { width } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()
  const height = 500

  const colorFn = function (d: Data) {
    return color(d.id.toString())
  }

  const setZoom = function (_e: unknown, d: Data) {
    if (!d) {
      countries
        .transition()
        .duration(3500)
        .attr(
          "transform",
          `translate(${width / 2},${height / 2})scale(${1})translate(${
            -width / 2
          },${-height / 2})`
        )

      return
    }

    const centroid = path.centroid(d)

    const x = centroid[0]
    const y = centroid[1]

    countries
      .transition()
      .duration(3500)
      .attr(
        "transform",
        `translate(${width / 2},${height / 2})scale(${8})translate(${-x},${-y})`
      )
  }

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .append("rect")
    .attr("class", "background")
    .attr("height", height)
    .attr("width", width)
    .on("click", setZoom)
    .style("fill", "#daedff")

  const content = svg.append("g")

  const projection = d3
    .geoMercator()
    .center([0, 45.4])
    .scale(150)
    .translate([width / 2, height / 2])

  const path = d3.geoPath().projection(projection)
  const data = (topojson.feature(world, world.objects.countries) as any)
    .features

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
    return d3.select(this).style("stroke", "black").style("stroke-width", "1px")
  })

  countries.on("mouseout", function () {
    return d3
      .select(this)
      .style("stroke", "white")
      .style('"stroke-width"', ".2px")
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
