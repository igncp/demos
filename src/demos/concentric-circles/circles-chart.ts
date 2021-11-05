import { Selection, extent, max, range, scaleLinear, select } from "d3"
import { v1 as uuidv1 } from "uuid"

const colours = ["#7c7cc9", "#52d552", "#337233", "#323247"]

const margin = {
  bottom: 20,
  left: 20,
  right: 20,
  top: 20,
}
const strokeWidth = "2px"

const addFilter = <ChartData>(
  svg: Selection<SVGGElement, ChartData, HTMLElement, unknown>
) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter")

  filter.attr("id", "drop-shadow")
  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 9)
  filter.append("feOffset").attr("dx", 5).attr("dy", 5)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", ".3")
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

type ChartConfig<ChartData> = Readonly<{
  chartDescription: string
  getCircleId: (circle: ChartData) => string
  getCircleTitle: (circle: ChartData) => string
  getCircleValue: (circle: ChartData) => number
  getCirclesData: () => ChartData[]
  rootElId: string
}>

type ChartElements<ChartData> = Readonly<{
  descriptionSel: Selection<SVGTextElement, ChartData, HTMLElement, unknown>
  gSel: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  svgSel: Selection<SVGSVGElement, ChartData, HTMLElement, unknown>
}>

class CirclesChart<ChartData> {
  private readonly config: ChartConfig<ChartData>
  private readonly elements: ChartElements<ChartData>
  private readonly circleClass: string

  private constructor(config: ChartConfig<ChartData>) {
    this.config = config

    const svgSel = select<HTMLElement, ChartData>(`#${config.rootElId}`).append(
      "svg"
    )
    const gSel = svgSel.append("g")
    const descriptionSel = gSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("width", "20px")

    this.circleClass = `name-circle-${uuidv1().slice(0, 6)}`

    this.elements = {
      descriptionSel,
      gSel,
      svgSel,
    }

    addFilter<ChartData>(gSel)

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  public static renderChart<ChartData>(config: ChartConfig<ChartData>) {
    return new CirclesChart(config)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  public refresh() {
    this.render()
  }

  private render() {
    const {
      config: {
        chartDescription,
        getCircleId,
        getCircleTitle,
        getCircleValue,
        getCirclesData,
        rootElId,
      },
      elements,
    } = this

    const circlesData = getCirclesData()

    const colorScale = scaleLinear()
      .domain(extent(circlesData, getCircleValue) as [number, number])
      .range([0, 1])

    const heatmapColour = scaleLinear<string>()
      .domain(range(0, 1, 1.0 / colours.length))
      .range(colours)

    const colorize = (circle: ChartData) => {
      const circleValue = getCircleValue(circle)
      const colorNormalized = colorScale(circleValue)

      return heatmapColour(colorNormalized)
    }

    const dataMax = max(circlesData, getCircleValue) as number

    const rootEl = document.getElementById(rootElId) as HTMLElement
    const { width: elWidth } = rootEl.getBoundingClientRect()

    const width = elWidth - margin.left - margin.right
    const height = max(circlesData, getCircleValue)! * 2.5

    elements.svgSel
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.left + margin.right)

    const groupUpdates = elements.gSel
      .selectAll<SVGGElement, ChartData>(".circle-group")
      .data(circlesData, getCircleId)

    groupUpdates
      .enter()
      .append("g")
      .attr("class", "circle-group")
      .append("circle")
      .attr("class", this.circleClass)

    groupUpdates.exit().remove()

    elements.gSel
      .selectAll<SVGCircleElement, ChartData>(`.${this.circleClass}`)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("title", getCircleTitle)
      .style("fill", "none")
      .style("stroke", colorize)
      .style("stroke-width", strokeWidth)
      .style("filter", (circle) =>
        getCircleValue(circle) > dataMax / 2.5 ? "url(#drop-shadow)" : ""
      )
      .on("mouseenter", function onMouseOver() {
        select(this).style("stroke", "#D88021").style("stroke-width", "10px")
      })
      .on("mouseleave", function onMouseLeave() {
        select<SVGCircleElement, ChartData>(this)
          .style("stroke", colorize)
          .style("stroke-width", strokeWidth)
      })
      .attr("r", (...[, circleIndex]) => `${circleIndex / 5}px`)

    $(`.${this.circleClass}`).tooltip({
      track: true,
    })

    elements.descriptionSel
      .text(chartDescription)
      .attr("transform", `translate(${width / 2},${height - 10})`)
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { CirclesChart, ChartConfig }
