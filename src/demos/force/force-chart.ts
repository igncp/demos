import {
  Selection,
  Simulation,
  drag,
  forceCenter,
  forceLink as forceLinkD3,
  forceManyBody,
  forceSimulation,
  select,
} from "d3"

import * as styles from "./force.module.css"

type Node<NodeData> = NodeData & {
  fx: number | null
  fy: number | null
  index: number // eslint-disable-line id-denylist
  x: number
  y: number
}

type Link<NodeData> = {
  source: Node<NodeData>
  target: Node<NodeData>
}

type ForceData<NodeData> = {
  links: Array<Link<NodeData>>
  nodes: Array<Node<NodeData>>
}

type CustomDragEvent = DragEvent & { active: boolean }

const settings = {
  circleRadius: 5,
  defaultTextOpacity: 0.5,
  strength: -40,
  textDY: 5,
}

type ChartConfig<NodeData> = {
  forceData: ForceData<NodeData>
  getNodeText: (node: Node<NodeData>) => string
  height: number
  rootElId: string
}

type ChartElements = {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}

class ForceChart<NodeData> {
  private readonly config: ChartConfig<NodeData>
  private readonly simulation: Simulation<Node<NodeData>, undefined>
  private readonly elements: ChartElements

  public constructor(config: ChartConfig<NodeData>) {
    this.config = config

    const { forceData, height, rootElId } = config
    const { links, nodes } = forceData

    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.forceChart)

    const { width } = rootEl.getBoundingClientRect()

    const svg = select(`#${rootElId}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    this.elements = { svg }

    this.simulation = forceSimulation(nodes)
      .force("charge", forceManyBody().strength(settings.strength))
      .force("center", forceCenter(width / 2, height / 2))
      .force("link", forceLinkD3().links(links))
      .on("tick", () => {
        this.updateLinks()
        this.updateNodes()
      })
  }

  private updateLinks() {
    const {
      config: { forceData },
      elements: { svg },
    } = this
    const { links } = forceData
    const linksEls = svg
      .selectAll<SVGPathElement, ForceData<NodeData>["links"]>(
        `.${styles.linkCurved}`
      )
      .data(links)

    linksEls
      .enter()
      .append<SVGPathElement>("path")
      .merge(linksEls)
      .attr("d", (forceLink) => {
        const dx = forceLink.target.x - forceLink.source.x
        const dy = forceLink.target.y - forceLink.source.y
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.3

        return `M${forceLink.source.x},${forceLink.source.y}A${dr},${dr} 0 0,1 ${forceLink.target.x},${forceLink.target.y}`
      })
      .attr("class", styles.linkCurved)
      .attr("marker-end", "url(#end)")
      .attr("id", (...[, forceLinkIndex]) => `link-${forceLinkIndex}`)

    linksEls.exit().remove()
  }

  private updateNodes() {
    const {
      config: { forceData, getNodeText },
      elements: { svg },
    } = this
    const { nodes } = forceData
    const nodesEls = svg
      .selectAll<SVGCircleElement, ForceData<NodeData>["nodes"]>("circle")
      .data(nodes)
    const textsEls = svg
      .selectAll<SVGTextElement, ForceData<NodeData>["nodes"]>("text")
      .data(nodes)

    const dragstarted = (
      ...[dragEvent, forceNode]: [CustomDragEvent, Node<NodeData>]
    ) => {
      if (!dragEvent.active) {
        this.simulation.alphaTarget(0.3).restart()
      }

      forceNode.fx = forceNode.x
      forceNode.fy = forceNode.y
    }

    const dragged = (
      ...[dragEvent, forceNode]: [CustomDragEvent, Node<NodeData>]
    ) => {
      forceNode.fx = dragEvent.x
      forceNode.fy = dragEvent.y
    }

    const dragended = (
      ...[dragEvent, forceNode]: [CustomDragEvent, Node<NodeData>]
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
      .attr("cx", (forceNode) => forceNode.x)
      .attr("cy", (forceNode) => forceNode.y)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "black")
      .each(function setupMouseHandlers() {
        select<SVGCircleElement, ForceData<NodeData>["nodes"][0]>(this)
          .on("mouseover", (...[, forceNode]) => {
            select(`#node-text-${forceNode.index}`).style("opacity", 1)
          })
          .on("mouseleave", (...[, forceNode]) => {
            select(`#node-text-${forceNode.index}`).style(
              "opacity",
              settings.defaultTextOpacity
            )
          })
      })
      .call(
        drag<SVGCircleElement, ForceData<NodeData>["nodes"][0]>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text(getNodeText)
      .attr("x", (forceNode) => forceNode.x)
      .attr("y", (forceNode) => forceNode.y)
      .attr("dy", () => settings.textDY)
      .attr("id", (forceNode) => `node-text-${forceNode.index}`)
      .style("opacity", settings.defaultTextOpacity)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }
}

export { ChartConfig, ForceChart }
