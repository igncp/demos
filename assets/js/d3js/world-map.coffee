ready = ()->
  data = ''; path = ''; projection = ''; countries = ''

  width = $('#chart').innerWidth()
  height = 500
  color = d3.scale.category20()

  classFn = ((d)-> 'country ' + d.id)
  colorFn = ((d)-> color(d.id))
  mouseoverFn = ((d)-> d3.select(this).style({'stroke-width': '1px', stroke: 'black'}) )
  mouseoutFn = ((d)-> d3.select(this).style({'stroke-width': '.2px', stroke: 'white'}) )
  
  setZoom = ((d)-> 
    console.log 'clicked'
    if not d
      countries.transition().duration(3500)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + 1 + ")translate(" + -width / 2 + "," + -height / 2 + ")")
    else
      centroid = path.centroid(d)
      x = centroid[0]; y = centroid[1]

      countries.transition().duration(3500)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + 8 + ")translate(" + -x + "," + -y + ")")
  )

  svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
  svg.append("rect").attr({class: "background", width: width, height: height}).on("click", setZoom).style({fill: '#DAEDFF'})
  svg = svg.append("g")

  d3.json("/data/d3js/world-map/world.json", (error, world)-> 
    projection = d3.geo.mercator().center([0, 45.4]).scale(150).translate([width / 2, height / 2])
    path = d3.geo.path().projection(projection)
    
    data = topojson.feature(world, world.objects.countries).features
    countries = svg.selectAll(".country").data(data).enter().append("path").attr({d: path, class: classFn})
    .style({fill: colorFn, stroke: '#FFF', 'stroke-width': .2})

    countries.on('mouseover', mouseoverFn)
    countries.on('mouseout', mouseoutFn)
    countries.on('click', setZoom)

  ) 


$(document).ready(ready)