import {
  Selection,
  SimulationNodeDatum,
  drag,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
} from "d3"

import * as styles from "./vectors.module.css"

const CONTAINER_ID = "chart"

// missing:
// - connect nodes
// - drag node
// - keys handling
// old one is in ./vectors-old/vectors-old.js, remove when completed

type Node = SimulationNodeDatum & {
  id: string
  reflexive: boolean
}

type Link = {
  left: boolean
  right: boolean
  source: Node
  target: Node
}

type VectorsData = {
  links: Link[]
  nodes: Node[]
}

const getInitialData = (): VectorsData => {
  const nodes = [
    {
      id: "A",
      reflexive: false,
    },
    {
      id: "B",
      reflexive: false,
    },
    {
      id: "C",
      reflexive: false,
    },
  ]
  const links = [
    {
      left: false,
      right: true,
      source: nodes[0],
      target: nodes[1],
    },
    {
      left: false,
      right: true,
      source: nodes[1],
      target: nodes[2],
    },
  ]

  return {
    links,
    nodes,
  }
}

const setupSVG = (
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
) => {
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 6)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000")

  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "start-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 4)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M10,-5L0,0L10,5")
    .attr("fill", "#000")
}

type CustomDragEvent = DragEvent & { active: boolean }

const settings = {
  circleRadius: 5,
  defaultTextOpacity: 0.5,
  strength: -5000,
  textDY: 5,
}

const height = 600

type RenderGraph = (o: { rootElId: string; vectorsData: VectorsData }) => void

const renderGraph: RenderGraph = ({ rootElId, vectorsData }) => {
  const { links, nodes } = vectorsData

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.vectorsChart)

  const { width } = rootEl.getBoundingClientRect()
  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  setupSVG(svg)

  // @TODO
  let lastNodeId = "C".charCodeAt(0)

  const updateLinks = () => {
    const linksEls = svg
      .selectAll<SVGPathElement, VectorsData["links"]>(`.${styles.link}`)
      .data(links)

    linksEls
      .enter()
      .append<SVGPathElement>("path")
      .merge(linksEls)
      .attr("d", (link) => {
        const deltaX = link.target.x! - link.source.x!
        const deltaY = link.target.y! - link.source.y!
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const normX = deltaX / dist
        const normY = deltaY / dist
        const sourcePadding = link.left ? 17 : 12
        const targetPadding = link.right ? 17 : 12
        const sourceX = link.source.x! + sourcePadding * normX
        const sourceY = link.source.y! + sourcePadding * normY
        const targetX = link.target.x! - targetPadding * normX
        const targetY = link.target.y! - targetPadding * normY

        return `M${sourceX},${sourceY}L${targetX},${targetY}`
      })
      .attr("class", `${styles.link} ${styles.dragline}`)

    linksEls.exit().remove()
  }

  const ticked = () => {
    updateLinks()
    updateNodes() // eslint-disable-line @typescript-eslint/no-use-before-define
  }

  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-50))
    .force("center", forceCenter(width / 2, height / 2))
    .force("link", forceLink().links(links).distance(100))
    .on("tick", ticked)

  const dragstarted = (...[dragEvent, node]: [CustomDragEvent, Node]) => {
    if (!dragEvent.active) {
      simulation.alphaTarget(0.3).restart()
    }

    node.fx = node.x
    node.fy = node.y
  }

  const dragged = (...[dragEvent, node]: [CustomDragEvent, Node]) => {
    node.fx = dragEvent.x
    node.fy = dragEvent.y
  }

  const dragended = (...[dragEvent, node]: [CustomDragEvent, Node]) => {
    if (!dragEvent.active) {
      simulation.alphaTarget(0)
    }

    node.fx = null
    node.fy = null
  }

  const updateNodes = () => {
    const nodesEls = svg
      .selectAll<SVGCircleElement, VectorsData["nodes"]>("circle")
      .data(nodes)
    const textsEls = svg
      .selectAll<SVGTextElement, VectorsData["nodes"]>("text")
      .data(nodes)

    nodesEls
      .enter()
      .append("circle")
      .merge(nodesEls)
      .attr("cx", (node) => node.x!)
      .attr("cy", (node) => node.y!)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "#fff")
      .each(function () {
        select<SVGCircleElement, VectorsData["nodes"][0]>(this)
          .on("mouseover", (...[, node]: [unknown, Node]) => {
            select(`#node-text-${node.index}`).style("opacity", 1)
          })
          .on("mouseleave", (...[, node]: [unknown, Node]) => {
            select(`#node-text-${node.index}`).style(
              "opacity",
              settings.defaultTextOpacity
            )
          })
      })
      .call(
        drag<SVGCircleElement, VectorsData["nodes"][0]>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text((node) => node.id)
      .attr("x", (node) => node.x!)
      .attr("y", (node) => node.y!)
      .attr("class", styles.id)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }

  svg
    .selectAll(`.${styles.link}`)
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", styles.link)
    .attr("marker-end", "url(#end)")
    .attr("id", (...[, linkIndex]: [unknown, number]) => `link-${linkIndex}`)

  const keydown = function () {
    console.log("keydown") // eslint-disable-line no-console
  }

  const keyup = function () {
    console.log("keyup") // eslint-disable-line no-console
  }

  const mousedownSVG = (mouseEvent: MouseEvent) => {
    svg.classed(styles.active, true)

    if (mouseEvent.ctrlKey) {
      return
    }

    const eventTarget = mouseEvent.target as HTMLElement

    const dim = eventTarget.getBoundingClientRect()
    const x = mouseEvent.clientX - dim.left
    const y = mouseEvent.clientY - dim.top

    lastNodeId += 1

    const node = {
      id: String.fromCharCode(lastNodeId),
      index: nodes.length, // eslint-disable-line id-denylist
      reflexive: false,
      vx: 0,
      vy: 0,
      x,
      y,
    }

    nodes.push(node)

    simulation.nodes(nodes)
    simulation.alpha(0.5).restart()
  }

  const mousemoveSVG = () => {
    console.log("mousemoveSVG") // eslint-disable-line no-console
  }

  const mouseupSVG = () => {}

  svg
    .on("mousedown", mousedownSVG)
    .on("mousemove", mousemoveSVG)
    .on("mouseup", mouseupSVG)

  window.addEventListener("keyup", keyup)
  window.addEventListener("keydown", keydown)
}

const main = () => {
  const vectorsData = getInitialData()

  renderGraph({
    rootElId: CONTAINER_ID,
    vectorsData,
  })

  return Promise.resolve()
}

export { CONTAINER_ID }

export default main
