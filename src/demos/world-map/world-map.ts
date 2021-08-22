import {
  GeoPermissibleObjects,
  geoMercator,
  geoPath,
  interpolateRdYlGn,
  json,
  scaleLinear,
  select,
} from "d3"
import { feature } from "topojson-client"

type CountryData = GeoPermissibleObjects & {
  id: number
}

const fetchData = () => json(`${ROOT_PATH}data/d3js/world-map/world.json`)

const transitionDuration = 1500

type WorldData = any // eslint-disable-line @typescript-eslint/no-explicit-any

type RenderChart = (o: { rootElId: string; world: WorldData }) => void

const renderChart: RenderChart = ({ rootElId, world }) => {
  const state: {
    lastZoomId: number | null
  } = {
    lastZoomId: null,
  }

  const { features: featuresData } = feature(
    world,
    world.objects.countries
  ) as any // eslint-disable-line @typescript-eslint/no-explicit-any

  const colorScale = scaleLinear()
    .domain([0, featuresData.length - 1])
    .range([0, 1])
  const colorFn = (...[, countryIndex]: [unknown, number]) =>
    interpolateRdYlGn(colorScale(countryIndex))

  const { width } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()
  const height = 500

  const setZoom = (...[, countryData]: [unknown, CountryData]) => {
    if (!(countryData as unknown) || state.lastZoomId === countryData.id) {
      state.lastZoomId = null

      countries // eslint-disable-line @typescript-eslint/no-use-before-define
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

    state.lastZoomId = countryData.id

    const centroid = path.centroid(countryData) // eslint-disable-line @typescript-eslint/no-use-before-define

    const x = centroid[0]
    const y = centroid[1]

    countries // eslint-disable-line @typescript-eslint/no-use-before-define
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
    .on("click", setZoom as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .style("fill", "#daedff")

  const content = svg.append("g")

  const projection = geoMercator()
    .center([0, 45.4])
    .scale(150)
    .translate([width / 2, height / 2])

  const path = geoPath().projection(projection)

  const countries = content
    .selectAll(".country")
    .data<CountryData>(featuresData)
    .enter()
    .append("path")
    .attr("class", (countryData: CountryData) => `country ${countryData.id}`)
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
