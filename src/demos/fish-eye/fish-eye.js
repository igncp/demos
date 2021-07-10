import d3utils from "@/demos/_utils/d3utils"

const ch = {
  rootElId: "chart",
}

ch.ready = function () {
  ch.setCg()
  ch.setDom()
  ch.setVars()

  return ch.getData(ch.render)
}

ch.render = function () {
  ch.setChartTitle()
  ch.setBackground()
  ch.setPointer()
  ch.setFilter()
  ch.setAxis()
  ch.setLabels()
  ch.setDots()
  ch.setTitles()
  ch.bindMousemove()
  ch.bindClick()
}

ch.setCg = function () {
  ch.cg = {
    margin: {
      bottom: 70,
      left: 70,
      right: 50,
      top: 80,
    },
  }
  ch.cg.height = 700 - ch.cg.margin.top - ch.cg.margin.bottom

  ch.cg.width =
    document.getElementById("chart").getBoundingClientRect().width -
    ch.cg.margin.left -
    ch.cg.margin.right
}

ch.setDom = function () {
  ch.dom = {
    svg: d3
      .select(`#${ch.rootElId}`)
      .append("svg")
      .attr("width", ch.cg.width + ch.cg.margin.left + ch.cg.margin.right)
      .attr("height", ch.cg.height + ch.cg.margin.top + ch.cg.margin.bottom)
      .append("g")
      .attr("transform", `translate(${ch.cg.margin.left},${ch.cg.margin.top})`),
  }
}

ch.getData = function (cb) {
  d3.json(`${ROOT_PATH}data/d3js/fish-eye/data.json`, (nations) => {
    ch.data = nations

    return cb()
  })
}

ch.setChartTitle = function () {
  return d3utils.middleTitle(
    ch.dom.svg,
    ch.cg.width,
    "Income Per Capita vs " +
      "Life Expectancy vs Population vs Region - 180 Countries",
    -40
  )
}

ch.setVars = function () {
  ch.vars = {
    colorScale: d3.scale
      .category10()
      .domain([
        "Sub-Saharan Africa",
        "South Asia",
        "Middle East & North Africa",
        "America",
        "Europe & Central Asia",
        "East Asia & Pacific",
      ]),
    focused: false,
    radiusScale: d3.scale.sqrt().domain([0, 5e8]).range([5, 60]),
    xScale: d3.fisheye
      .scale(d3.scale.log)
      .domain([300, 1e5])
      .range([0, ch.cg.width]),
    yScale: d3.fisheye
      .scale(d3.scale.linear)
      .domain([20, 90])
      .range([ch.cg.height, 0]),
  }
}

ch.setAxis = function () {
  ch.dom.xAxis = d3.svg
    .axis()
    .orient("bottom")
    .scale(ch.vars.xScale)
    .tickFormat(d3.format(",d"))
    .tickSize(-ch.cg.height)
  ch.dom.yAxis = d3.svg
    .axis()
    .scale(ch.vars.yScale)
    .orient("left")
    .tickSize(-ch.cg.width)
  ch.dom.svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${ch.cg.height})`)
    .call(ch.dom.xAxis)
  ch.dom.svg.append("g").attr("class", "y axis").call(ch.dom.yAxis)
}

ch.setBackground = function () {
  return ch.dom.svg
    .append("rect")
    .attr("class", "background")
    .attr("width", ch.cg.width)
    .attr("height", ch.cg.height)
}

ch.setLabels = function () {
  ch.dom.svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", ch.cg.width - 26)
    .attr("y", ch.cg.height + 26)
    .text("income per capita, inflation-adjusted (dollars)")

  ch.dom.svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -26)
    .attr("y", -40)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("life expectancy (years)")
}

ch.setFilter = function () {
  return d3utils.filterColor("circles", ch.dom.svg, 1.5, 0.6, true)
}

ch.position = function (dot) {
  dot
    .attr("cx", (d) => ch.vars.xScale(d.income))
    .attr("cy", (d) => ch.vars.yScale(d.lifeExpectancy))
    .attr("r", (d) => ch.vars.radiusScale(d.population))
}

ch.setDots = function () {
  ch.dom.dot = ch.dom.svg
    .append("g")
    .attr("class", "dots")
    .selectAll(".dot")
    .data(ch.data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .style("fill", (d) => ch.vars.colorScale(d.region))
    .style("filter", "url(#drop-shadow-circles)")
    .style("stroke", "black")
    .style('"stroke-width"', "1px")
    .call(ch.position)
    .sort((a, b) => b.population - a.population)
}

ch.setTitles = function () {
  ch.dom.dot
    .append("title")
    .text(
      (d) =>
        `${d.name}:\n- Income: ${ch.humanizeNumber(d.income)} $/P.C.\n` +
        `- Population: ${ch.humanizeNumber(d.population)}\n` +
        `- Life expectancy: ${d.lifeExpectancy} years`
    )
}

ch.zoom = function () {
  const mouse = d3.mouse(this)

  ch.vars.xScale.distortion(2.5).focus(mouse[0])
  ch.vars.yScale.distortion(2.5).focus(mouse[1])
  ch.dom.dot.call(ch.position)
  ch.dom.svg.select(".x.axis").call(ch.dom.xAxis)

  return ch.dom.svg.select(".y.axis").call(ch.dom.yAxis)
}

ch.setPointer = function () {
  ch.dom.pointer = ch.dom.svg.append("text").text("+").attr("class", "pointer")
}

ch.bindMousemove = function () {
  return ch.dom.svg.on("mousemove", function () {
    if (!ch.vars.focused) {
      ch.zoom.call(this)
    }
  })
}

ch.bindClick = function () {
  return ch.dom.svg.on("click", function () {
    ch.vars.focused = !ch.vars.focused

    if (ch.vars.focused) {
      const mouse = d3.mouse(this)

      return ch.dom.pointer
        .attr("x", mouse[0])
        .attr("y", mouse[1])
        .style("opacity", 1)
    }

    ch.dom.pointer.style("opacity", 0)

    return ch.zoom.call(this)
  })
}

ch.humanizeNumber = function (n) {
  n = n.toString()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3")

    if (n === n2) {
      break
    } else {
      n = n2
    }
  }

  return n
}

export default () => {
  ch.ready()
}
