import {
  BaseType,
  Selection,
  color as colorD3,
  scaleOrdinal,
  schemePastel2,
} from "d3"
import { Delaunay } from "d3-delaunay"

import * as styles from "./area-chart.module.css"

type RenderOpts<Point> = {
  animationDuration: number
  boundaries: [number, number, number, number]
  className: string
  clipPath: string
  extractXScale: (point: Point) => number
  extractYScale: (point: Point) => number
  filter: string
  getItemId: (point: Point) => number
  getTitle: (point: Point) => string
  mouseenter: (_: unknown, point: Point) => void
  mouseleave: (_: unknown, point: Point) => void
  points: Point[]
}

class VoronoiGroup<Point> {
  private readonly voronoiGroup: Selection<
    SVGGElement,
    unknown,
    BaseType,
    unknown
  >

  private readonly state = {
    hasVoronoi: false,
  }

  public constructor(
    parent: Selection<SVGGElement, unknown, HTMLElement, unknown>
  ) {
    this.voronoiGroup = parent.append("g")
  }

  public toggleVoronoi() {
    this.state.hasVoronoi = !this.state.hasVoronoi
    this.setVoronoi()
  }

  public render({
    animationDuration,
    boundaries,
    className,
    clipPath,
    extractXScale,
    extractYScale,
    filter,
    getItemId,
    getTitle,
    mouseenter,
    mouseleave,
    points,
  }: RenderOpts<Point>) {
    const { voronoiGroup } = this
    const voronoiData = voronoiGroup
      .selectAll<SVGPathElement, Point>("path")
      .data(points, (point) => getItemId(point))

    voronoiData.enter().append("path")
    voronoiData.exit().remove()

    const colorScale = scaleOrdinal<number, string>(schemePastel2)

    const voronoi = Delaunay.from(points, extractXScale, extractYScale).voronoi(
      boundaries
    )

    voronoiGroup
      .attr("clip-path", clipPath)
      .attr("class", styles.voronoi)
      .selectAll<SVGPathElement, Point>("path")
      .attr("fill", (point) => {
        const itemId = getItemId(point)
        const colorHex = colorScale(itemId)
        const itemColor = colorD3(colorHex)!

        itemColor.opacity = 0.2

        return itemColor.formatRgb()
      })
      .on("mouseenter", mouseenter)
      .on("mouseleave", mouseleave)
      .attr("class", className)
      .attr("title", getTitle)
      .style("filter", filter)
      .transition()
      .duration(animationDuration)
      .attr("d", (point) => voronoi.renderCell(getItemId(point)))

    this.setVoronoi()
  }

  private setVoronoi() {
    const {
      state: { hasVoronoi },
      voronoiGroup,
    } = this
    const currentClass = voronoiGroup.attr("class")
    const { showVoronoi } = styles

    const currentClassWithoutVoronoi = currentClass
      .replace(showVoronoi, "")
      .trim()

    const newClass = hasVoronoi
      ? `${currentClassWithoutVoronoi} ${showVoronoi}`
      : currentClassWithoutVoronoi

    voronoiGroup.attr("class", newClass)
  }
}

export { VoronoiGroup }
