const main = () => {
  let path = ""
  let countries = ""

  const width = $("#chart").innerWidth()
  const height = 500
  const color = d3.scale.category20()

  const classFn = function (d) {
    return `country ${d.id}`
  }

  const colorFn = function (d) {
    return color(d.id)
  }

  const mouseoverFn = function () {
    return d3.select(this).style({
      stroke: "black",
      "stroke-width": "1px",
    })
  }

  const mouseoutFn = function () {
    return d3.select(this).style({
      stroke: "white",
      "stroke-width": ".2px",
    })
  }

  const setZoom = function (d) {
    if (!d) {
      return countries
        .transition()
        .duration(3500)
        .attr(
          "transform",
          `translate(${width / 2},${height / 2})scale(${1})translate(${
            -width / 2
          },${-height / 2})`
        )
    }

    const centroid = path.centroid(d)
    const x = centroid[0]
    const y = centroid[1]

    return countries
      .transition()
      .duration(3500)
      .attr(
        "transform",
        `translate(${width / 2},${height / 2})scale(${8})translate(${-x},${-y})`
      )
  }

  let svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .append("rect")
    .attr({
      class: "background",
      height,
      width,
    })
    .on("click", setZoom)
    .style({
      fill: "#DAEDFF",
    })
  svg = svg.append("g")

  return d3.json("/data/d3js/world-map/world.json", (_error, world) => {
    const projection = d3.geo
      .mercator()
      .center([0, 45.4])
      .scale(150)
      .translate([width / 2, height / 2])

    path = d3.geo.path().projection(projection)

    const data = topojson.feature(world, world.objects.countries).features

    countries = svg
      .selectAll(".country")
      .data(data)
      .enter()
      .append("path")
      .attr({
        class: classFn,
        d: path,
      })
      .style({
        fill: colorFn,
        stroke: "#FFF",
        "stroke-width": 0.2,
      })

    countries.on("mouseover", mouseoverFn)
    countries.on("mouseout", mouseoutFn)
    countries.on("click", setZoom)
  })
}

export default main
