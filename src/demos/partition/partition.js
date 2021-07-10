import * as d3 from "d3"

const fetchData = () => d3.json(`${ROOT_PATH}data/d3js/partition/flare.json`)

// @TODO: add back the count option

const height = 700
const colorScale = d3.scaleOrdinal(d3.schemePastel2)

const renderChart = ({ root, rootElId }) => {
  const addTitles = (selectors) => {
    selectors.forEach((selector) =>
      selector.append("title").text((d) => `${d.data.name}\n${d.value}`)
    )
  }

  const { width } = document.getElementById("chart").getBoundingClientRect()
  const radius = Math.min(width, height) / 2

  const color = (d) =>
    d.children ? colorScale(d.data.name) : colorScale(d.parent.name)

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height * 0.52})`)

  const partitionLayout = d3.partition().size([2 * Math.PI, radius])

  const parsedSize = d3.hierarchy(root).sum((d) => d.size)

  partitionLayout(parsedSize)

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1)

  const path = svg
    .selectAll("path")
    .data(parsedSize.descendants())
    .enter()
    .append("path")
    .attr("display", (d) => (d.depth ? null : "none"))
    .attr("data-index", (_d, i) => i)
    .attr("d", arc)
    .style("stroke", "#000")
    .style("stroke-width", "1px")
    .style("fill", (d) => color(d))

  const texts = svg
    .selectAll("text")
    .data(parsedSize.descendants())
    .enter()
    .append("text")
    .text((d) => {
      const dx = Math.abs(d.x0 - d.x1)
      const dy = Math.abs(d.y0 - d.y1)

      if (dx > 0.1 && dy > 0.1 && d.parent) {
        return d.data.name
      }

      return ""
    })
    .attr("data-index", (_d, i) => i)
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .style("font", "bold 12px Arial")
    .attr("transform", (d) => {
      const centroid = arc.centroid(d)
      const rotation = 0

      return `rotate(${rotation},${centroid[0]},${centroid[1]}) translate(${centroid})`
    })
    .style("cursor", "default")

  ;[path, texts].forEach((set) =>
    set.on("mouseover", function () {
      const index = d3.select(this).attr("data-index")

      d3.select(`path[data-index="${index}"]`).style("fill", "#333")
      d3.select(`text[data-index="${index}"]`).style("fill", "white")
    })
  )
  ;[path, texts].forEach((set) =>
    set.on("mouseout", function () {
      const index = d3.select(this).attr("data-index")

      d3.select(`path[data-index="${index}"]`).style("fill", color)
      d3.select(`text[data-index="${index}"]`).style("fill", "#000")
    })
  )

  addTitles([path, texts])
}

const main = async () => {
  const root = await fetchData()

  renderChart({
    root,
    rootElId: "chart",
  })
}

export default main
