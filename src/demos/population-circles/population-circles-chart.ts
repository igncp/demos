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
import anime from "animejs"
import chroma from "chroma-js"

import * as styles from "./population-circles.module.css"

const dropShadowBaseId = "dropShadowBase"

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 70,
}
const height = 400

export type ChartConfig<ChartData> = {
  colorDomain: string[]
  getChartItems: () => ChartData[]
  getEmptyItem: () => ChartData
  getHeaderText: (o: { chartItems: ChartData[] }) => string
  getIsSmall: () => boolean
  getItemId: (a: ChartData) => string
  getItemLabel: (a: ChartData) => string
  getItemMetric: (i: ChartData) => number
  getItemTitle: (o: { itemData: ChartData }) => string
  getStringForColor: (d: ChartData) => string
  onClick: (m: ChartData) => void
  rootElId: string
}

type RenderChartReturn = {
  updateChart: () => void
}

export const renderChart = <ChartData>(
  chartConfig: ChartConfig<ChartData>
): RenderChartReturn => {
  type ChartNode = HierarchyCircularNode<ChartData>

  const chartEl = document.getElementById(chartConfig.rootElId) as HTMLElement
  const { width } = chartEl.getBoundingClientRect()

  const lastPosition = { k: 1, x: 0, y: 0 }

  // this zoom function is not working well in all directions
  const zoomed = function (
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

  const color = scaleOrdinal<string, string>()
    .domain(chartConfig.colorDomain)
    .range(schemeSet3)

  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .extent([
      [0, 0],
      [width / 2, height / 2],
    ])
    .on("end", zoomed)

  const svg = select(`#${chartConfig.rootElId}`)
    .append("svg")
    .attr("viewBox", [0, 0, width, height + margin.top].join(", "))
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .call(zoomBehavior)

  addDropShadow(svg, dropShadowBaseId, 0.5, 2)

  const header = svg
    .append("text")
    .attr("class", styles.header)
    .text("")
    .attr("transform", `translate(${width / 2}, 50)`)

  const svgContent = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const transitionChart = () => {
    const filteredData = chartConfig.getChartItems()
    const hoverAnimations: { [k: string]: anime.AnimeInstance | null } = {}

    const structure = hierarchy({
      ...chartConfig.getEmptyItem(),
      children: filteredData,
    }).sum(chartConfig.getItemMetric)

    const isSmall = chartConfig.getIsSmall()

    const root = pack<ChartData>()
      .size(isSmall ? [width / 2, height / 2] : [width, height])
      .padding(3)(structure)

    const leaves = root.leaves()

    header.text(
      chartConfig.getHeaderText({
        chartItems: filteredData,
      })
    )

    const getDataKey = (node: unknown) =>
      chartConfig.getItemId((node as HierarchyCircularNode<ChartData>).data)

    const leaf = svgContent.selectAll(".leaf").data(leaves, getDataKey)

    leaf.exit().remove()

    const getTitle = (node: HierarchyCircularNode<ChartData>) =>
      chartConfig.getItemTitle({
        itemData: node.data,
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
      .on("mouseenter", function (_event, node) {
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
      .on("mouseleave", function (_event, node) {
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
      .on("click", (_event, node) => {
        chartConfig.onClick(node.data)
      })

    const generateColor = (node: HierarchyCircularNode<ChartData>) =>
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
      const el = letter.text((node) =>
        chartConfig.getItemLabel(node.data)
      ) as ChartTransition

      el.style("font-size", (node) => `${node.r.toFixed(0)}px`)
        .attr("dy", (node) => node.r / 3)
        .attr("fill", generateDarkerColor)
    }

    const setupCircle = (
      circle:
        | ChartTransition
        | Selection<SVGCircleElement, ChartNode, SVGGElement, unknown>
    ) => {
      const elem = circle.attr("r", (node) => node.r!) as ChartTransition

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

  transitionChart()

  return {
    updateChart: transitionChart,
  }
}

const addDropShadow = (
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
  name: string,
  slope: number,
  deviation: number
) => {
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
