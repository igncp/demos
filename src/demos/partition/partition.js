const main = () => {
  const stash = function (d) {
    d.x0 = d.x
    d.dx0 = d.dx
  }

  const arcTween = function (a) {
    const i = d3.interpolate(
      {
        dx: a.dx0,
        x: a.x0,
      },
      a
    )

    return function (t) {
      const b = i(t)

      a.x0 = b.x
      a.dx0 = b.dx

      return arc(b)
    }
  }

  const addTitles = (selectors) => {
    selectors.forEach((selector) =>
      selector.append("title").text((d) => `${d.name}\n${d.value}`)
    )
  }

  const width = $("#chart").innerWidth()
  const height = 700
  const radius = Math.min(width, height) / 2
  const colorScale = d3.scale.category20c()

  const color = function (d) {
    if (d.children) {
      return colorScale(d.name)
    }

    return colorScale(d.parent.name)
  }

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height * 0.52})`)

  const partition = d3.layout
    .partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(() => 1)

  const arc = d3.svg
    .arc()
    .startAngle((d) => d.x)
    .endAngle((d) => d.x + d.dx)
    .innerRadius((d) => Math.sqrt(d.y))
    .outerRadius((d) => Math.sqrt(d.y + d.dy))

  d3.json(`${ROOT_PATH}data/d3js/partition/flare.json`, (_error, root) => {
    const arcs = svg.datum(root).selectAll("path").data(partition.nodes).enter()
    const path = arcs
      .append("path")
      .attr("display", (d) => {
        if (d.depth) {
          return null
        }

        return "none"
      })
      .attr("d", arc)
      .attr("data-index", (_d, i) => i)
      .style("fill", (d) => color(d))
      .style("fill-rule", "evenodd")
      .style("stroke", "#fff")
      .each(stash)

    const texts = arcs
      .append("text")
      .text((d) => {
        if (d.depth < 2 && d.dx > 0.1 && d.parent) {
          return d.name
        }

        return ""
      })
      .attr("data-index", (_d, i) => i)
      .attr("x", (d) => arc.centroid(d)[0] - 30)
      .attr("y", (d) => arc.centroid(d)[1])
      .style("cursor", "default")

    ;[path, texts].forEach((set) =>
      set.on("mouseover", function () {
        const index = d3.select(this).attr("data-index")

        d3.select(`path[data-index="${index}"]`).style("fill", "#CCC")

        return d3.select(`text[data-index="${index}"]`).style("fill", "#fff")
      })
    )
    ;[path, texts].forEach((set) =>
      set.on("mouseout", function () {
        const index = d3.select(this).attr("data-index")

        d3.select(`path[data-index="${index}"]`).style("fill", color)

        return d3.select(`text[data-index="${index}"]`).style("fill", "#000")
      })
    )
    addTitles([path, texts])

    d3.selectAll("input").on("change", function () {
      const value =
        this.value === "count"
          ? function () {
              return 1
            }
          : function (d) {
              return d.size
            }

      path
        .data(partition.value(value).nodes)
        .transition()
        .duration(1500)
        .attrTween("d", arcTween)
      addTitles([path, texts])

      return texts
        .data(partition.value(value).nodes)
        .transition()
        .duration(1500)
        .attr("x", (d) => arc.centroid(d)[0] - 10)
        .attr("y", (d) => arc.centroid(d)[1])
    })
  })
}

export default main
