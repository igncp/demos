import {
  Selection,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  drag,
  forceCenter,
  forceLink as forceLinkD3,
  forceManyBody,
  forceSimulation,
  select,
} from "d3"

import * as styles from "./force.module.css"

type CustomDragEvent = DragEvent & { active: boolean }

const settings = {
  circleRadius: 5,
  defaultTextOpacity: 0.5,
  strength: -40,
  textDY: 5,
}

// eslint-disable-next-line id-denylist
const getNodeId = (node: { index?: number }) => `node-text-${node.index!}`

type ChartConfig<NodeData, LinkData> = {
  forceData: { links: LinkData[]; nodes: NodeData[] }
  getNodeText: (node: NodeData) => string
  height: number
  rootElId: string
}

type ChartElements = {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}

class ForceChart<NodeData, LinkData extends SimulationLinkDatum<NodeData>> {
  private readonly config: ChartConfig<NodeData, LinkData>
  private readonly elements: ChartElements
  private readonly simulation: Simulation<NodeData, undefined>
  private readonly forceNodes: Array<NodeData & SimulationNodeDatum>
  private readonly forceLinks: Array<
    SimulationLinkDatum<NodeData & SimulationNodeDatum>
  >

  public constructor(config: ChartConfig<NodeData, LinkData>) {
    this.config = config

    const { forceData, rootElId } = config
    const { links, nodes } = forceData

    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.forceChart)

    const svg = select(`#${rootElId}`).append("svg")

    this.elements = { svg }

    const forceLink = forceLinkD3<NodeData, LinkData>().links(
      links.map((link) => ({ ...link }))
    )

    const simulation = forceSimulation<NodeData>(
      nodes.map((node) => ({ ...node }))
    )
      .force("link", forceLink)
      .on("tick", () => {
        this.render()
      })

    this.simulation = simulation
    this.forceNodes = this.simulation.nodes()
    this.forceLinks = forceLink.links()

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  private readonly handleResize = () => {
    this.render()
  }

  private render() {
    const {
      config: { height, rootElId },
    } = this

    const rootEl = document.getElementById(rootElId) as HTMLElement

    const { width } = rootEl.getBoundingClientRect()

    this.simulation
      .force("charge", forceManyBody().strength(settings.strength))
      .force("center", forceCenter(width / 2, height / 2))

    this.elements.svg.attr("width", width).attr("height", height)
    this.updateLinks()
    this.updateNodes()
  }

  private updateLinks() {
    const {
      elements: { svg },
    } = this
    const linksEls = svg
      .selectAll<SVGPathElement, ForceChart<NodeData, LinkData>["forceLinks"]>(
        `.${styles.linkCurved}`
      )
      .data(this.forceLinks)

    type ForceNode = NodeData & SimulationNodeDatum

    linksEls
      .enter()
      .append<SVGPathElement>("path")
      .merge(linksEls)
      .attr("d", (forceLink) => {
        const { source, target } = forceLink as {
          source: ForceNode
          target: ForceNode
        }
        const dx = target.x! - source.x!
        const dy = target.y! - source.y!
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.3

        return `M${source.x!},${source.y!}A${dr},${dr} 0 0,1 ${target.x!},${target.y!}`
      })
      .attr("class", styles.linkCurved)
      .attr("marker-end", "url(#end)")
      .attr("id", (...[, forceLinkIndex]) => `link-${forceLinkIndex}`)

    linksEls.exit().remove()
  }

  private updateNodes() {
    type ForceNode = ForceChart<NodeData, LinkData>["forceNodes"][0]

    const {
      config: { getNodeText },
      elements: { svg },
      forceNodes,
    } = this
    const nodesEls = svg
      .selectAll<SVGCircleElement, ForceNode>("circle")
      .data(forceNodes)
    const textsEls = svg
      .selectAll<SVGTextElement, ForceNode>("text")
      .data(forceNodes)

    const dragstarted = (
      ...[dragEvent, forceNode]: [CustomDragEvent, ForceNode]
    ) => {
      if (!dragEvent.active) {
        this.simulation.alphaTarget(0.3).restart()
      }

      forceNode.fx = forceNode.x
      forceNode.fy = forceNode.y
    }

    const dragged = (
      ...[dragEvent, forceNode]: [CustomDragEvent, ForceNode]
    ) => {
      forceNode.fx = dragEvent.x
      forceNode.fy = dragEvent.y
    }

    const dragended = (
      ...[dragEvent, forceNode]: [CustomDragEvent, ForceNode]
    ) => {
      if (!dragEvent.active) {
        this.simulation.alphaTarget(0)
      }

      forceNode.fx = null
      forceNode.fy = null
    }

    nodesEls
      .enter()
      .append("circle")
      .merge(nodesEls)
      .attr("cx", (forceNode) => forceNode.x!)
      .attr("cy", (forceNode) => forceNode.y!)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "black")
      .each(function setupMouseHandlers() {
        select<SVGCircleElement, ForceNode>(this)
          .on("mouseover", (...[, forceNode]) => {
            select(`#${getNodeId(forceNode)}`).style("opacity", 1)
          })
          .on("mouseleave", (...[, forceNode]) => {
            select(`#${getNodeId(forceNode)}`).style(
              "opacity",
              settings.defaultTextOpacity
            )
          })
      })
      .call(
        drag<SVGCircleElement, ForceNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text(getNodeText)
      .attr("x", (forceNode) => forceNode.x!)
      .attr("y", (forceNode) => forceNode.y!)
      .attr("dy", () => settings.textDY)
      .attr("id", getNodeId)
      .style("opacity", settings.defaultTextOpacity)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }
}

export { ChartConfig, ForceChart }
