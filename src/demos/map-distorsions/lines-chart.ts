import {
  Selection,
  axisLeft,
  extent,
  line as lineD3,
  range,
  scaleLinear,
  scalePoint,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"

import { DragModule } from "./lines-chart-drag"
import * as styles from "./map-distorsions.module.css"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

type LineItemBase = { [dimension: string]: string }

const maxNameLength = 20
const getShortName = (name: string) =>
  name.length > maxNameLength ? `${name.slice(0, maxNameLength)}...` : name

const margin = {
  bottom: 20,
  left: 200,
  right: 40,
  top: 90,
}
const height = 750 - margin.top - margin.bottom
const axisYOffset = -9

const moveToFront = function appendOnEnd(this: SVGElement) {
  const parentNode = this.parentNode as HTMLElement

  parentNode.appendChild(this)
}

const colors = ["#7C7CC9", "#429742", "#63BD28", "#D14141"]

enum DimensionType {
  Number = "number",
  String = "string",
}

type Dimension = {
  name: string
  scale: any // eslint-disable-line @typescript-eslint/no-explicit-any
  type: DimensionType
}

const filterColor = ({
  deviation,
  id,
  slope,
  svg,
}: {
  deviation: number
  id: string
  slope: number
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
}) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", `drop-shadow-${id}`)

  filter
    .append("feOffset")
    .attr("dx", 0.5)
    .attr("dy", 0.5)
    .attr("in", "SourceGraphic")
    .attr("result", "offOut")

  filter
    .append("feGaussianBlur")
    .attr("in", "offOut")
    .attr("result", "blurOut")
    .attr("stdDeviation", deviation)

  filter
    .append("feBlend")
    .attr("in", "SourceGraphic")
    .attr("in2", "blurOut")
    .attr("mode", "normal")

  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", slope)
    .attr("type", "linear")
}

const colorsScale = <P extends number>(domain: [number, number]) => {
  const c = scaleLinear().domain(domain).range([0, 1])
  const colorScale = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colors.length))
    .range(colors)

  return (color: P) => colorScale(c(color))
}

type ChartConfig<LineItem extends LineItemBase> = {
  chartSmallTitle: string
  chartTitle: string
  dimensions: Dimension[]
  getTooltipText: (lineItem: LineItem) => string
  lines: LineItem[]
  onLineClick: (clickEvent: unknown, lineItem: LineItem) => void
  rootElId: string
}

type ChartElements = {
  background: Selection<SVGGElement, unknown, HTMLElement, unknown>
  dragArea: Selection<SVGGElement, unknown, HTMLElement, unknown>
  foreground: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
  title: Selection<SVGTextElement, unknown, HTMLElement, unknown>
}

class LinesChart<LineItem extends LineItemBase> {
  private readonly config: ChartConfig<LineItem>
  private readonly elements: ChartElements
  private readonly dragModule: DragModule<unknown>

  public constructor(config: ChartConfig<LineItem>) {
    this.config = config

    const { rootElId } = config

    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.mapDistorsionsChart)

    const svg = select(`#${rootElId}`).append("svg")
    const dragArea = svg.append("g")
    const svgG = dragArea.append("g")
    const title = svgG.append("text")
    const background = svgG.append("g")
    const foreground = svgG.append("g")

    this.elements = {
      background,
      dragArea,
      foreground,
      svg,
      svgG,
      title,
    }

    filterColor({ deviation: 2, id: "lines", slope: 0.4, svg: svgG })

    this.dragModule = new DragModule({
      chart: svgG,
      dragArea,
      svg,
    })

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  private readonly handleResize = () => {
    this.render()
  }

  private render() {
    const {
      config: {
        chartSmallTitle,
        chartTitle,
        dimensions,
        getTooltipText,
        lines,
        onLineClick,
        rootElId,
      },
    } = this
    const rootEl = document.getElementById(rootElId) as HTMLElement
    const deviceMemory =
      (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 0

    rootEl.classList.add(styles.mapDistorsionsChart)

    const width = Math.max(
      700,
      rootEl.getBoundingClientRect().width - margin.left - margin.right
    )

    const isSmallScreen = width < 500

    this.dragModule.setDimensions({
      marginLeft: margin.left,
      width,
    })

    const {
      elements: { background, foreground, svg, svgG, title },
    } = this

    svg
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    svgG.attr("transform", `translate(${margin.left},${margin.top})`)

    title
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2},-60)`)
      .style("font-weight", "bold")
      .text(isSmallScreen ? chartSmallTitle : chartTitle)

    const x = scalePoint()
      .domain(dimensions.map((dimension) => dimension.name))
      .range([0, width])

    const line = lineD3().defined((lineData) => !isNaN(lineData[1]))

    const dimensionSelection = svgG
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")

    svgG
      .selectAll<SVGGElement, Dimension>(".dimension")
      .attr("transform", (dimension) => `translate(${x(dimension.name)})`)

    const colorFn = colorsScale([0, lines.length - 1])

    dimensions.forEach((dimItem) =>
      dimItem.scale.range([0, height]).domain(
        dimItem.type === DimensionType.Number
          ? extent(
              lines,
              (lineItem: LineItem) => +lineItem[dimItem.name as keyof LineItem]
            )
          : lines
              .map((lineItem: LineItem) => {
                const { [dimItem.name as keyof LineItem]: name } = lineItem

                return getShortName(name)
              })
              .sort()
      )
    )

    const draw = (lineItem: LineItem) => {
      const allPoints: Array<[number, number]> = dimensions.map((dimItem) => {
        const { [dimItem.name as keyof LineItem]: dimensionValue } = lineItem

        return [
          x(dimItem.name) as number,
          dimItem.scale(
            typeof dimensionValue === "string"
              ? getShortName(dimensionValue)
              : dimensionValue
          ),
        ]
      })

      return line(allPoints)
    }

    background
      .attr("class", styles.background)
      .selectAll("path")
      .data<LineItem>(lines)
      .enter()
      .append("path")

    background
      .selectAll<SVGPathElement, LineItem>("path")
      .attr("d", draw)
      .style("cursor", "pointer")
      .attr("title", getTooltipText)
      .on("click", onLineClick)

    foreground
      .attr("class", styles.foreground)
      .selectAll("path")
      .data(lines)
      .enter()
      .append("path")
      .attr("data-title", getTooltipText)

    foreground.selectAll<SVGPathElement, LineItem>("path").attr("d", draw)

    dimensionSelection
      .append("g")
      .attr("class", styles.axis)
      .each(function setupVerticalAxis(dimensionItem) {
        const yAxis = axisLeft(dimensionItem.scale)

        return select(this).call(yAxis)
      })
      .append("text")
      .attr("class", styles.title)
      .attr("text-anchor", "middle")
      .attr("y", axisYOffset)
      .text((dimensionItem) => dimensionItem.name)

    svgG
      .select(`.${styles.axis}`)
      .selectAll<SVGElement, LineItem>(`text:not(.${styles.title})`)
      .attr("class", styles.label)
      .data(lines, (lineItem: LineItem) => lineItem.name)
      .style("fill", (...[, lineItemIndex]: [unknown, number]) =>
        colorFn(lineItemIndex)
      )

    const linesSelection = svgG.selectAll<SVGElement, LineItem>(
      `.${styles.axis} text,.${styles.background} path,.${styles.foreground} path`
    )

    const mouseover = (...[, overLineItem]: [unknown, LineItem]) => {
      svgG.selectAll(`.${styles.foreground} path`).style("filter", "none")
      svgG.classed(styles.active, true)
      linesSelection.classed(
        styles.inactive,
        (otherLineItem: LineItem) => otherLineItem.name !== overLineItem.name
      )

      linesSelection
        .filter(
          (otherLineItem: LineItem) => otherLineItem.name === overLineItem.name
        )
        .each(moveToFront)
    }

    const shadowFilter = deviceMemory >= 8 ? "url(#drop-shadow-lines)" : false

    const mouseout = () => {
      svgG.selectAll(`.${styles.foreground} path`).style("filter", shadowFilter)
      svgG.classed(styles.active, false)
      linesSelection.classed(styles.inactive, false)
    }

    svgG
      .selectAll(`.${styles.foreground} path`)
      .style("filter", shadowFilter)
      .style("stroke", (...[, lineItemIndex]) => colorFn(lineItemIndex))

    linesSelection.on("mouseover", mouseover).on("mouseout", mouseout)

    $(`.${styles.background} path, .${styles.foreground} path`).tooltip({
      track: true,
    })

    this.dragModule.reset()
  }
}

export { ChartConfig, Dimension, DimensionType, LinesChart }
