const main = () => {
  const width = $("#chart").innerWidth()
  const height = 300
  const outerRadius = 100
  const color = d3.scale.category20()
  let arc = {}

  const stashArcs = (d) => {
    d.data.ea0 = _.cloneDeep(d)
  }

  const arcTween = (ar) => {
    const i = d3.interpolate(ar.data.ea0, ar)

    ar.data.ea0 = i(0)

    return (t) => arc(i(t))
  }

  const textTransform = function (d) {
    d.outerRadius = outerRadius
    d.innerRadius = outerRadius / 2

    return `translate(${arc.centroid(d)})`
  }

  return d3.json(`${ROOT_PATH}data/d3js/pie/data.json`, (_error, data) => {
    const pie = d3.layout
      .pie()
      .sort(null)
      .value((d) => d.val)

    arc = d3.svg.arc().outerRadius(outerRadius)

    const svg = d3
      .select("#chart")
      .append("svg:svg")
      .attr({
        height,
        width,
      })
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const slices = svg
      .selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice")

    const path = slices
      .append("path")
      .attr({
        d: arc,
        fill(_d, i) {
          return color(i)
        },
      })
      .each(stashArcs)

    const labels = slices
      .filter((d) => d.endAngle - d.startAngle > 0.2)
      .append("text")
      .attr({ dy: ".35em", "text-anchor": "middle" })
      .attr("transform", textTransform)
      .style({ fill: "White", font: "bold 12px Arial" })
      .text((d) => d.data.val)

    slices.append("title").text((d) => d.data.label)

    return d3.select("#change-data").on("click", () => {
      const index = Math.floor(Math.random() * 5)

      data[index].val = Math.floor(Math.random() * 44) + 2

      path.data(pie(data)).transition().duration(1000).attrTween("d", arcTween)

      return labels
        .data(pie(data))
        .transition()
        .duration(1000)
        .attr("transform", textTransform)
        .each("start", function (d) {
          return d3.select(this).text(d.data.val)
        })
    })
  })
}

export default main
