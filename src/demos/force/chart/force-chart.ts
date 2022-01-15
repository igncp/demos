import {
  Selection,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  forceCenter,
  forceCollide as forceCollideD3,
  forceLink as forceLinkD3,
  forceManyBody,
  forceSimulation,
  select,
} from "d3"

import * as styles from "../force.module.css"

import { BackgroundDrag, CustomDragEvent, NodeDrag } from "./force-drag"

const settings = {
  defaultTextOpacity: 0.5,
  strength: -40,
  textDY: 5,
}

const getNodeId = (node: SimulationNodeDatum) => `node-text-${node.index!}`

type ChartConfig<NodeData, LinkData> = {
  forceData: { links: LinkData[]; nodes: NodeData[] }
  getNodeText: (node: NodeData) => string
  height: number
  radius?: number
  rootElId: string
}

type ChartElements = {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgDrag: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
}

class ForceChart<NodeData, LinkData extends SimulationLinkDatum<NodeData>> {
  public static defaultRadius = 5

  private readonly backgroundDrag: BackgroundDrag<SVGSVGElement, SVGGElement>
  private readonly config: ChartConfig<NodeData, LinkData>
  private readonly elements: ChartElements
  private readonly simulation: Simulation<NodeData, undefined>
  private state: {
    radius: number
  }

  private readonly forceNodes: Array<NodeData & SimulationNodeDatum>
  private readonly forceLinks: Array<
    SimulationLinkDatum<NodeData & SimulationNodeDatum>
  >

  public constructor(config: ChartConfig<NodeData, LinkData>) {
    this.config = config
    this.state = {
      radius: config.radius ?? ForceChart.defaultRadius,
    }

    const { forceData, rootElId } = config
    const { links, nodes } = forceData

    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.forceChart)

    const svg = select(`#${rootElId}`).append("svg")
    const svgDrag = svg.append("g")
    const svgG = svgDrag.append("g")

    this.elements = { svg, svgDrag, svgG }

    this.backgroundDrag = new BackgroundDrag({
      svg,
      svgDrag,
    })

    const forceLink = forceLinkD3<NodeData, LinkData>().links(
      links.map((link) => ({ ...link }))
    )
    const forceCollide = forceCollideD3(12).strength(1).iterations(100)

    const simulation = forceSimulation<NodeData>(
      nodes.map((node) => ({ ...node }))
    )
      .force("link", forceLink)
      .force("collide", forceCollide)
      .on("tick", () => {
        this.render()
      })

    this.simulation = simulation
    this.forceNodes = this.simulation.nodes()
    this.forceLinks = forceLink.links()

    this.backgroundDrag.setupBackgroundDrag()

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  public setRadius(radius: number) {
    this.state.radius = radius
    this.getNodes().attr("r", radius)
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
      elements: { svgG },
    } = this
    const linksEls = svgG
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
      elements: { svgG },
      forceNodes,
    } = this

    const nodesEls = this.getNodes().data(forceNodes)

    const textsEls = svgG
      .selectAll<SVGTextElement, ForceNode>("text")
      .data(forceNodes)

    type DragOpts = {
      dragEvent: CustomDragEvent
      node: ForceNode
    }

    const onDrag = ({ dragEvent, node }: DragOpts) => {
      node.fx = dragEvent.x
      node.fy = dragEvent.y
    }

    const onDragEnded = ({ dragEvent, node }: DragOpts) => {
      if (!dragEvent.active) {
        this.simulation.alphaTarget(0)
      }

      node.fx = null
      node.fy = null
    }

    const onDragStart = ({ dragEvent, node }: DragOpts) => {
      if (!dragEvent.active) {
        this.simulation.alphaTarget(0.3).restart()
      }

      node.fx = node.x
      node.fy = node.y
    }

    const addInteraction = <SVGType extends SVGCircleElement | SVGTextElement>(
      selection: Selection<SVGType, ForceNode, SVGGElement, unknown>
    ) => {
      const nodeDrag = new NodeDrag<ForceNode, SVGType>({
        onDrag,
        onDragEnded,
        onDragStart,
      })

      selection
        .on("mouseenter", (...[, forceNode]) => {
          select(`#${getNodeId(forceNode)}`)
            .style("opacity", 1)
            .style("fill", "#000")
        })!
        .on("mouseleave", (...[, forceNode]) => {
          select(`#${getNodeId(forceNode)}`)
            .style("opacity", settings.defaultTextOpacity)
            .style("fill", null)
        })
        .call(nodeDrag.setupNodes)
        .style("cursor", "pointer")
    }

    nodesEls
      .enter()
      .append("circle")
      .merge(nodesEls)
      .attr("cx", (forceNode) => forceNode.x!)
      .attr("cy", (forceNode) => forceNode.y!)
      .attr("r", () => this.state.radius)
      .attr("fill", "black")
      .call(addInteraction)

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
      .call(addInteraction)

    nodesEls.exit().remove()
    textsEls.exit().remove()
  }

  private getNodes() {
    type ForceNode = NodeData & SimulationNodeDatum

    return this.elements.svgG.selectAll<SVGCircleElement, ForceNode>("circle")
  }
}

export { ChartConfig, ForceChart }
