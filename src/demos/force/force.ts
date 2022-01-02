import {
  drag,
  forceCenter,
  forceLink as forceLinkD3,
  forceManyBody,
  forceSimulation,
  json,
  select,
} from "d3"

import * as styles from "./force.module.css"
import { CONTAINER_ID } from "./ui-constants"

type Node = {
  fx: number | null
  fy: number | null
  index: number // eslint-disable-line id-denylist
  name: string
  x: number
  y: number
}

type Link = {
  id: number
  name: string
  source: Node
  target: Node
}

type ForceData = {
  links: Link[]
  nodes: Node[]
}

type CustomDragEvent = DragEvent & { active: boolean }

const fetchForceData = async (): Promise<ForceData> => {
  const [nodes, links] = await Promise.all([
    json(`${ROOT_PATH}data/d3js/force/nodes.json`),
    json(`${ROOT_PATH}data/d3js/force/links.json`),
  ])

  return {
    links,
    nodes,
  } as ForceData
}

const settings = {
  circleRadius: 5,
  defaultTextOpacity: 0.5,
  strength: -40,
  textDY: 5,
}

const height = 600

type RenderGraph = (chartConfig: {
  forceData: ForceData
  rootElId: string
}) => void

const renderGraph: RenderGraph = ({ forceData, rootElId }) => {
  const { links, nodes } = forceData

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.forceChart)

  const { width } = rootEl.getBoundingClientRect()

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const ticked = () => {
    /* eslint-disable @typescript-eslint/no-use-before-define */
    updateLinks()
    updateNodes()
    /* eslint-enable @typescript-eslint/no-use-before-define */
  }

  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(settings.strength))
    .force("center", forceCenter(width / 2, height / 2))
    .force("link", forceLinkD3().links(links))
    .on("tick", ticked)

  const dragstarted = (...[dragEvent, forceNode]: [CustomDragEvent, Node]) => {
    if (!dragEvent.active) {
      simulation.alphaTarget(0.3).restart()
    }

    forceNode.fx = forceNode.x
    forceNode.fy = forceNode.y
  }

  const dragged = (...[dragEvent, forceNode]: [CustomDragEvent, Node]) => {
    forceNode.fx = dragEvent.x
    forceNode.fy = dragEvent.y
  }

  const dragended = (...[dragEvent, forceNode]: [CustomDragEvent, Node]) => {
    if (!dragEvent.active) {
      simulation.alphaTarget(0)
    }

    forceNode.fx = null
    forceNode.fy = null
  }

  const updateLinks = () => {
    const linksEls = svg
      .selectAll<SVGPathElement, ForceData["links"]>(`.${styles.linkCurved}`)
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

    linksEls.exit().remove()
  }

  const updateNodes = () => {
    const nodesEls = svg
      .selectAll<SVGCircleElement, ForceData["nodes"]>("circle")
      .data(nodes)
    const textsEls = svg
      .selectAll<SVGTextElement, ForceData["nodes"]>("text")
      .data(nodes)

    nodesEls
      .enter()
      .append("circle")
      .merge(nodesEls)
      .attr("cx", (forceNode) => forceNode.x)
      .attr("cy", (forceNode) => forceNode.y)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "black")
      .each(function setupMouseHandlers() {
        select<SVGCircleElement, ForceData["nodes"][0]>(this)
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
        drag<SVGCircleElement, ForceData["nodes"][0]>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text((forceNode) => forceNode.name)
      .attr("x", (forceNode) => forceNode.x)
      .attr("y", (forceNode) => forceNode.y)
      .attr("dy", () => settings.textDY)
      .attr("id", (forceNode) => `node-text-${forceNode.index}`)
      .style("opacity", settings.defaultTextOpacity)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }

  svg
    .selectAll(`.${styles.linkCurved}`)
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", styles.linkCurved)
    .attr("marker-end", "url(#end)")
    .attr("id", (...[, forceLinkIndex]) => `link-${forceLinkIndex}`)
}

const main = async () => {
  const forceData = await fetchForceData()

  renderGraph({
    forceData,
    rootElId: CONTAINER_ID,
  })
}

export { CONTAINER_ID }

export default main
