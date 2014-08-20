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
    arc(b)
  )
)

addTitles = ((selectors)->
  selectors.forEach((selector)-> selector.append('title').text((d)-> d.name + '\n' + d.value) )
)

width = 960
height = 700
radius = Math.min(width, height) / 2
colorScale = d3.scale.category20c()
color = (d)-> if d.children then return colorScale(d.name) else return colorScale(d.parent.name)

svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height).append("g")
.attr("transform", "translate(" + width / 2 + "," + height * .52 + ")")

partition = d3.layout.partition().sort(null).size([2 * Math.PI, radius * radius]).value((d)-> 1 )

arc = d3.svg.arc().startAngle((d)-> d.x).endAngle((d)-> d.x + d.dx).innerRadius((d)-> Math.sqrt(d.y))
.outerRadius((d)-> Math.sqrt(d.y + d.dy))

d3.json("/data/d3js/partition/flare.json", (error, root)->
  arcs = svg.datum(root).selectAll("path").data(partition.nodes).enter()
  
  
  path = arcs.append('path')
  .attr({
    display: ((d)-> if d.depth then return null else return "none"), d: arc, 'data-index': ((d, i)-> i)
  }).style({stroke: "#fff", fill: ((d)-> color(d) ), "fill-rule": "evenodd"}).each(stash)

  texts = arcs.append('text')
  .text((d)-> if d.depth < 2 and d.dx > .1 and d.parent then return d.name else return '')
  .attr({
    x: ((d)-> arc.centroid(d)[0] - 30), y: ((d)-> arc.centroid(d)[1]), 'data-index': ((d, i)-> i)
  }).style({cursor: 'default'})

  [path, texts].forEach((set)-> 
    set.on('mouseover', (d)->
      index = d3.select(this).attr('data-index')
      d3.select('path[data-index="' + index + '"]').style('fill', '#CCC')
      d3.select('text[data-index="' + index + '"]').style('fill', '#fff')
    ) 
  )
  [path, texts].forEach((set)-> 
    set.on('mouseout', (d)->
      index = d3.select(this).attr('data-index')
      d3.select('path[data-index="' + index + '"]').style('fill', color)
      d3.select('text[data-index="' + index + '"]').style('fill', '#000')
    )
  )

  addTitles([path, texts])

  d3.selectAll("input").on("change", ()->
    value = if this.value is "count" then (()-> 1 ) else ((d)-> d.size)

    path.data(partition.value(value).nodes).transition().duration(1500).attrTween("d", arcTween)
    addTitles([path, texts])
    
    texts.data(partition.value(value).nodes).transition().duration(1500).attr("x", (d)-> arc.centroid(d)[0] - 10)
    .attr('y', (d)-> arc.centroid(d)[1])
  )
)