import * as d3next from "d3"
import * as topojson from "topojson-client"

const fetchData = () =>
  new Promise((resolve) => {
    d3.json(`${ROOT_PATH}data/d3js/spain-map/data.json`, (_error, spain) => {
      resolve(spain)
    })
  })

const colorsScheme = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const height = 500
const margin = {
  bottom: 20,
  top: 50,
}
const strokeWidth = 0.4

const renderChart = async ({ data, rootElId }) => {
  const widthChart = $(`#${rootElId}`).innerWidth()
  const widthCanarias = widthChart / 3.5
  const widthPeninsula = widthChart - widthCanarias - 10

  const dataRoot = data.objects.data1
  const dataGeo = topojson.feature(data, dataRoot).features

  _.map(dataGeo, (d, i) => {
    d.index = i
  })

  const colorScale = d3next
    .scaleLinear()
    .domain([0, dataRoot.geometries.length])
    .range([0, 1])
  const colorScaleConversion = d3.scale
    .linear()
    .domain(d3.range(0, 1, 1.0 / colorsScheme.length))
    .range(colorsScheme)

  const colorFn = function (d) {
    return colorScaleConversion(colorScale(d.index))
  }

  const addDropShadowFilter = function (id, svg, deviation, slope) {
    const defs = svg.append("defs")
    const filter = defs.append("filter").attr("id", `drop-shadow-${id}`)

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

    return feMerge.append("feMergeNode").attr("in", "SourceGraphic")
  }

  const svg = d3.select(`#${rootElId}`)

  const generateSvg = function (width) {
    return svg
      .append("div")
      .style("display", "inline-block")
      .style("height", `${height + margin.top + margin.bottom}px`)
      .style("width", `${width}px`)
      .append("svg:svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("svg:g")
      .attr(
        "transform",
        `translate(${width / 2},${String(height / 2 + margin.top)})`
      )
  }

  const generateProjection = function (center) {
    return d3.geo
      .mercator()
      .center(center)
      .scale(2650)
      .translate([widthPeninsula / 2, height / 2])
  }

  const generatePath = function (projection) {
    return d3.geo.path().projection(projection)
  }

  const mouseover = function () {
    return d3.select(this).style("fill", "#FFB61A").style("stroke-width", "1px")
  }

  const mouseleave = function () {
    return d3
      .select(this)
      .style("fill", colorFn)
      .style("stroke-width", strokeWidth)
  }

  const generateAreas = function (svgComp, path, filterId) {
    return svgComp
      .selectAll(".area")
      .data(dataGeo)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", colorFn)
      .style("stroke", "#FFF")
      .style("stroke-width", strokeWidth)
      .style("filter", () => `url(#drop-shadow-${filterId})`)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
  }

  const svgLeft = generateSvg(widthCanarias)
  const svgRight = generateSvg(widthPeninsula)

  addDropShadowFilter(1, svgLeft, 2, 0.3)
  addDropShadowFilter(2, svgRight, 2, 0.3)

  const projectionCanarias = generateProjection([-7, 23])
  const projectionPeninsula = generateProjection([6, 35.5])

  const pathCanarias = generatePath(projectionCanarias)
  const pathPeninsula = generatePath(projectionPeninsula)

  generateAreas(svgLeft, pathCanarias, 1)
  generateAreas(svgRight, pathPeninsula, 2)
}

const main = async () => {
  const data = await fetchData()

  renderChart({
    data,
    rootElId: "chart",
  })
}

export default main
