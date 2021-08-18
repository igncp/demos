import * as d3 from "d3"

import * as styles from "./force.module.css"

type Node = {
  fx: number | null
  fy: number | null
  index: number
  name: string
  x: number
  y: number
}

type Data = {
  links: Array<{
    index: number
    name: string
    source: Node
    target: Node
  }>
  nodes: Node[]
}

type CustomDragEvent = DragEvent & { active: boolean }

const fetchData = async (): Promise<Data> => {
  const [nodes, links] = await Promise.all([
    d3.json(`${ROOT_PATH}data/d3js/force/nodes.json`),
    d3.json(`${ROOT_PATH}data/d3js/force/links.json`),
  ])

  return {
    links,
    nodes,
  } as Data
}

const settings = {
  circleRadius: 5,
  defaultTextOpacity: 0.5,
  strength: -40,
  textDY: 5,
}

const height = 600

type RenderGraph = (o: { data: Data; rootElId: string }) => void

const renderGraph: RenderGraph = ({ data, rootElId }) => {
  const { links, nodes } = data

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.forceChart)

  const { width } = rootEl.getBoundingClientRect()

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const ticked = () => {
    /* eslint-disable @typescript-eslint/no-use-before-define */
    updateLinks()
    updateNodes()
    /* eslint-enable @typescript-eslint/no-use-before-define */
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(settings.strength))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink().links(links))
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

  const updateLinks = () => {
    const linksEls = svg
      .selectAll<SVGPathElement, Data["links"]>(`.${styles.linkCurved}`)
      .data(links)

    linksEls
      .enter()
      .append<SVGPathElement>("path")
      .merge(linksEls)
      .attr("d", (d) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.3

        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })
      .attr("class", styles.linkCurved)

    linksEls.exit().remove()
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
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", () => settings.circleRadius)
      .attr("fill", "black")
      .each(function () {
        d3.select<SVGCircleElement, Data["nodes"][0]>(this)
          .on("mouseover", (_ev, d) => {
            d3.select(`#node-text-${d.index}`).style("opacity", 1)
          })
          .on("mouseleave", (_ev, d) => {
            d3.select(`#node-text-${d.index}`).style(
              "opacity",
              settings.defaultTextOpacity
            )
          })
      })
      .call(
        d3
          .drag<SVGCircleElement, Data["nodes"][0]>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    textsEls
      .enter()
      .append("text")
      .merge(textsEls)
      .text((d) => d.name)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", () => settings.textDY)
      .attr("id", (d) => `node-text-${d.index}`)
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
    .attr("id", (_d, i) => `link-${i}`)
}

const main = async () => {
  const data = await fetchData()

  renderGraph({
    data,
    rootElId: "chart",
  })
}

export default main
