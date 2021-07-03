const main = () => {
  const margin = {
    bottom: 20,
    left: 120,
    right: 120,
    top: 20,
  }
  const width = $("#chart").innerWidth() - margin.right - margin.left
  const height = 800 - margin.top - margin.bottom

  let root = null
  let i = 0

  const duration = 750
  const tree = d3.layout.tree().size([height, width])

  const diagonal = d3.svg.diagonal().projection((d) => [d.y, d.x])
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  const click = function (d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }

    update(d)
  }

  const update = function (source) {
    const nodes = tree.nodes(root).reverse()
    const links = tree.links(nodes)

    nodes.forEach((d) => {
      d.y = d.depth * 180
    })

    const node = svg.selectAll("g.node").data(nodes, (d) => {
      if (!d.id) {
        d.id = ++i
      }

      return d.id
    })
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", () => `translate(${source.y0},${source.x0})`)
      .on("click", click)

    nodeEnter
      .append("circle")
      .attr("r", 1e-6)
      .style("fill", (d) => {
        if (d._children) {
          return "lightsteelblue"
        }

        return "#fff"
      })
    nodeEnter
      .append("text")
      .attr("x", (d) => {
        if (d.children || d._children) {
          return -10
        }

        return 10
      })
      .attr("dy", ".35em")
      .attr("text-anchor", (d) => {
        if (d.children || d._children) {
          return "end"
        }

        return "start"
      })
      .text((d) => d.name)
      .style("fill-opacity", 1e-6)

    const nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${d.y},${d.x})`)

    nodeUpdate
      .select("circle")
      .attr("r", 4.5)
      .style("fill", (d) => {
        if (d._children) {
          return "lightsteelblue"
        }

        return "#fff"
      })
    nodeUpdate.select("text").style("fill-opacity", 1)

    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", () => `translate(${source.y},${source.x})`)
      .remove()

    nodeExit.select("circle").attr("r", 1e-6)
    nodeExit.select("text").style("fill-opacity", 1e-6)

    const link = svg.selectAll("path.link").data(links, (d) => d.target.id)

    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", () => {
        const o = {
          x: source.x0,
          y: source.y0,
        }

        return diagonal({
          source: o,
          target: o,
        })
      })
    link.transition().duration(duration).attr("d", diagonal)
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", () => {
        const o = {
          x: source.x,
          y: source.y,
        }

        return diagonal({
          source: o,
          target: o,
        })
      })
      .remove()

    nodes.forEach((d) => {
      d.x0 = d.x
      d.y0 = d.y
    })
  }

  d3.json(
    `${ROOT_PATH}data/d3js/collapsible-tree/data.json`,
    (_error, data) => {
      root = data
      root.x0 = height / 2
      root.y0 = 0

      const collapse = function (d) {
        if (d.children) {
          d._children = d.children
          d._children.forEach(collapse)
          d.children = null
        }
      }

      root.children.forEach(collapse)

      update(root)
    }
  )
}

export default main
