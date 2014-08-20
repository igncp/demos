ready = ()->
  canvasWidth = $('#chart').innerWidth()
  canvasHeight = 300
  outerRadius = 100
  color = d3.scale.category20()
  arc = {}

  angle = ((d)->
    a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
    if a > 90 then return a - 180 else return a
  )

  stash = ((d)->
    d.data.ea0 = _.cloneDeep(d)
  )

  arcTween = ((a, index)->
    i = d3.interpolate(a.data.ea0, a)
    a.data.ea0 = i(0)
    return ((t)->
      return arc(i(t))
    )
  )

  d3.json("/data/d3js/pie-chart/data.json", (error, data)->   
    pie = d3.layout.pie().sort(null).value((d)-> d.val)
    arc = d3.svg.arc().outerRadius(outerRadius)

    svg = d3.select("#chart").append("svg:svg")
    .attr("width", canvasWidth).attr("height", canvasHeight)
    .append("svg:g").attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")")

    path = svg.selectAll("g.slice").data(pie(data)).enter().append("svg:g").attr("class", "slice")
    path.append("svg:path").attr("fill", (d, i)-> color(i) ).attr("d", arc).each(stash)

    path.filter((d)-> d.endAngle - d.startAngle > .2 ).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle")
    .attr("transform", (d)->
      d.outerRadius = outerRadius; # Set Outer Coordinate
      d.innerRadius = outerRadius/2; # Set Inner Coordinate
      "translate(" + arc.centroid(d) + ")"
    ).style("fill", "White").style("font", "bold 12px Arial").text((d)-> d.data.val)

    # path.append("svg:text").attr("transform", (d)->
    #   d.outerRadius = outerRadius + 50
    #   d.innerRadius = outerRadius + 45
    #   "translate(" + arc.centroid(d) + ")"
    # ).attr("text-anchor", "middle").style("fill", "#CCC").style("font", "bold 12px Arial").text((d, i)-> data[i].label)

    d3.select('.change-data').on('click', ()->
      data[0].val = 1
      path = path.data(pie(data)).append("svg:path").attr("fill", (d, i)-> color(i) )

      path.transition().duration(500).attrTween("d", arcTween).each('end', ()->
        path.filter((d)-> d.endAngle - d.startAngle > .2 ).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle")
        .attr("transform", (d)->
          d.outerRadius = outerRadius; # Set Outer Coordinate
          d.innerRadius = outerRadius/2; # Set Inner Coordinate
          "translate(" + arc.centroid(d) + ")"
        ).style("fill", "White").style("font", "bold 12px Arial").text((d)-> d.data.val)
      )
      
    )
  )

$(document).ready(ready)