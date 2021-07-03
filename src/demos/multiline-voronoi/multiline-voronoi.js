const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const margin = {
  bottom: 70,
  left: 80,
  right: 70,
  top: 60,
}

const addFilter = (svg) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", "drop-shadow")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1)

  filter.append("feOffset").attr("dx", 1).attr("dy", 1)
  filter.append("feComponentTransfer").append("feFuncA").attr({
    slope: "1",
    type: "linear",
  })

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const main = async () => {
  const color = d3.scale.category20()
  const months = []

  const monthFormat = d3.time.format("%Y-%m")
  let clickToggle = false

  const width = $("#chart").innerWidth() - margin.left - margin.right

  const height = 500 - margin.top - margin.bottom

  const x = d3.time.scale().range([0, width])
  const y = d3.scale.linear().range([height, 0])

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  const chartType = function (d, index) {
    if (!index) {
      Object.keys(d)
        .map(monthFormat.parse)
        .filter(Number)
        .forEach((value) => months.push(value))
    }

    const city = {
      name: d.name.replace(/(msa|necta div|met necta|met div)$/i, ""),
      values: null,
    }

    city.values = months.map((m) => ({
      city,
      date: m,
      value: d[monthFormat(m)] / 100,
    }))

    return city
  }

  const cities = await new Promise((resolve) => {
    d3.tsv(
      "/data/d3js/multiline-voronoi/data.tsv",
      chartType,
      (_error, citiesResp) => {
        resolve(citiesResp)
      }
    )
  })

  x.domain(d3.extent(months))
  y.domain([0, d3.max(cities, (c) => d3.max(c.values, (d) => d.value))]).nice()

  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.svg.axis().scale(x).orient("bottom"))

  svg
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.svg.axis().scale(y).orient("left").ticks(10, "%"))
    .append("text")
    .attr("x", 20)
    .attr("dy", ".32em")
    .style("font-weight", "bold")
    .text("US Unemployment Rate")

  addFilter(svg)

  const line = d3.svg
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))

  const generateVoronoi = function (data) {
    const mouseover = (d) => {
      d3.select(d.city.line).classed("city--hover", true)
      d.city.line.parentNode.appendChild(d.city.line)
      focus.attr("transform", `translate(${x(d.date)},${y(d.value)})`)
      focus.select(".text1").text(`${d.city.name.trim()}: `)

      const date = `${monthNames[d.date.getMonth()]} of ${d.date.getFullYear()}`

      return focus
        .select(".text2")
        .text(` ${String((d.value * 100).toFixed(2))}% - ${date}`)
    }

    const mouseout = function (d) {
      d3.select(d.city.line).classed("city--hover", false)

      return focus.attr("transform", "translate(-100,-100)")
    }

    const clicked = function (d) {
      clickToggle = !clickToggle
      d3.selectAll(".cities").remove()
      d3.selectAll(".voronoi").remove()

      if (clickToggle) {
        generateLines([d.city])

        return
      }

      generateLines(cities)

      return
    }

    const focus = svg
      .append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus")

    focus.append("circle").attr("r", 3.5)
    focus.append("text").attr("class", "text1").attr("y", -30)
    focus.append("text").attr("class", "text2").attr("y", -10)

    const voronoi = d3.geom
      .voronoi()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .clipExtent([
        [-margin.left, -margin.top],
        [width + margin.right, height + margin.bottom],
      ])

    const voronoiGroup = svg.append("g").attr("class", "voronoi")

    voronoiGroup
      .selectAll("path")
      .data(
        voronoi(
          d3
            .nest()
            .key((d) => `${x(d.date)},${y(d.value)}`)
            .rollup((v) => v[0])
            .entries(d3.merge(data.map((d) => d.values)))
            .map((d) => d.values)
        )
      )
      .enter()
      .append("path")
      .attr("d", (d) => `M${d.join("L")}Z`)
      .datum((d) => d.point)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", clicked)

    d3.select("#show-voronoi")
      .property("disabled", false)
      .on("change", function () {
        return voronoiGroup.classed("voronoi--show", this.checked)
      })
  }

  const generateLines = function (data) {
    svg
      .append("g")
      .attr("class", "cities")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", function (d) {
        d.line = this

        return line(d.values)
      })
      .style("stroke", (_d, i) => color(i))
      .style("filter", () => "url(#drop-shadow)")

    return generateVoronoi(data)
  }

  generateLines(cities)
}

export default main
