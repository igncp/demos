canvasWidth = 500
canvasHeight = 300
outerRadius = 100
color = d3.scale.category20()

angle = ((d)->
  a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
  if a > 90 then return a - 180 else return a
)

d3.json("/data/d3js/pie-chart/data.json", (error, data)->   
  vis = d3.select("#chart").append("svg:svg").data([data]).attr("width", canvasWidth).attr("height", canvasHeight)
  .append("svg:g").attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")")

  arc = d3.svg.arc().outerRadius(outerRadius)

  pie = d3.layout.pie().value((d)-> d.val).sort( (d)-> d.val)

  arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice")

  arcs.append("svg:path").attr("fill", (d, i)-> color(i) ).attr("d", arc);

  arcs.filter((d)-> d.endAngle - d.startAngle > .2 ).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle")
  .attr("transform", (d)->
    d.outerRadius = outerRadius; # Set Outer Coordinate
    d.innerRadius = outerRadius/2; # Set Inner Coordinate
    "translate(" + arc.centroid(d) + ")"
  ).style("fill", "White").style("font", "bold 12px Arial").text((d)-> d.data.val);

  arcs.append("svg:text").attr("transform", (d)->
    d.outerRadius = outerRadius + 50
    d.innerRadius = outerRadius + 45
    "translate(" + arc.centroid(d) + ")"
  ).attr("text-anchor", "middle").style("fill", "#CCC").style("font", "bold 12px Arial").text((d, i)-> data[i].label)
)