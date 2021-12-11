import {
  D3DragEvent,
  Selection,
  drag as dragD3,
  max as maxD3,
  scaleQuantile,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"

import * as styles from "./weekly-heatmap.module.css"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

const colors = [
  "#ffffd9",
  "#edf8b1",
  "#c7e9b4",
  "#7fcdbb",
  "#41b6c4",
  "#1d91c0",
  "#225ea8",
  "#253494",
  "#081d58",
]
const { length: buckets } = colors

const margin = {
  bottom: 100,
  left: 50,
  right: 50,
  top: 50,
}
const minHeight = 250
const minWidth = 850

const rectRadiusSize = 100
const extraHeight = 60
const axisOffset = -6

const legendStroke = "#ccc"

type ChartConfig<ChartData> = Readonly<{
  getIsHorizontalLabelBold: (label: string, labelIndex: number) => boolean
  getIsVerticalLabelBold: (label: string, labelIndex: number) => boolean
  getItemHorizontalIndex: (cell: ChartData) => number
  getItemTooltip: (cell: ChartData) => string
  getItemValue: (cell: ChartData) => number
  getItemVerticalIndex: (cell: ChartData) => number
  getLegendText: (cellValue: number) => string
  horizontalLabels: string[]
  rootElId: string
  verticalLabels: string[]
  weeklyData: ChartData[]
}>

type ChartElements<ChartData> = Readonly<{
  cellsSel: Selection<SVGGElement, ChartData, SVGGElement, unknown>
  gSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  legendSel: Selection<SVGGElement, number, SVGGElement, unknown>
  svgDragSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgSel: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}>

type ChartClasses = Readonly<{
  cell: string
  legend: string
}>

class HeatmapChart<ChartData> {
  private readonly config: ChartConfig<ChartData>
  private readonly elements: ChartElements<ChartData>
  private readonly classes: ChartClasses
  private readonly state = {
    drag: {
      x: 0,
      y: 0,
    },
    width: 0,
  }

  private constructor(chartConfig: ChartConfig<ChartData>) {
    this.config = chartConfig

    const { rootElId } = chartConfig

    const svgSel = select(`#${rootElId}`).append("svg")
    const svgDragSel = svgSel.append("g")
    const gSel = svgDragSel.append("g")

    const chartClasses = {
      cell: "cell",
      legend: "legend",
    }

    this.classes = chartClasses

    this.elements = {
      get cellsSel() {
        return gSel.selectAll<SVGGElement, ChartData>(`.${chartClasses.cell}`)
      },
      gSel,
      get legendSel() {
        return gSel.selectAll<SVGGElement, number>(`.${chartClasses.legend}`)
      },
      svgDragSel,
      svgSel,
    }

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  public static renderChart<ChartData>(chartConfig: ChartConfig<ChartData>) {
    return new HeatmapChart<ChartData>(chartConfig)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  public refresh() {
    this.render()
  }

  private render() {
    const { config, elements } = this
    const { horizontalLabels, rootElId, verticalLabels, weeklyData } = config
    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.weeklyHeatmapChart)

    const fullWidth =
      rootEl.getBoundingClientRect().width - margin.left - margin.right
    const width = Math.max(fullWidth, minWidth)

    this.state.width = fullWidth

    const height = Math.max(
      Math.ceil((width * 10) / horizontalLabels.length) -
        margin.top -
        margin.bottom +
        extraHeight,
      minHeight
    )
    const cellSize = Math.floor(width / horizontalLabels.length)
    const legendElementWidth = cellSize * 2

    const max = maxD3(weeklyData, (cell) => config.getItemValue(cell))

    const colorScale = scaleQuantile<string>()
      .domain([0, buckets - 1, max])
      .range(colors)

    elements.svgSel
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)

    elements.gSel.attr("transform", `translate(${margin.left},${margin.top})`)

    elements.gSel
      .selectAll(".verticalLabel")
      .data(verticalLabels)
      .enter()
      .append("text")
      .attr(
        "class",
        (...[label, labelIndex]) =>
          `verticalLabel ${styles.mono} axis${
            config.getIsVerticalLabelBold(label, labelIndex)
              ? ` ${styles.axisBold}`
              : ""
          }`
      )

    elements.gSel
      .selectAll<SVGTextElement, string>(".verticalLabel")
      .text((label) => label)
      .attr("transform", `translate(${axisOffset},${cellSize / 1.5})`)
      .attr("x", 0)
      .attr("y", (...[, labelIndex]) => labelIndex * cellSize)
      .style("text-anchor", "end")

    elements.gSel
      .selectAll(".horizontalLabel")
      .data(horizontalLabels)
      .enter()
      .append("text")
      .text((label) => label)
      .style("text-anchor", "middle")
      .attr(
        "class",
        (...[label, labelIndex]) =>
          `horizontalLabel ${styles.mono} axis${
            config.getIsHorizontalLabelBold(label, labelIndex)
              ? ` ${styles.axisBold}`
              : ""
          }`
      )

    elements.gSel
      .selectAll<SVGTextElement, string>(".horizontalLabel")
      .attr("transform", `translate(${cellSize / 2}, ${axisOffset})`)
      .attr("x", (...[, labelIndex]) => labelIndex * cellSize)
      .attr("y", 0)

    elements.cellsSel
      .data(weeklyData)
      .enter()
      .append("rect")
      .attr("class", `${this.classes.cell} ${styles.bordered}`)
      .style("fill", colors[0])

    elements.cellsSel
      .transition()
      .duration(2000)
      .style("fill", (cellItem) => colorScale(config.getItemValue(cellItem)))

    elements.cellsSel
      .attr("height", cellSize)
      .attr("rx", rectRadiusSize)
      .attr("ry", rectRadiusSize)
      .attr("width", cellSize)
      .attr(
        "x",
        (cellItem) => config.getItemHorizontalIndex(cellItem) * cellSize
      )
      .attr("y", (cellItem) => config.getItemVerticalIndex(cellItem) * cellSize)
      .attr("title", config.getItemTooltip)

    $(`.${this.classes.cell}`).tooltip()

    const legendData = [0].concat(colorScale.quantiles())

    const legendNew = elements.legendSel
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", this.classes.legend)

    legendNew
      .append("rect")
      .style("fill", (...[, valueIndex]) => colors[valueIndex])
      .style("stroke", legendStroke)

    legendNew
      .append("text")
      .attr("class", styles.mono)
      .style("text-anchor", "middle")

    elements.legendSel.each(function handleLegendItem(
      ...[valueItem, valueIndex]
    ) {
      select(this)
        .selectAll("rect")
        .attr("x", legendElementWidth * valueIndex)
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", cellSize / 2)

      select(this)
        .selectAll<SVGTextElement, unknown>(`.${styles.mono}`)
        .attr("x", legendElementWidth * valueIndex + legendElementWidth / 2)
        .text(config.getLegendText(valueItem))
        .attr("y", height + cellSize)
    })

    this.setupDrag()
  }

  private setupDrag() {
    const { elements } = this

    const updateDrag = () => {
      this.elements.svgDragSel.attr(
        "transform",
        `translate(${this.state.drag.x},${this.state.drag.y})`
      )
    }

    const canUseDrag = this.state.width < minWidth

    const dragHandler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      if (!canUseDrag) {
        return
      }

      this.state.drag.x += dragEvent.dx
      this.state.drag.y += dragEvent.dy

      updateDrag()
    }

    const dragBehavior = dragD3<SVGSVGElement, unknown>().on(
      "drag",
      dragHandler
    )

    elements.svgSel.style("cursor", canUseDrag ? "move" : "default")

    if (!canUseDrag) {
      this.state.drag = { x: 0, y: 0 }
    }

    elements.svgSel.call(dragBehavior).on("drag", dragHandler)

    updateDrag()
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { HeatmapChart, ChartConfig }
