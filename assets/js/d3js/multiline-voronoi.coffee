ready = ()->
  months = ''
  monthFormat = d3.time.format("%Y-%m")

  margin = {top: 20, right: 30, bottom: 30, left: 40}
  width = $('#chart').innerWidth() - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  
  x = d3.time.scale().range([0, width])
  y = d3.scale.linear().range([height, 0])

  color = d3.scale.category20()

  voronoi = d3.geom.voronoi().x((d)-> x(d.date)).y((d)-> y(d.value))
  .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])

  svg = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  type = ((d, i)->
    if not i then months = Object.keys(d).map(monthFormat.parse).filter(Number)
    city = {
      name: d.name.replace(/(msa|necta div|met necta|met div)$/i, ""),
      values: null
    }
    city.values = months.map((m)->
      return {
        city: city,
        date: m,
        value: d[monthFormat(m)] / 100
      };
    )
    city
  )

  d3.tsv("/data/d3js/multiline-voronoi/data.tsv", type, (error, cities)->    
    x.domain(d3.extent(months));
    y.domain([0, d3.max(cities, (c)-> d3.max(c.values, (d)-> d.value))]).nice()

    svg.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")")
    .call( d3.svg.axis().scale(x).orient("bottom") )

    svg.append("g").attr("class", "axis axis--y")
    .call( d3.svg.axis().scale(y).orient("left").ticks(10, "%") )
    .append("text").attr("x", 4).attr("dy", ".32em").style("font-weight", "bold").text("Unemployment Rate")

    line = d3.svg.line().x((d)-> x(d.date)).y((d)-> y(d.value))

    svg.append("g").attr("class", "cities").selectAll("path").data(cities).enter()
    .append("path").attr("d", (d)-> d.line = this; return line(d.values)).style('stroke', (d,i)->color(i))

    focus = svg.append("g").attr("transform", "translate(-100,-100)").attr("class", "focus")

    focus.append("circle").attr("r", 3.5)
    focus.append("text").attr("y", -10)

    voronoiGroup = svg.append("g").attr("class", "voronoi")

    mouseover = ((d)->
      d3.select(d.city.line).classed("city--hover", true)
      d.city.line.parentNode.appendChild(d.city.line)
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
      focus.select("text").text(d.city.name)
    )

    mouseout = ((d)->
      d3.select(d.city.line).classed("city--hover", false)
      focus.attr("transform", "translate(-100,-100)")
    )
    
    voronoiGroup.selectAll("path").data(voronoi(d3.nest().key((d)-> x(d.date) + "," + y(d.value))
    .rollup((v)-> v[0]).entries(d3.merge(cities.map((d)-> d.values))).map((d)-> d.values)))
    .enter().append("path").attr("d", (d)-> "M" + d.join("L") + "Z")
    .datum((d)-> d.point).on("mouseover", mouseover).on("mouseout", mouseout)

    d3.select("#show-voronoi").property("disabled", false).on("change", ()-> voronoiGroup.classed("voronoi--show", this.checked))

  )


$(document).ready(ready)