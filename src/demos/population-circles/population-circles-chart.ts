import anime from "animejs"
import chroma from "chroma-js"
import {
  BaseType,
  D3ZoomEvent,
  HierarchyCircularNode,
  Selection,
  Transition,
  easeCircleInOut,
  easeSinInOut,
  hierarchy,
  pack,
  scaleOrdinal,
  schemeSet3,
  select,
  zoom,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"

import * as styles from "./population-circles.module.css"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

const dropShadowBaseId = "dropShadowBase"

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 70,
}
const height = 400

type ChartConfig<CircleData> = {
  colorDomain: string[]
  getChartItems: () => CircleData[]
  getEmptyItem: () => CircleData
  getHeaderText: (options: { chartItems: CircleData[] }) => string
  getIsSmall: () => boolean
  getItemId: (circleData: CircleData) => string
  getItemLabel: (circleData: CircleData) => string
  getItemMetric: (circleData: CircleData) => number
  getItemTitle: (options: { circleData: CircleData }) => string
  getStringForColor: (circleData: CircleData) => string
  onClick: (m: CircleData) => void
  rootElId: string
}

type AddDropShadow = (options: {
  deviation: number
  name: string
  slope: number
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}) => void

const addDropShadow: AddDropShadow = ({ deviation, name, slope, svg }) => {
  svg.append("filter").html(`
<filter id="${name}" height="130%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="${deviation}"/>
  <feOffset dx="2" dy="2" result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope="${slope}"/>
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
`)
}

type ChartElements = {
  header: Selection<SVGTextElement, unknown, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgContent: Selection<SVGGElement, unknown, HTMLElement, unknown>
}

class CirclesChart<CircleData> {
  private readonly config: ChartConfig<CircleData>
  private readonly elements: ChartElements

  public constructor(chartConfig: ChartConfig<CircleData>) {
    this.config = chartConfig

    const svg = select(`#${chartConfig.rootElId}`)
      .append("svg")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")

    addDropShadow({ deviation: 2, name: dropShadowBaseId, slope: 0.5, svg })

    const header = svg.append("text").attr("class", styles.header).text("")

    const svgContent = svg.append("g")

    this.elements = {
      header,
      svg,
      svgContent,
    }

    this.setupZoom()
    this.update()
  }

  public update() {
    type ChartNode = HierarchyCircularNode<CircleData>

    const { config: chartConfig, elements } = this
    const width = this.getWidth()

    const { header, svgContent } = elements
    const filteredData = chartConfig.getChartItems()
    const hoverAnimations: { [k: string]: anime.AnimeInstance | null } = {}

    elements.svg.attr("viewBox", [0, 0, width, height + margin.top].join(", "))
    elements.header.attr("transform", `translate(${width / 2}, 50)`)
    elements.svgContent.attr(
      "transform",
      `translate(${margin.left}, ${margin.top})`
    )

    const structure = hierarchy({
      ...chartConfig.getEmptyItem(),
      children: filteredData,
    }).sum(chartConfig.getItemMetric)

    const isSmall = chartConfig.getIsSmall()

    const root = pack<CircleData>()
      .size(isSmall ? [width / 2, height / 2] : [width, height])
      .padding(3)(structure)

    const leaves = root.leaves()

    header.text(
      chartConfig.getHeaderText({
        chartItems: filteredData,
      })
    )

    const getDataKey = (node: unknown) =>
      chartConfig.getItemId((node as HierarchyCircularNode<CircleData>).data)

    const leaf = svgContent.selectAll(".leaf").data(leaves, getDataKey)

    leaf.exit().remove()

    const getTitle = (node: HierarchyCircularNode<CircleData>) =>
      chartConfig.getItemTitle({
        circleData: node.data,
      })

    leaf
      .attr("title", getTitle)
      .transition()
      .duration(1000)
      .ease(easeCircleInOut)
      .attr("transform", (chartNode) => {
        if (isSmall) {
          return `translate(${chartNode.x + width / 4},${
            chartNode.y + height / 4
          })`
        }

        return `translate(${chartNode.x + 1},${chartNode.y + 1})`
      })

    const enter = leaf
      .enter()
      .append("g")
      .attr("class", "leaf")
      .attr("title", getTitle)
      .attr("transform", (node) => `translate(${node.x + 1},${node.y + 1})`)
      .on("mouseenter", function onMouseEnter(...[, node]) {
        const selection = select(this).select(`.${styles.circle}`)

        select(this)
          .select(".letter")
          .attr("filter", `url(#${dropShadowBaseId})`)

        const id = chartConfig.getItemId(node.data)

        const hoverAnimation = anime({
          complete: () => {
            hoverAnimations[id] = null
          },
          strokeWidth: "5px",
          targets: [selection.node()],
        })

        hoverAnimations[id] = hoverAnimation
      })
      .on("mouseleave", function onMouseLeave(...[, node]) {
        const selection = select(this).select(`.${styles.circle}`)

        select(this).select(".letter").attr("filter", null)

        const id = chartConfig.getItemId(node.data)
        const { [id]: hoverAnimation } = hoverAnimations

        if (hoverAnimation) {
          hoverAnimation.seek(0)
          anime.remove(selection.node())
          hoverAnimations[id] = null
        }

        anime({
          strokeWidth: "0px",
          targets: [selection.node()],
        })
      })
      .on("click", (...[, node]) => {
        chartConfig.onClick(node.data)
      })

    const color = scaleOrdinal<string, string>()
      .domain(chartConfig.colorDomain)
      .range(schemeSet3)

    const generateColor = (node: HierarchyCircularNode<CircleData>) =>
      color(chartConfig.getStringForColor(node.data))

    const generateDarkerColor = (node: ChartNode) => {
      const baseColor = generateColor(node)

      return chroma(baseColor).darken(1.5).hex()
    }

    type ChartTransition = Transition<BaseType, ChartNode, BaseType, ChartNode>

    const setupLetter = (
      letter:
        | ChartTransition
        | Selection<SVGTextElement, ChartNode, SVGGElement, unknown>
    ) => {
      const letterSelection = letter.text((node) =>
        chartConfig.getItemLabel(node.data)
      ) as ChartTransition

      letterSelection
        .style("font-size", (node) => `${node.r.toFixed(0)}px`)
        .attr("dy", (node) => node.r / 3)
        .attr("fill", generateDarkerColor)
    }

    const setupCircle = (
      circle:
        | ChartTransition
        | Selection<SVGCircleElement, ChartNode, SVGGElement, unknown>
    ) => {
      const elem = circle.attr("r", (node) => node.r) as ChartTransition

      elem.attr("fill", generateColor).attr("stroke", generateDarkerColor)
    }

    setupCircle(enter.append("circle").attr("class", styles.circle))

    setupLetter(enter.append("text").attr("class", "letter"))

    const forwardData = (node: ChartNode) => node

    const circles = leaf
      .selectAll(`.${styles.circle}`)
      .data(forwardData, getDataKey)
    const texts = leaf.selectAll(".letter").data(forwardData, getDataKey)

    setupCircle(circles.transition().duration(1000).ease(easeSinInOut))

    setupLetter(texts.transition().duration(1000).ease(easeSinInOut))

    $(".leaf").tooltip({
      track: true,
    })
  }

  private getWidth() {
    const { config: chartConfig } = this
    const chartEl = document.getElementById(chartConfig.rootElId) as HTMLElement
    const { width } = chartEl.getBoundingClientRect()

    return width
  }

  private setupZoom() {
    const {
      elements: { svg },
    } = this
    const width = this.getWidth()
    const lastPosition = { k: 1, x: 0, y: 0 }

    // this zoom function is not working well in all directions
    // eslint-disable-next-line max-params
    function zoomed(
      this: SVGSVGElement,
      zoomEvent: D3ZoomEvent<SVGSVGElement, unknown>
    ) {
      const transition = select(this).transition().duration(150)
      let {
        transform: { x, y },
      } = zoomEvent
      const {
        transform: { k },
      } = zoomEvent

      if (k !== lastPosition.k) {
        x = lastPosition.x
        y = lastPosition.y
      }

      transition.attr("transform", `translate(${x}, ${y}) scale(${k})`)

      lastPosition.k = k
      lastPosition.x = x
      lastPosition.y = y
    }

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width / 2, height / 2],
      ])
      .on("end", zoomed)

    svg.call(zoomBehavior)
  }
}

export { ChartConfig, CirclesChart }
