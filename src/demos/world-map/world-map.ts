import {
  D3DragEvent,
  GeoPath,
  GeoPermissibleObjects,
  Selection,
  drag as dragD3,
  geoMercator,
  geoPath,
  interpolateBlues,
  interpolateRdYlGn,
  interpolateSpectral,
  interpolateTurbo,
  interpolateViridis,
  json,
  scaleLinear,
  select,
} from "d3"
import { feature } from "topojson-client"

import { CONTAINER_ID } from "./ui-constants"

const UPDATE_BUTTON_ID = "update-colors"

type CountryData = GeoPermissibleObjects & {
  id: number
}

const fetchData = () => json(`${ROOT_PATH}data/d3js/world-map/world.json`)

const transitionDuration = 1500

type WorldData = any // eslint-disable-line @typescript-eslint/no-explicit-any

type ChartConfig = {
  rootElId: string
  world: WorldData
}

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

const boundDrag = ({
  bounds,
  dragPoint,
  height,
  width,
}: {
  bounds: Bounds
  dragPoint: { draggedX: number; draggedY: number }
  height: number
  width: number
}) => {
  if (dragPoint.draggedX * -1 < bounds[0][0]) {
    dragPoint.draggedX = bounds[0][0] * -1
  } else if (dragPoint.draggedX * -1 > bounds[1][0] - width) {
    dragPoint.draggedX = (bounds[1][0] - width) * -1
  }

  if (dragPoint.draggedY * -1 < bounds[0][1]) {
    dragPoint.draggedY = bounds[0][1] * -1
  } else if (dragPoint.draggedY * -1 > bounds[1][1] - height) {
    dragPoint.draggedY = (bounds[1][1] - height) * -1
  }
}

type ChartElements = Readonly<{
  backgroundSel: Selection<SVGRectElement, unknown, HTMLElement, unknown>
  contentSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgDragSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgSel: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}>

const addDropShadowFilter = ({
  deviation,
  slope,
  svg,
}: {
  deviation: number
  slope: number
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", `drop-shadow`)

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

const colorFns = [
  interpolateRdYlGn,
  interpolateSpectral,
  interpolateBlues,
  interpolateViridis,
  interpolateTurbo,
]

class WorldMap {
  private readonly config: ChartConfig
  private readonly state: {
    colorFnIndex: number
    draggedX: number
    draggedY: number
    lastZoomId: number | null
  } = {
    colorFnIndex: 0,
    draggedX: 0,
    draggedY: 0,
    lastZoomId: null,
  }

  private dimensions!: {
    height: number
    width: number
  }

  private projectionPath!: GeoPath
  private bounds!: Bounds

  private readonly elements: ChartElements

  public constructor(config: ChartConfig) {
    this.config = config

    const {
      config: { rootElId },
    } = this

    const svgSel = select(`#${rootElId}`).append("svg")
    const svgDragSel = svgSel.append("g")
    const backgroundSel = svgDragSel
      .append("rect")
      .attr("class", "background")
      .style("fill", "#daedff")
    const contentSel = svgDragSel.append("g")

    addDropShadowFilter({
      deviation: 2,
      slope: 0.5,
      svg: svgSel,
    })

    this.elements = {
      backgroundSel,
      contentSel,
      svgDragSel,
      svgSel,
    }

    this.render()
    this.setupDrag()

    window.addEventListener("resize", this.handleWindowResize)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  public updateColors() {
    this.state.colorFnIndex += 1

    if (this.state.colorFnIndex >= colorFns.length) {
      this.state.colorFnIndex = 0
    }

    this.render()
  }

  private setDimensions() {
    const {
      config: { rootElId },
    } = this
    const { width } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()
    const height = 500

    this.dimensions = {
      height,
      width,
    }
  }

  private render() {
    const {
      config: { world },
      elements: { backgroundSel, svgSel },
    } = this

    this.setDimensions()

    const {
      dimensions: { height, width },
    } = this
    const projection = geoMercator()
      .center([0, 45.4])
      .scale(Math.max((150 * width) / 750, 140))
      .translate([width / 2, height / 2])

    this.projectionPath = geoPath().projection(projection)

    const { features: featuresData } = feature(
      world,
      world.objects.countries
    ) as any // eslint-disable-line @typescript-eslint/no-explicit-any

    this.bounds = calculateBounds({
      featuresData,
      projectionPath: this.projectionPath,
    })

    const colorScale = scaleLinear()
      .domain([0, featuresData.length - 1])
      .range([0, 1])

    const colorFn = (...[, countryIndex]: [unknown, number]) =>
      colorFns[this.state.colorFnIndex](colorScale(countryIndex))

    svgSel.attr("width", width).attr("height", height)

    const backgroundSize = 100_000

    backgroundSel
      .on("click", this.setZoom as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .attr("height", backgroundSize)
      .attr("width", backgroundSize)
      .attr(
        "transform",
        `translate(${Math.min(0, (backgroundSize - width) / -2)}, ${Math.min(
          0,
          (backgroundSize - height) / -2
        )})`
      )

    const countriesUpdateSel =
      this.getCountriesSel().data<CountryData>(featuresData)

    const countriesStrokeWidth = "1px"

    countriesUpdateSel.exit().remove()
    countriesUpdateSel
      .enter()
      .append("path")
      .attr("class", (countryData: CountryData) => `country ${countryData.id}`)
      .style("stroke", "#fff")
      .style("stroke-width", countriesStrokeWidth)
      .attr("filter", "url(#drop-shadow)")

    const countriesSel = this.getCountriesSel()
      .attr("d", this.projectionPath)
      .style("fill", colorFn)
      .on("mouseenter", function handleCountryMouseEnter() {
        select(this)
          .attr("filter", "url(#drop-shadow)")
          .style("stroke-width", "2px")
      })
      .on("mouseleave", () => {
        countriesSel
          .attr("filter", "url(#drop-shadow)")
          .style("stroke-width", countriesStrokeWidth)
      })
      .on("click", this.setZoom)

    this.updateDrag()
  }

  private getCountriesSel() {
    return this.elements.contentSel.selectAll<SVGPathElement, CountryData>(
      ".country"
    )
  }

  private updateDrag() {
    const {
      bounds,
      dimensions: { height, width },
      elements: { svgDragSel },
    } = this

    boundDrag({
      bounds,
      dragPoint: this.state,
      height,
      width,
    })

    svgDragSel.attr(
      "transform",
      `translate(${this.state.draggedX},${this.state.draggedY})`
    )
  }

  private setupDrag() {
    const {
      elements: { svgSel },
    } = this

    const dragHandler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      this.state.draggedX += dragEvent.dx
      this.state.draggedY += dragEvent.dy

      this.updateDrag()
    }

    const dragBehavior = dragD3<SVGSVGElement, unknown>().on(
      "drag",
      dragHandler
    )

    svgSel.style("cursor", "move").call(dragBehavior).on("drag", dragHandler)
  }

  private readonly setZoom = (...[, countryData]: [unknown, CountryData]) => {
    const {
      dimensions: { height, width },
    } = this
    const countriesSel = this.getCountriesSel()

    if (!(countryData as unknown) || this.state.lastZoomId === countryData.id) {
      this.state.lastZoomId = null

      countriesSel
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

    this.state.lastZoomId = countryData.id

    const centroid = this.projectionPath.centroid(countryData)

    const x = centroid[0]
    const y = centroid[1]

    countriesSel
      .transition()
      .duration(transitionDuration)
      .attr(
        "transform",
        `translate(${width / 2},${height / 2})scale(${8})translate(${-x},${-y})`
      )
  }

  private readonly handleWindowResize = () => {
    this.render()
  }
}

const main = async () => {
  const world = await fetchData()

  const worldMap = new WorldMap({
    rootElId: CONTAINER_ID,
    world,
  })

  document.getElementById(UPDATE_BUTTON_ID)?.addEventListener("click", () => {
    worldMap.updateColors()
  })
}

export { CONTAINER_ID, UPDATE_BUTTON_ID }

export default main
