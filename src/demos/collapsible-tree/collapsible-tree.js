import * as d3 from "d3"

const fetchData = async () => {
  const data = await d3.json(`${ROOT_PATH}data/d3js/collapsible-tree/data.json`)

  return data
}

const margin = {
  bottom: 20,
  left: 120,
  right: 120,
  top: 20,
}

const duration = 750
const height = 800 - margin.top - margin.bottom

const renderChart = ({ rootElId, rootData }) => {
  const root = d3.hierarchy(rootData)

  root.descendants().forEach((d, i) => {
    d.id = i
    d._children = d.children
    if (d.depth && d.data.name.length !== 7) d.children = null
  })

  const width =
    document.getElementById(rootElId).getBoundingClientRect().width -
    margin.right -
    margin.left

  root.x0 = height / 2
  root.y0 = 0

  const tree = d3.tree().nodeSize([20, 100])

  tree(root)

  const diagonal = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x)

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${height / 2})`)

  const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)

  const gNode = svg
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all")

  const update = function (source) {
    const nodes = root.descendants().reverse()
    const links = root.links()

    tree(root)

    let left = root
    let right = root

    root.eachBefore((node) => {
      if (node.x < left.x) left = node
      if (node.x > right.x) right = node
    })

    const transition = svg
      .transition()
      .duration(duration)
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      )
    const node = gNode.selectAll("g").data(nodes, (d) => d.id)

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", () => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (_event, d) => {
        d.children = d.children ? null : d._children

        update(d)
      })

    nodeEnter
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (d) => (d._children ? "#555" : "#999"))
      .attr("stroke-width", 10)

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d._children ? -6 : 6))
      .attr("text-anchor", (d) => (d._children ? "end" : "start"))
      .text((d) => (d.data ? d.data.name : d.name))
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white")

    node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)

    node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", () => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)

    const link = gLink.selectAll("path").data(links, (d) => d.target.id)

    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", () => {
        const o = { x: source.x0, y: source.y0 }

        return diagonal({ source: o, target: o })
      })

    link.merge(linkEnter).transition(transition).attr("d", diagonal)

    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", () => {
        const o = { x: source.x, y: source.y }

        return diagonal({ source: o, target: o })
      })

    root.eachBefore((d) => {
      d.x0 = d.x
      d.y0 = d.y
    })
  }

  update(root)
}

const main = async () => {
  const rootElId = "chart"

  const rootData = await fetchData()

  renderChart({
    rootData,
    rootElId,
  })
}

export default main
