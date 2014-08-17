stash = ((d)->
  d.x0 = d.x
  d.dx0 = d.dx
)

arcTween = ((a)->
  i = d3.interpolate({x: a.x0, dx: a.dx0}, a)
  return ((t)->
    b = i(t)
    a.x0 = b.x
    a.dx0 = b.dx
    return arc(b)
  )
)

width = 960
height = 700
radius = Math.min(width, height) / 2
color = d3.scale.category20c()

svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height).append("g")
.attr("transform", "translate(" + width / 2 + "," + height * .52 + ")")

partition = d3.layout.partition().sort(null).size([2 * Math.PI, radius * radius]).value((d)-> 1 )

arc = d3.svg.arc().startAngle((d)-> d.x).endAngle((d)-> d.x + d.dx).innerRadius((d)-> Math.sqrt(d.y))
.outerRadius((d)-> Math.sqrt(d.y + d.dy))

d3.json("/data/d3js/partition/flare.json", (error, root)->
  path = svg.datum(root).selectAll("path").data(partition.nodes).enter().append("path")
  .attr("display", (d)-> if d.depth then return null else return "none").attr("d", arc)
  .style("stroke", "#fff").style("fill", (d)-> if d.children then return color(d.name) else return color(d.parent.name))
  .style("fill-rule", "evenodd").each(stash)

  d3.selectAll("input").on("change", ()->
    value = if this.value is "count" then (()-> 1 ) else ((d)-> d.size)

    path.data(partition.value(value).nodes).transition().duration(1500).attrTween("d", arcTween)
  )
)