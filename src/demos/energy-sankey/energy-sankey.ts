import anime from "animejs"
import chroma from "chroma-js"
import {
  Selection,
  format as formatD3,
  json,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"
import {
  SankeyLink,
  SankeyNode,
  sankey as sankeyD3,
  sankeyLeft,
  sankeyLinkHorizontal,
} from "d3-sankey"
import hotkeys from "hotkeys-js"
import qs from "query-string"

import * as styles from "./energy-sankey.module.css"

type EnergyDataLink = {
  source: string
  target: string
  value: number
}

type EnergyDataNode = {
  category: string
  name: string
}

type EnergyData = {
  links: EnergyDataLink[]
  nodes: EnergyDataNode[]
  units: string
}

type EnergySankeyNode = SankeyNode<EnergyDataNode, EnergyDataLink>
type EnergySankeyLink = SankeyLink<EnergyDataNode, EnergyDataLink>

type State = {
  isInTransition: boolean
  linkSelected: boolean
  selectedNode: string
}

type AddedGradients = { [k: string]: true }

type ShouldPreventDefault = boolean
type OnNodeClick = (node: EnergySankeyNode) => ShouldPreventDefault

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

const fetchData = () =>
  json(`${ROOT_PATH}data/d3js/energy-sankey/data.json`) as Promise<EnergyData>

const sankeyHeight = 1000
const legendHeight = 0
const svgHeight = sankeyHeight + legendHeight

const renderChart = ({
  data,
  onNodeClick,
  rootElId,
}: {
  data: EnergyData
  onNodeClick?: OnNodeClick
  rootElId: string
}) => {
  const state: State = {
    isInTransition: false,
    linkSelected: false,
    selectedNode: "",
  }

  const el = document.getElementById(rootElId) as HTMLElement

  const format = (() => {
    const formatFn = formatD3(",.0f")

    return (d: number) => `${formatFn(d)} ${data.units}`
  })()
  const color = (() => {
    const colorFn = scaleOrdinal(schemePastel2)

    return (d: EnergyDataNode) => colorFn(d.name)
  })()

  const { width } = el.getBoundingClientRect()
  const svg = select(`#${rootElId}`)
    .append<SVGElement>("svg")
    .attr("height", svgHeight)
    .attr("width", width)

  const sankeyVal = sankeyD3<EnergyDataNode, EnergyDataLink>()
    .nodeId((d) => d.name)
    .nodeAlign(sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, sankeyHeight - 5],
    ])

  const { links, nodes } = sankeyVal({
    links: data.links.map((d: EnergyDataLink) => Object.assign({}, d)),
    nodes: data.nodes.map((d: EnergyDataNode) => Object.assign({}, d)),
  })

  const nodeG = svg.append("g").attr("stroke", "#000")

  let lastAnime = () => {}

  const node = nodeG
    .selectAll("rect")
    .data<EnergySankeyNode>(nodes)
    .join("rect")
    .attr("class", styles.energyNode)
    .attr("x", (d: EnergySankeyNode) => d.x0!)
    .attr("y", (d: EnergySankeyNode) => d.y0!)
    .attr("height", (d: EnergySankeyNode) => d.y1! - d.y0!)
    .attr("width", (d: EnergySankeyNode) => d.x1! - d.x0!)
    .attr("fill", color)
    .on("mouseenter", function () {
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
    .on("click", (_e: unknown, d: EnergySankeyNode) =>
      nodeClickHandler({
        d,
        linkPath,
        onNodeClick,
        state,
      })
    )

  node.attr("title", (d) =>
    [d.category === d.name ? "" : d.category, d.name, format(d.value!)]
      .filter(Boolean)
      .join("\n")
  )

  $(".energy-node").tooltip({
    track: true,
  })

  const link = svg
    .append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data<EnergySankeyLink>(links)
    .join("g")
    .attr("class", styles.energyLinkG)

  const linkPathGenerator = sankeyLinkHorizontal()
  const addedGradients: AddedGradients = {}

  const linkPath = link
    .append("path")
    .attr("d", (d: EnergySankeyLink) => {
      const isHorizontalLine = d.y0 === d.y1
      const result = linkPathGenerator(
        // this is necessary for the default gradientUnits (objectBoundingBox) to work
        // https://stackoverflow.com/a/34687362
        isHorizontalLine
          ? {
              ...d,
              y1: d.y1! + 0.1,
            }
          : d
      )

      return result
    })
    .attr("stroke", (d) => {
      const fromColor = color(d.source as EnergyDataNode)
      const toColor = color(d.target as EnergyDataNode)

      const id = createGradients(svg, fromColor, toColor, addedGradients)

      return `url(#${id})`
    })
    .attr("class", styles.energyLink)
    .attr("stroke-width", (d) => Math.max(1, d.width!))
    .on("click", function () {
      if (state.isInTransition) return

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

  link.attr(
    "title",
    (d) =>
      `${(d.source as EnergySankeyNode).name} → ${
        (d.target as EnergySankeyNode).name
      }\n${format(d.value)}`
  )

  $(".energy-link").tooltip({
    track: true,
  })

  nodeG.each(function (this) {
    const parentEl = this.parentNode as HTMLElement

    parentEl.appendChild(this)
  })

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
    .attr("y", (d) => (d.y1! + d.y0!) / 2)
    .attr("dy", "0.35em")
    .style("font-size", "16px")
    .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
    .text((d) => d.name)
}

const nodeClickHandler = ({
  d,
  linkPath,
  onNodeClick,
  state,
}: {
  d: EnergySankeyNode
  linkPath: Selection<SVGPathElement, EnergySankeyLink, SVGGElement, unknown>
  onNodeClick?: OnNodeClick
  state: State
}) => {
  if (state.isInTransition) return

  if (onNodeClick) {
    const shouldPreventDefault = onNodeClick(d)

    if (shouldPreventDefault) return
  }

  if (state.selectedNode === d.name) {
    linkPath.attr("display", null).style("opacity", null)
    state.selectedNode = ""
  } else {
    state.isInTransition = true

    if (state.selectedNode) {
      linkPath
        .style("opacity", (l) =>
          [
            (l.source as EnergySankeyNode).name,
            (l.target as EnergySankeyNode).name,
          ].includes(state.selectedNode)
            ? null
            : 0
        )
        .attr("display", null)
    }

    requestAnimationFrame(() => {
      linkPath
        .transition()
        .duration(500)
        .style("opacity", (l) =>
          [
            (l.source as EnergySankeyNode).name,
            (l.target as EnergySankeyNode).name,
          ].includes(d.name)
            ? null
            : 0
        )
        .on("end", () => {
          state.isInTransition = false
          linkPath.attr("display", (l) =>
            [
              (l.source as EnergySankeyNode).name,
              (l.target as EnergySankeyNode).name,
            ].includes(d.name)
              ? null
              : "none"
          )
        })

      state.selectedNode = d.name
    })
  }
}

const createGradients = (
  svg: Selection<SVGElement, unknown, HTMLElement, unknown>,
  fromColor: string,
  toColor: string,
  addedGradients: AddedGradients
): string => {
  const id = `link-gradient-${fromColor}-${toColor}`.replace(/#/g, "")

  if (id in addedGradients) {
    return id
  }

  const duration = getRandomInt(1, 3)
  const colorScale = chroma.scale([fromColor, toColor])

  const text = `
<linearGradient id="${id}">
  <stop offset="0%" stop-color="${fromColor}" />
  <stop offset="50%" stop-color="${colorScale(0.5)}">
    <animate attributeName="offset"
      values="${[5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 3, 4]
        .map((n) => `.${n}`)
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

const main = async () => {
  hotkeys("control", () => {})

  const data = await fetchData()

  renderChart({
    data,
    onNodeClick: (node) => {
      if (!hotkeys.isPressed("control")) {
        return false
      }

      window.open(
        `https://www.google.com/search?${qs.stringify({
          ie: "UTF-8",
          q: `Energy ${node.name}`,
        })}`
      )

      return true
    },
    rootElId: "chart",
  })
}

export default main
