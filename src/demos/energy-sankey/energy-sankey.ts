import {
  json,
  select,
  format as formatD3,
  scaleOrdinal,
  schemePastel2,
} from "d3"
import { sankey as sankeyD3, sankeyLinkHorizontal, sankeyLeft } from "d3-sankey"

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

const fetchData = () =>
  json(`${ROOT_PATH}data/d3js/energy-sankey/data.json`) as Promise<EnergyData>

const height = 1000
const defaultOpacity = 0.7

const renderChart = ({
  rootElId,
  data,
}: {
  rootElId: string
  data: EnergyData
}) => {
  const state = {
    isInTransition: false,
    linkSelected: false,
    selectedNode: "",
  }

  const el = document.getElementById(rootElId) as HTMLElement

  const format = (() => {
    const formatFn = formatD3(",.0f")

    return (d: any) => `${formatFn(d)} ${data.units}`
  })()
  const color = (() => {
    const colorFn = scaleOrdinal(schemePastel2)

    return (d: any) => colorFn(d.category === undefined ? d.name : d.category)
  })()

  const { width } = el.getBoundingClientRect()
  const svg = select(`#${rootElId}`)
    .append<SVGElement>("svg")
    .attr("height", height)
    .attr("width", width)

  const sankeyVal = sankeyD3()
    .nodeId((d: any) => d.name)
    .nodeAlign(sankeyLeft)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ])

  const { nodes, links } = sankeyVal({
    links: data.links.map((d: any) => Object.assign({}, d)),
    nodes: data.nodes.map((d: any) => Object.assign({}, d)),
  }) as any

  const node = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d: any) => d.x0)
    .attr("y", (d: any) => d.y0)
    .attr("height", (d: any) => d.y1 - d.y0)
    .attr("width", (d: any) => d.x1 - d.x0)
    .attr("fill", color as any)
    .style("opacity", defaultOpacity)
    .style("cursor", "pointer")
    .on("mouseenter", function () {
      if (state.isInTransition) return
      select(this).style("opacity", 1)
    })
    .on("mouseleave", function () {
      if (state.isInTransition) return
      select(this).style("opacity", defaultOpacity)
    })
    .on("click", (_e, d: any) => {
      if (state.isInTransition) return

      if (state.selectedNode === d.name) {
        linkPath.attr("display", null).style("opacity", defaultOpacity)
        state.selectedNode = ""
      } else {
        state.isInTransition = true

        if (state.selectedNode) {
          linkPath
            .style("opacity", (l: any) =>
              [l.source.name, l.target.name].includes(state.selectedNode)
                ? defaultOpacity
                : 0
            )
            .attr("display", null)
        }

        requestAnimationFrame(() => {
          linkPath
            .transition()
            .duration(500)
            .style("opacity", (l: any) =>
              [l.source.name, l.target.name].includes(d.name)
                ? defaultOpacity
                : 0
            )
            .on("end", () => {
              state.isInTransition = false
              linkPath.attr("display", (l: any) =>
                [l.source.name, l.target.name].includes(d.name) ? null : "none"
              )
            })

          state.selectedNode = d.name
        })
      }
    })

  node
    .append("title")
    .text((d: any) =>
      [d.category === d.name ? "" : d.category, d.name, format(d.value)]
        .filter(Boolean)
        .join("\n")
    )

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links as any)
    .join("g")
    .style("mix-blend-mode", "multiply")

  const linkPath = link
    .append("path")
    .attr("d", sankeyLinkHorizontal() as any)
    .style("opacity", defaultOpacity)
    .attr("stroke", "#aaa")
    .attr("stroke-width", (d: any) => Math.max(1, d.width))
    .on("mouseenter", function () {
      if (state.isInTransition) return
      select(this).style("opacity", 1)
    })
    .on("mouseleave", function () {
      if (state.isInTransition) return
      select(this).style("opacity", defaultOpacity)
    })
    .on("click", function () {
      if (state.isInTransition) return

      const currentLink = select(this)

      if (state.linkSelected) {
        linkPath.attr("display", null)
      } else {
        linkPath.attr("display", "none")
        currentLink.attr("display", null)
      }

      state.selectedNode = ""
      state.linkSelected = !state.linkSelected
    })

  link
    .append("title")
    .text((d: any) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`)

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d: any) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d: any) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d: any) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d: any) => d.name)
}

const main = async () => {
  const data = await fetchData()

  renderChart({
    data,
    rootElId: "chart",
  })
}

export default main
