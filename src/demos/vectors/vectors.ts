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

type Data = {
  links: Link[]
  nodes: Node[]
}

const getInitialData = (): Data => {
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

type RenderGraph = (o: { data: Data; rootElId: string }) => void

const renderGraph: RenderGraph = ({ data, rootElId }) => {
  const { links, nodes } = data

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
      .selectAll<SVGPathElement, Data["links"]>(`.${styles.link}`)
      .data(links)

    linksEls
      .enter()
      .append<SVGPathElement>("path")
      .merge(linksEls)
      .attr("d", (d) => {
        const deltaX = d.target.x! - d.source.x!
        const deltaY = d.target.y! - d.source.y!
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const normX = deltaX / dist
        const normY = deltaY / dist
        const sourcePadding = d.left ? 17 : 12
        const targetPadding = d.right ? 17 : 12
        const sourceX = d.source.x! + sourcePadding * normX
        const sourceY = d.source.y! + sourcePadding * normY
        const targetX = d.target.x! - targetPadding * normX
        const targetY = d.target.y! - targetPadding * normY

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

  const dragstarted = (event: CustomDragEvent, d: Node) => {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  const dragged = (event: CustomDragEvent, d: Node) => {
    d.fx = event.x
    d.fy = event.y
  }

  const dragended = (event: CustomDragEvent, d: Node) => {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  const updateNodes = () => {
    const nodesEls = svg
      .selectAll<SVGCircleElement, Data["nodes"]>("circle")
      .data(nodes)
    const textsEls = svg
      .selectAll<SVGTextElement, Data["nodes"]>("text")
      .data(nodes)

    nodesEls
      .enter()
      .append("circle")
      .merge(nodesEls)
      .attr("cx", (d) => d.x!)
      .attr("cy", (d) => d.y!)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "#fff")
      .each(function () {
        select<SVGCircleElement, Data["nodes"][0]>(this)
          .on("mouseover", (_ev, d) => {
            select(`#node-text-${d.index}`).style("opacity", 1)
          })
          .on("mouseleave", (_ev, d) => {
            select(`#node-text-${d.index}`).style(
              "opacity",
              settings.defaultTextOpacity
            )
          })
      })
      .call(
        drag<SVGCircleElement, Data["nodes"][0]>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text((d) => d.id)
      .attr("x", (d) => d.x!)
      .attr("y", (d) => d.y!)
      .attr("class", styles.id)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }

  let mousedownLink: any = null
  let mousedownNode: any = null
  let mouseupNode: any = null

  const resetMouseVars = () => {
    mousedownNode = null
    mouseupNode = null
    mousedownLink = null
  }

  svg
    .selectAll(`.${styles.link}`)
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", styles.link)
    .attr("marker-end", "url(#end)")
    .attr("id", (_d, i) => `link-${i}`)

  const keydown = function () {
    console.log("keydown") // eslint-disable-line no-console
  }

  const keyup = function () {
    console.log("keyup") // eslint-disable-line no-console
  }

  const mousedownSVG = (evt: any) => {
    svg.classed(styles.active, true)

    if (evt.ctrlKey || mousedownNode || mousedownLink) {
      return
    }

    const { target: e } = evt

    const dim = e.getBoundingClientRect()
    const x = evt.clientX - dim.left
    const y = evt.clientY - dim.top

    const node = {
      id: String.fromCharCode(++lastNodeId),
      index: nodes.length,
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

  const mouseupSVG = () => {
    console.log("mouseupSVG", mouseupNode) // eslint-disable-line no-console
    resetMouseVars()
  }

  svg
    .on("mousedown", mousedownSVG)
    .on("mousemove", mousemoveSVG)
    .on("mouseup", mouseupSVG)

  window.addEventListener("keyup", keyup)
  window.addEventListener("keydown", keydown)
}

const main = () => {
  const data = getInitialData()

  renderGraph({
    data,
    rootElId: "chart",
  })

  return Promise.resolve()
}

export default main
