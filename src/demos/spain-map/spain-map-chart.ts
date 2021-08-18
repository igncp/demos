import {
  BaseType,
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  Selection,
  geoMercator,
  geoPath,
  range,
  scaleLinear,
  select,
} from "d3"
import { GeoJsonProperties } from "geojson"
import { feature } from "topojson-client"
import { Objects, Topology } from "topojson-specification"
import { v1 as uuidv1 } from "uuid"

const colorsScheme = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const height = 500
const margin = {
  bottom: 20,
  top: 50,
}
const strokeWidth = 0.4

type SVG = Selection<BaseType, unknown, HTMLElement, unknown>

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

type Data = Topology<Objects<GeoJsonProperties>>

export type ChartConfig<Properties> = {
  data: Data
  getTitleText: (p: Properties) => string
  getWidths: (chartWidth: number) => number[]
  projectionsCenters: Array<[number, number]>
  rootElId: string
}

export const renderChart = <Properties>(
  chartConfig: ChartConfig<Properties>
) => {
  const { data, rootElId } = chartConfig

  type DataShape = GeoPermissibleObjects & {
    index: number
    properties: Properties
  }

  const { width: chartWidth } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()

  const {
    objects: { data1: dataRoot },
  } = data
  const { features: dataGeo } = feature(data, dataRoot) as any

  const dataGeoParsed = dataGeo.map((d: DataShape, i: number) => ({
    ...d,
    index: i,
  }))

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

  const generatePath = function (projection: GeoProjection) {
    return geoPath().projection(projection)
  }

  const regionClass = `region-${uuidv1().slice(0, 6)}`

  const generateAreas = (
    svgComp: SVG,
    path: GeoPath<SVGPathElement>,
    filterId: number
  ) => {
    svgComp
      .selectAll(".area")
      .data<DataShape>(dataGeoParsed)
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
          .style("fill", colorFn)
          .style("stroke-width", strokeWidth)
      })
      .attr("title", (d) => chartConfig.getTitleText(d.properties))
      .attr("class", regionClass)
  }

  const widths = chartConfig.getWidths(chartWidth)

  const generateProjection = (center: [number, number], centerIndex: number) =>
    geoMercator()
      .center(center)
      .scale(2650)
      .translate([widths[centerIndex] / 2, height / 2])

  const svgs = widths.map(generateSvg)

  svgs.forEach((svgItem, idx) => {
    addDropShadowFilter(idx + 1, svgItem, 2, 0.3)
  })

  const projections = chartConfig.projectionsCenters.map(generateProjection)
  const paths = projections.map(generatePath)

  svgs.forEach((svgItem, svgIndex) => {
    generateAreas(svgItem, paths[svgIndex], svgIndex + 1)
  })

  $(`.${regionClass}`).tooltip({
    track: true,
  })
}
