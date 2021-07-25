import {
  BaseType,
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  Selection,
  geoMercator,
  geoPath,
  json,
  range,
  scaleLinear,
  select,
} from "d3"
import { feature } from "topojson-client"
import { GeoJsonProperties } from "geojson"
import { Objects, Topology } from "topojson-specification"

const fetchData = (): Promise<Data | undefined> =>
  json(`${ROOT_PATH}data/d3js/spain-map/data.json`)

const colorsScheme = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const height = 500
const margin = {
  bottom: 20,
  top: 50,
}
const strokeWidth = 0.4

type SVG = Selection<BaseType, unknown, HTMLElement, unknown>

type DataShape = {
  index: number
  properties: {
    NAME_2: string
  }
} & GeoPermissibleObjects

type Data = Topology<Objects<GeoJsonProperties>>

const addDropShadowFilter = function (
  id: number,
  svg: SVG,
  deviation: number,
  slope: number
) {
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

  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const renderChart = async ({
  data,
  rootElId,
}: {
  data: Data
  rootElId: string
}) => {
  const widthChart = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect().width
  const widthCanarias = widthChart / 3.5
  const widthPeninsula = widthChart - widthCanarias - 10

  const dataRoot = data.objects.data1
  const dataGeo = (feature(data, dataRoot) as any).features

  dataGeo.forEach((d: DataShape, i: number) => {
    d.index = i
  })

  const colorScale = scaleLinear()
    .domain([0, (dataRoot as any).geometries.length])
    .range([0, 1])
  const colorScaleConversion = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colorsScheme.length))
    .range(colorsScheme)

  const colorFn = function (d: DataShape) {
    return colorScaleConversion(colorScale(d.index))
  }

  const svg = select(`#${rootElId}`)

  const generateSvg = function (width: number) {
    return svg
      .append("div")
      .style("display", "inline-block")
      .style("height", `${height + margin.top + margin.bottom}px`)
      .style("width", `${width}px`)
      .append("svg:svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("svg:g")
      .attr("transform", `translate(${width / 2},${height / 2 + margin.top})`)
  }

  const generateProjection = (center: [number, number]) =>
    geoMercator()
      .center(center)
      .scale(2650)
      .translate([widthPeninsula / 2, height / 2])

  const generatePath = function (projection: GeoProjection) {
    return geoPath().projection(projection)
  }

  const generateAreas = function (
    svgComp: SVG,
    path: GeoPath<SVGPathElement, GeoPermissibleObjects>,
    filterId: number
  ) {
    svgComp
      .selectAll(".area")
      .data<DataShape>(dataGeo)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", colorFn)
      .style("stroke", "#FFF")
      .style("stroke-width", strokeWidth)
      .style("filter", () => `url(#drop-shadow-${filterId})`)
      .on("mouseover", function () {
        return select(this)
          .style("fill", "#FFB61A")
          .style("stroke-width", "1px")
      })
      .on("mouseleave", function () {
        return select<SVGPathElement, DataShape>(this)
          .style("fill", (d) => colorFn(d))
          .style("stroke-width", strokeWidth)
      })
      .append("title")
      .text((d) => d.properties.NAME_2)
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

  if (!data) {
    return
  }

  renderChart({
    data,
    rootElId: "chart",
  })
}

export default main
