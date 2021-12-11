import {
  BaseType,
  D3DragEvent,
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  Selection,
  drag as dragD3,
  geoMercator,
  geoPath,
  range,
  scaleLinear,
  select,
} from "d3"
import { GeoJsonProperties } from "geojson"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { feature } from "topojson-client"
import { Objects, Topology } from "topojson-specification"
import { v1 as uuidv1 } from "uuid"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

const colorsScheme = ["#323247", "#7c7cc9", "#72b66c", "#429742"]
const height = 500
const margin = {
  bottom: 20,
  top: 50,
}
const strokeWidth = 0.4

type Bounds = [[number, number], [number, number]]

const calculateBounds = ({
  featuresData,
  projectionPath,
}: {
  featuresData: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  projectionPath: GeoPath
}) =>
  featuresData.reduce<Bounds>(
    (...[acc, featureData]) => {
      const dataBounds = projectionPath.bounds(featureData)

      acc[0][0] = Math.min(acc[0][0], dataBounds[0][0])
      acc[0][1] = Math.min(acc[0][1], dataBounds[0][1])
      acc[1][0] = Math.max(acc[1][0], dataBounds[1][0])
      acc[1][1] = Math.max(acc[1][1], dataBounds[1][1])

      return acc
    },
    [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ]
  )

type AreasData = Topology<Objects<GeoJsonProperties>>

type ChartConfig<Properties> = Readonly<{
  areasData: AreasData
  getTitleText: (properties: Properties) => string
  projectionsCenters: Array<[number, number]>
  rootElId: string
  widths: number[]
}>

type DataShape<Properties> = GeoPermissibleObjects & {
  areaIndex: number
  properties: Properties
}

type ChartElements = Readonly<{
  divsSel: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  innerGroupsSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  rootSel: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  svgsDragsSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgsSel: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}>

const addDropShadowFilter = <Parent extends BaseType | null>({
  deviation,
  id,
  slope,
  svg,
}: {
  deviation: number
  id: number
  slope: number
  svg: Selection<SVGGElement, unknown, Parent, unknown>
}) => {
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

class NMapChart<Properties> {
  private readonly config: ChartConfig<Properties>
  private readonly elements: ChartElements
  private readonly regionClass: string
  private readonly state: {
    drags: Array<{ x: number; y: number }>
    // Shared marks between all subcharts, could also have different marks per
    // subchart although UX seems better like this
    marks: Record<string, boolean>
  } = {
    drags: [],
    marks: {},
  }

  private constructor(chartConfig: ChartConfig<Properties>) {
    this.config = chartConfig

    const { areasData, rootElId } = chartConfig

    this.regionClass = `region-${uuidv1().slice(0, 6)}`

    const {
      objects: { data1: dataRoot },
    } = areasData

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { features: dataGeo } = feature(areasData, dataRoot) as any

    const dataGeoParsed = dataGeo.map(
      (...[areaData, areaIndex]: [DataShape<Properties>, number]) => ({
        ...areaData,
        areaIndex,
      })
    )

    const rootSel = select<HTMLDivElement, unknown>(`#${rootElId}`)

    const divsSel = rootSel
      .selectAll("div")
      .data<unknown>(chartConfig.projectionsCenters)
      .enter()
      .append("div")
      .style("border", "1px dashed #777")
      .style("margin", "5px")
    const svgsSel = divsSel.append("svg")
    const svgsDragsSel = svgsSel.append("g")
    const innerGroupsSel = svgsDragsSel.append("g")

    const colorFn = this.areaFillColor.bind(this)
    const toggleMark = this.toggleMark.bind(this)
    const refreshAllColors = this.refreshAllColors.bind(this)

    const generateAreas = <Parent extends BaseType | null>({
      filterId,
      path,
      svgComp,
    }: {
      filterId: number
      path: GeoPath<SVGPathElement>
      svgComp: Selection<SVGGElement, unknown, Parent, unknown>
    }) => {
      const svgUpdateSel = svgComp
        .selectAll(".area")
        .data<DataShape<Properties>>(dataGeoParsed)

      svgUpdateSel.exit().remove()
      svgUpdateSel
        .enter()
        .append("path")
        .style("stroke", "#fff")
        .style("cursor", "pointer")
        .style("filter", `url(#drop-shadow-${filterId})`)
        .attr("title", (areaData) =>
          this.config.getTitleText(areaData.properties)
        )
        .attr("class", `${this.regionClass} area`)
        .call(() => {
          $(`.${this.regionClass}`).tooltip({
            track: true,
          })
        })
        .on("click", function handleClick(...[, area]) {
          toggleMark(area)
          select<SVGPathElement, DataShape<Properties>>(this).style(
            "fill",
            colorFn
          )

          requestAnimationFrame(() => {
            // Reflect in both charts
            refreshAllColors()
          })
        })
        .on("mouseover", function onMouseOver() {
          select(this).style("fill", "#ffb61a").style("stroke-width", "1px")
        })
        .on("mouseleave", function onMouseLeave() {
          select<SVGPathElement, DataShape<Properties>>(this)
            .style("fill", colorFn)
            .style("stroke-width", strokeWidth)
        })

      svgComp
        .selectAll<SVGPathElement, DataShape<Properties>>(".area")
        .attr("d", path)
        .style("fill", colorFn)
        .style("stroke-width", strokeWidth)
    }

    const generateProjection = (...[center]: [[number, number], number]) => {
      // Keep the same scale for all dimensions to improve render performance
      const scale = 2400

      return geoMercator().center(center).scale(scale)
    }

    const generatePath = (projection: GeoProjection) =>
      geoPath().projection(projection)

    const areasPaths = this.config.projectionsCenters
      .map(generateProjection)
      .map(generatePath)

    const boundsList = areasPaths.map((projectionPath) =>
      calculateBounds({
        featuresData: dataGeoParsed,
        projectionPath,
      })
    )

    innerGroupsSel
      .data(boundsList)
      .attr(
        "transform",
        (bounds) =>
          `translate(${(bounds[1][0] - bounds[0][0]) / 2},${
            (bounds[1][1] - bounds[0][1]) / 2
          })`
      )

    innerGroupsSel.each(function setupFilter(...[, groupIndex]) {
      const svgItem = select(this)

      addDropShadowFilter({
        deviation: 2,
        id: groupIndex + 1,
        slope: 0.3,
        svg: svgItem,
      })

      generateAreas({
        filterId: groupIndex + 1,
        path: areasPaths[groupIndex],
        svgComp: svgItem,
      })
    })

    this.elements = {
      divsSel,
      innerGroupsSel,
      rootSel,
      svgsDragsSel,
      svgsSel,
    }

    this.render()
    this.setupDrag()

    window.addEventListener("resize", this.handleResize)
  }

  public static renderChart<Properties>(chartConfig: ChartConfig<Properties>) {
    return new NMapChart(chartConfig)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  public clearMarked() {
    this.state.marks = {}
    this.refreshAllColors()
  }

  private areaFillColor(area: DataShape<Properties>): string {
    const {
      config: { areasData },
    } = this
    const {
      objects: { data1: dataRoot },
    } = areasData
    const colorScale = scaleLinear()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .domain([0, (dataRoot as any).geometries.length])
      .range([0, 1])

    const colorScaleConversion = scaleLinear<string>()
      .domain(range(0, 1, 1.0 / colorsScheme.length))
      .range(colorsScheme)

    if (this.state.marks[area.areaIndex]) {
      return "#f00"
    }

    return colorScaleConversion(colorScale(area.areaIndex))
  }

  private refreshAllColors() {
    const {
      elements: { innerGroupsSel },
    } = this

    innerGroupsSel
      .selectAll<SVGPathElement, DataShape<Properties>>(".area")
      .style("fill", (area) => this.areaFillColor(area))
  }

  private render() {
    const {
      config: { rootElId, widths },
      elements: { divsSel, rootSel, svgsSel },
    } = this

    const widthsTotal = widths.reduce((...[acc, curr]) => acc + curr, 0)

    const { width: chartWidth } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()

    const isSmallDevice = chartWidth < 600

    const getSubChartWidth = (width: number) => {
      if (isSmallDevice) {
        return chartWidth
      }

      return (width / widthsTotal) * chartWidth
    }

    rootSel
      .style("width", `100%`)
      .style("justify-content", "space-evenly")
      .style("display", isSmallDevice ? "flex" : "inline-flex")
      .style("flex-direction", isSmallDevice ? "column" : "")

    divsSel
      .data(widths)
      .style("display", "inline-block")
      .style("height", `${height + margin.top + margin.bottom}px`)
      .style("width", (width) => `${getSubChartWidth(width)}px`)

    svgsSel
      .data(widths)
      .attr("width", (width) => getSubChartWidth(width))
      .attr("height", height + margin.top + margin.bottom)
  }

  private toggleMark(area: DataShape<Properties>) {
    this.state.marks[area.areaIndex] = !this.state.marks[area.areaIndex]
  }

  private updateDrags() {
    const {
      elements: { svgsDragsSel },
    } = this

    const getTranslate = (chartIndex: number) =>
      `translate(${this.state.drags[chartIndex].x},${this.state.drags[chartIndex].y})`

    svgsDragsSel.each(function updateDrag(...[, chartIndex]) {
      select(this).attr("transform", getTranslate(chartIndex))
    })
  }

  private setupDrag() {
    const {
      elements: { svgsSel },
    } = this

    const getDragHandler =
      (chartIndex: number) =>
      (dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>) => {
        this.state.drags[chartIndex].x += dragEvent.dx
        this.state.drags[chartIndex].y += dragEvent.dy

        this.updateDrags()
      }

    const addDrag = (chartIndex: number) => {
      this.state.drags[chartIndex] = {
        x: 0,
        y: 0,
      }
    }

    svgsSel.each(function handleSVG(...[, chartIndex]) {
      addDrag(chartIndex)

      const handler = getDragHandler(chartIndex)
      const dragBehavior = dragD3<SVGSVGElement, unknown>().on("drag", handler)

      select(this)
        .style("cursor", "move")
        .call(dragBehavior)
        .on("drag", handler)
    })
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { AreasData, ChartConfig, NMapChart }
