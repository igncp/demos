const fetchData = async () => {
  const [nodes, links] = await Promise.all([
    new Promise((resolve) => {
      d3.json(`${ROOT_PATH}data/d3js/force/nodes.json`, (_error, root) => {
        resolve(root)
      })
    }),
    new Promise((resolve) => {
      d3.json(`${ROOT_PATH}data/d3js/force/links.json`, (_error, root) => {
        resolve(root)
      })
    }),
  ])

  return {
    links,
    nodes,
  }
}

const renderGraph = function ({ data, rootElId }) {
  let links = data.links.filter((el) => el.source !== el.target)

  const { nodes } = data
  const { width } = document.getElementById("chart").getBoundingClientRect()
  const height = 600

  const tick = function () {
    path.attr("d", (d) => {
      const dx = d.target.x - d.source.x
      const dy = d.target.y - d.source.y
      const dr = Math.sqrt(dx * dx + dy * dy)

      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
    })
    linkLabel
      .attr("x", (d) => {
        const deltaX = d.target.x - d.source.x

        if (d.source.y < d.target.y) {
          return d.source.x + deltaX * 0.3 + 15
        }

        return d.source.x + deltaX * 0.3 - 15
      })
      .attr("y", (d) => {
        const deltaY = d.target.y - d.source.y

        return d.source.y + deltaY * 0.3
      })
      .attr("text-anchor", (d) => {
        if (d.source.y < d.target.y) {
          return "beginning"
        }

        return "end"
      })

    return node.attr("transform", (d) => `translate(${d.x},${d.y})`)
  }

  const force = d3.layout
    .force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-400)
    .linkStrength((d) => d.strength)
    .on("tick", tick)
    .start()

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .append("svg:defs")
    .selectAll("marker")
    .data(["end"])
    .enter()
    .append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
  links = svg
    .selectAll(".link")
    .data(force.links())
    .enter()
    .append("g")
    .attr("class", "link")

  const path = links
    .append("svg:path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)")

  const linkLabel = links.append("text").text((d) => d.name)

  const node = svg
    .selectAll(".node")
    .data(force.nodes())
    .enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag)

  node.append("circle").attr("r", 5)

  return node
    .append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text((d) => d.name)
}

const main = async () => {
  const data = await fetchData()

  renderGraph({
    data,
    rootElId: "chart",
  })
}

export default main
