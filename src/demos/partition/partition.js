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

  const dataHierarchy = d3.hierarchy(root).sum((d) => d.size)

  d3.partition().size([2 * Math.PI, radius])(dataHierarchy)

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1)

  const path = svg
    .selectAll("path")
    .data(dataHierarchy.descendants())
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
    .data(dataHierarchy.descendants())
    .enter()
    .append("text")
    .text((d) => {
      const dx = Math.abs(d.x0 - d.x1)

      if (dx > 0.07 && d.parent && d.data.name.length < 10) {
        return d.data.name
      }

      return ""
    })
    .attr("data-index", (_d, i) => i)
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .style("font", "bold 12px Arial")
    .attr("transform", (d) => {
      if (!d.depth) {
        return null
      }

      const centroid = arc.centroid(d)
      let rotationDeg = 90 + ((d.x0 + (d.x1 - d.x0) / 2) * 180) / Math.PI

      if (rotationDeg > 90 && rotationDeg < 270) {
        rotationDeg -= 180
      }

      return `rotate(${rotationDeg},${centroid[0]},${centroid[1]}) translate(${centroid[0]},${centroid[1]})`
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
