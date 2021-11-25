import anime from "animejs"
import chroma from "chroma-js"
import { Selection, scaleOrdinal, schemePastel2, select } from "d3"
import {
  SankeyLink,
  SankeyNode,
  sankey as sankeyD3,
  sankeyLeft,
  sankeyLinkHorizontal,
} from "d3-sankey"

import * as styles from "./energy-sankey.module.css"

type AddedGradients = {
  [key: string]: boolean
}

type State = {
  addedGradients: AddedGradients
  isInTransition: boolean
  linkSelected: boolean
  selectedNode: string
}

const getRandomInt = ({ max, min }: { max: number; min: number }): number => {
  const minRound = Math.ceil(min)
  const maxRound = Math.floor(max)

  return Math.floor(Math.random() * (maxRound - minRound + 1)) + minRound
}

const createGradients = ({
  addedGradients,
  fromColor,
  svg,
  toColor,
}: {
  addedGradients: AddedGradients
  fromColor: string
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  toColor: string
}): string => {
  const id = `link-gradient-${fromColor}-${toColor}`.replace(/#/g, "")

  if (id in addedGradients) {
    return id
  }

  const duration = getRandomInt({
    max: 3,
    min: 1,
  })
  const colorScale = chroma.scale([fromColor, toColor])

  const text = `
<linearGradient id="${id}">
  <stop offset="0%" stop-color="${fromColor}" />
  <stop offset="50%" stop-color="${colorScale(0.5)}">
    <animate attributeName="offset"
      values="${[5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 3, 4]
        .map((offsetValue) => `.${offsetValue}`)
        .join(";")}"
      dur="${duration}s"
      repeatCount="indefinite" />
  </stop>
  <stop offset="100%" stop-color="${toColor}" />
</linearGradient>
`.trim()

  svg.append("defs").html(text)

  addedGradients[id] = true

  return id
}

const sankeyHeight = 1000
const legendHeight = 0
const svgHeight = sankeyHeight + legendHeight

type ChartConfig<NodeData, LinkData> = {
  chartLinks: LinkData[]
  chartNodes: NodeData[]
  getLinkTitle: (linkInfo: {
    sankeyLink: LinkData
    sankeyLinkSource: NodeData
    sankeyLinkTarget: NodeData
  }) => string
  getNodeId: (node: NodeData) => string
  getNodeText: (node: NodeData) => string
  getNodeTitle: (nodeInfo: {
    nodeValue: number
    sankeyNode: NodeData
  }) => string
  onNodeClick?: (node: NodeData) => boolean
  rootElId: string
}

type ChartElements = {
  linkG: Selection<SVGGElement, unknown, HTMLElement, unknown>
  nodeG: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}

class SankeyChart<NodeData, LinkData> {
  private readonly config: ChartConfig<NodeData, LinkData>
  private readonly state: State = {
    addedGradients: {},
    isInTransition: false,
    linkSelected: false,
    selectedNode: "",
  }

  private readonly elements: ChartElements

  public constructor(chartConfig: ChartConfig<NodeData, LinkData>) {
    this.config = chartConfig

    const svg = select(`#${chartConfig.rootElId}`).append("svg")
    const nodeG = svg.append("g").attr("stroke", "#000")
    const linkG = svg.append("g").attr("fill", "none")

    this.elements = {
      linkG,
      nodeG,
      svg,
    }

    this.render()
  }

  private render() {
    const {
      config: { chartLinks, chartNodes, getNodeId, onNodeClick, rootElId },
      config: chartConfig,
      elements,
    } = this

    const container = document.getElementById(rootElId) as HTMLElement

    const color = (() => {
      const colorFn = scaleOrdinal(schemePastel2)

      return (sankeyNode: NodeData) => colorFn(getNodeId(sankeyNode))
    })()

    const { width } = container.getBoundingClientRect()

    elements.svg.attr("height", svgHeight).attr("width", width)

    const sankeyVal = sankeyD3<NodeData, LinkData>()
      .nodeId(getNodeId)
      .nodeAlign(sankeyLeft)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [width - 1, sankeyHeight - 5],
      ])

    const { links, nodes } = sankeyVal({
      links: chartLinks.map((sankeyLink) =>
        Object.assign({}, sankeyLink)
      ) as unknown as Array<SankeyLink<NodeData, LinkData>>,
      nodes: chartNodes.map((sankeyNode) =>
        Object.assign({}, sankeyNode)
      ) as NodeData[],
    })

    let lastAnime = () => {}

    const nodeClickHandler = ({
      linkPath,
      sankeyNode,
    }: {
      linkPath: Selection<
        SVGPathElement,
        SankeyLink<NodeData, LinkData>,
        SVGGElement,
        unknown
      >
      sankeyNode: SankeyNode<NodeData, LinkData>
    }) => {
      if (this.state.isInTransition) {
        return
      }

      if (onNodeClick) {
        const shouldPreventDefault = onNodeClick(sankeyNode)

        if (shouldPreventDefault) {
          return
        }
      }

      if (this.state.selectedNode === getNodeId(sankeyNode)) {
        linkPath.attr("display", null).style("opacity", null)
        this.state.selectedNode = ""
      } else {
        this.state.isInTransition = true

        if (this.state.selectedNode) {
          linkPath
            .style("opacity", (sankeyLink) =>
              [
                getNodeId(sankeyLink.source as NodeData),
                getNodeId(sankeyLink.target as NodeData),
              ].includes(this.state.selectedNode)
                ? null
                : 0
            )
            .attr("display", null)
        }

        requestAnimationFrame(() => {
          linkPath
            .transition()
            .duration(500)
            .style("opacity", (sankeyLink) =>
              [
                getNodeId(sankeyLink.source as NodeData),
                getNodeId(sankeyLink.target as NodeData),
              ].includes(getNodeId(sankeyNode))
                ? null
                : 0
            )
            .on("end", () => {
              this.state.isInTransition = false
              linkPath.attr("display", (sankeyLink) =>
                [
                  getNodeId(sankeyLink.source as NodeData),
                  getNodeId(sankeyLink.target as NodeData),
                ].includes(getNodeId(sankeyNode))
                  ? null
                  : "none"
              )
            })

          this.state.selectedNode = getNodeId(sankeyNode)
        })
      }
    }

    const node = elements.nodeG
      .selectAll("rect")
      .data<SankeyNode<NodeData, LinkData>>(nodes)
      .join("rect")
      .attr("class", styles.chartNode)
      .attr("x", (sankeyNode) => sankeyNode.x0!)
      .attr("y", (sankeyNode) => sankeyNode.y0!)
      .attr("height", (sankeyNode) => sankeyNode.y1! - sankeyNode.y0!)
      .attr("width", (sankeyNode) => sankeyNode.x1! - sankeyNode.x0!)
      .attr("fill", color)
      .on("mouseenter", function onMouseEnter() {
        lastAnime()

        const animationFirst = anime({
          direction: "alternate",
          duration: 1000,
          easing: "easeInOutSine",
          loop: false,
          strokeDashoffset: [anime.setDashoffset, 0],
          targets: this,
        })
        const animationSecond = anime({
          direction: "alternate",
          duration: 2000,
          easing: "spring(1, 80, 10, 0)",
          loop: true,
          opacity: [0.6, 1, 0.6],
          targets: this,
        })

        lastAnime = () => {
          animationFirst.seek(animationFirst.duration)
          animationSecond.seek(0)
          anime.remove(this)
          lastAnime = () => {}
        }
      })
      .on("mouseleave", () => {
        lastAnime()
      })
      .on("click", (...[, sankeyNode]) => {
        nodeClickHandler({
          linkPath, // eslint-disable-line @typescript-eslint/no-use-before-define
          sankeyNode,
        })
      })

    node.attr("title", (sankeyNode) =>
      chartConfig.getNodeTitle({
        nodeValue: sankeyNode.value!,
        sankeyNode,
      })
    )

    $(`.${styles.chartNode}`).tooltip({
      track: true,
    })

    const link = elements.linkG
      .selectAll("g")
      .data<SankeyLink<NodeData, LinkData>>(links)
      .join("g")
      .attr("class", styles.chartLinkG)

    const linkPathGenerator = sankeyLinkHorizontal()
    const { state } = this

    const linkPath = link
      .append("path")
      .attr("d", (sankeyLink) => {
        const isHorizontalLine = sankeyLink.y0 === sankeyLink.y1

        return linkPathGenerator(
          // this is necessary for the default gradientUnits (objectBoundingBox) to work
          // https://stackoverflow.com/a/34687362
          isHorizontalLine
            ? {
                ...sankeyLink,
                y1: sankeyLink.y1! + 0.1,
              }
            : sankeyLink
        )
      })
      .attr("stroke", (sankeyLink) => {
        const fromColor = color(sankeyLink.source as NodeData)
        const toColor = color(sankeyLink.target as NodeData)

        const id = createGradients({
          addedGradients: state.addedGradients,
          fromColor,
          svg: elements.svg,
          toColor,
        })

        return `url(#${id})`
      })
      .attr("class", styles.chartLink)
      .attr("stroke-width", (sankeyLink) => Math.max(1, sankeyLink.width!))
      .on("click", function onLinkClick() {
        if (state.isInTransition) {
          return
        }

        const currentLink = select(this)

        if (state.linkSelected) {
          linkPath.attr("display", null).style("opacity", null)
        } else {
          linkPath.attr("display", "none")
          currentLink.attr("display", null)
        }

        state.selectedNode = ""
        state.linkSelected = !state.linkSelected
      })

    link.attr("title", (sankeyLink) =>
      chartConfig.getLinkTitle({
        sankeyLink,
        sankeyLinkSource: sankeyLink.source as NodeData,
        sankeyLinkTarget: sankeyLink.target as NodeData,
      })
    )

    $(`.${styles.chartLink}`).tooltip({
      track: true,
    })

    elements.nodeG.each(function appendOnEnd(this) {
      const parentEl = this.parentNode as HTMLElement

      parentEl.appendChild(this)
    })

    elements.svg
      .append("g")
      .attr("font-family", "sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (sankeyNode) =>
        sankeyNode.x0! < width / 2 ? sankeyNode.x1! + 6 : sankeyNode.x0! - 6
      )
      .attr("y", (sankeyNode) => (sankeyNode.y1! + sankeyNode.y0!) / 2)
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .attr("text-anchor", (sankeyNode) =>
        sankeyNode.x0! < width / 2 ? "start" : "end"
      )
      .text(chartConfig.getNodeText)
  }
}

export { SankeyChart, ChartConfig }
