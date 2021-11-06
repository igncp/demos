import {
  D3DragEvent,
  Selection,
  drag,
  interpolateCool,
  max,
  scaleLinear,
  scaleOrdinal,
  select,
} from "d3"
import { v1 as uuidv1 } from "uuid"

const margin = {
  bottom: 20,
  left: 20,
  right: 20,
  top: 20,
}

// https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
const getNewDrag = ({
  baseZoom,
  newZoom,
  prevDragX,
  prevDragY,
  prevZoom,
  zoomPoint,
}: {
  baseZoom: number
  newZoom: number
  prevDragX: number
  prevDragY: number
  prevZoom: number
  zoomPoint: { x: number; y: number }
}) => {
  const scalechange = (newZoom - prevZoom) / baseZoom
  const offsetX = -(zoomPoint.x * scalechange)
  const offsetY = -(zoomPoint.y * scalechange)

  return {
    x: prevDragX + offsetX,
    y: prevDragY + offsetY,
  }
}

type ChartConfig<ChartData> = Readonly<{
  chartDescription: string
  circlesData: ChartData[]
  getCircleId: (circle: ChartData) => string
  getCircleTitle: (circle: ChartData) => string
  getCircleValue: (circle: ChartData) => number
  rootElId: string
}>

type ChartElements<ChartData> = Readonly<{
  descriptionSel: Selection<SVGTextElement, ChartData, HTMLElement, unknown>
  dragSel: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  gSel: Selection<SVGGElement, ChartData, HTMLElement, unknown>
  rootSel: Selection<HTMLElement, ChartData, HTMLElement, unknown>
  svgSel: Selection<SVGSVGElement, ChartData, HTMLElement, unknown>
}>

class CirclesChart<ChartData> {
  public static defaultZoom = 10

  private readonly config: ChartConfig<ChartData>
  private readonly elements: ChartElements<ChartData>
  private readonly circleClass: string
  private readonly state: {
    dragX: number
    dragY: number
    selectedCircles: Record<string, boolean>
    zoom: number
  } = {
    dragX: 0,
    dragY: 0,
    selectedCircles: {},
    zoom: CirclesChart.defaultZoom,
  }

  private constructor(config: ChartConfig<ChartData>) {
    this.config = config

    const rootSel = select<HTMLElement, ChartData>(`#${config.rootElId}`)
    const svgSel = rootSel.append("svg")
    const dragSel = svgSel.append("g")
    const gSel = dragSel.append("g")
    const descriptionSel = gSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("width", "20px")

    this.circleClass = `name-circle-${uuidv1().slice(0, 6)}`

    this.elements = {
      descriptionSel,
      dragSel,
      gSel,
      rootSel,
      svgSel,
    }

    this.setupDrag()
    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  public static renderChart<ChartData>(config: ChartConfig<ChartData>) {
    return new CirclesChart(config)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  public setZoom(zoom: number) {
    const { height, width } = this.getDimensions()

    const newDrag = getNewDrag({
      baseZoom: CirclesChart.defaultZoom,
      newZoom: zoom,
      prevDragX: this.state.dragX,
      prevDragY: this.state.dragY,
      prevZoom: this.state.zoom,
      zoomPoint: { x: width / 2, y: height / 2 },
    })

    this.state.zoom = zoom
    this.state.dragX = newDrag.x
    this.state.dragY = newDrag.y

    this.updateDrag()
  }

  private updateDrag() {
    const {
      elements: { dragSel },
    } = this

    dragSel.attr(
      "transform",
      `translate(${this.state.dragX},${this.state.dragY}) scale(${
        this.state.zoom / CirclesChart.defaultZoom
      })`
    )
  }

  private setupDrag() {
    const {
      elements: { svgSel },
    } = this

    const dragHandler = drag<SVGSVGElement, ChartData>().on(
      "drag",
      (dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>) => {
        this.state.dragX += dragEvent.dx
        this.state.dragY += dragEvent.dy

        this.updateDrag()
      }
    )

    svgSel.style("cursor", "move").call(dragHandler).on("wheel", null)
  }

  private getDimensions() {
    const {
      config: { circlesData, getCircleValue, rootElId },
    } = this
    const rootEl = document.getElementById(rootElId) as HTMLElement
    const { width: elWidth } = rootEl.getBoundingClientRect()

    const width = elWidth - margin.left - margin.right
    const height = max(circlesData, getCircleValue)! * 2.5

    return {
      height,
      width,
    }
  }

  private render() {
    const {
      config: {
        chartDescription,
        circlesData,
        getCircleId,
        getCircleTitle,
        getCircleValue,
      },
      elements,
    } = this

    this.updateDrag()

    const maxValue = max(circlesData, getCircleValue) as number
    const colorScale = scaleOrdinal<number, number>()
      .domain([0, maxValue])
      .range([0, 0.5])
    const clickedColor = "orange"

    const colorize = (circle: ChartData) => {
      const circleId = getCircleId(circle)

      if (this.state.selectedCircles[circleId]) {
        return clickedColor
      }

      const circleValue = getCircleValue(circle)

      const normalized = colorScale(circleValue)

      return interpolateCool(normalized)
    }

    const { height, width } = this.getDimensions()

    elements.svgSel
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.left + margin.right)

    // It sorts from bigger to smaller value for the hover to work
    const sortedData = circlesData
      .slice(0)
      .sort(
        (...[circleA, circleB]) =>
          getCircleValue(circleB) - getCircleValue(circleA)
      )

    const groupUpdates = elements.gSel
      .selectAll<SVGGElement, ChartData>(".circle-group")
      .data(sortedData, getCircleId)

    groupUpdates
      .enter()
      .append("g")
      .attr("class", "circle-group")
      .append("circle")
      .attr("class", this.circleClass)

    groupUpdates.exit().remove()

    const maxRadius = Math.min(height / 2, width / 2)
    const scaleRadius = scaleLinear()
      .domain([0, maxValue])
      .range([0, maxRadius])

    const circles = elements.gSel.selectAll<SVGCircleElement, ChartData>(
      `.${this.circleClass}`
    )

    const {
      state: { selectedCircles },
    } = this

    const bigStroke = "4px"

    const getStrokeWidth = (circle: ChartData) => {
      const id = getCircleId(circle)

      return selectedCircles[id] ? bigStroke : "2px"
    }

    circles
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", "rgba(0, 0, 0, 0)")
      .style("stroke", colorize)
      .style("stroke-width", getStrokeWidth)
      .attr("r", (circle) => scaleRadius(getCircleValue(circle)))
      .on("mouseenter", function handleMouseEnter() {
        select<SVGCircleElement, ChartData>(this)
          .style("stroke", clickedColor)
          .style("stroke-width", bigStroke)
      })
      .on("mouseleave", function handleMouseLeave() {
        select<SVGCircleElement, ChartData>(this)
          .style("stroke", colorize)
          .style("stroke-width", getStrokeWidth)
      })
      .on("click", function handleClick(...[, circle]) {
        const id = getCircleId(circle)

        selectedCircles[id] = !selectedCircles[id]

        select<SVGCircleElement, ChartData>(this)
          .style("stroke", colorize)
          .style("stroke-width", getStrokeWidth)
      })
      .append("title")
      .text(getCircleTitle)

    elements.descriptionSel
      .text(chartDescription)
      .attr("transform", `translate(${width / 2},${height + 25})`)
  }

  private readonly handleResize = () => {
    this.render()
  }
}

const _test = process.env.NODE_ENV === "test" ? { getNewDrag } : null

export { CirclesChart, ChartConfig, _test }
