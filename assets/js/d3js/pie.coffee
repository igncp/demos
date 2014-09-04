ready = ->
  width = $('#chart').innerWidth()
  height = 300
  outerRadius = 100
  color = d3.scale.category20()
  arc = {}

  angle = ((d)->
    a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
    if a > 90 then return a - 180 else return a
  )

  stashArcs = ((d)-> d.data.ea0 = _.cloneDeep(d) )

  arcTween = ((a, index)->
    i = d3.interpolate(a.data.ea0, a)
    a.data.ea0 = i(0)
    return ((t)->  return arc(i(t)) )
  )

  textTransform = ((d)->
    d.outerRadius = outerRadius
    d.innerRadius = outerRadius / 2
    'translate(' + arc.centroid(d) + ')'
  )

  d3.json('/data/d3js/pie/data.json', (error, data)->
    pie = d3.layout.pie().sort(null).value(((d)-> d.val))
    arc = d3.svg.arc().outerRadius(outerRadius)

    svg = d3.select('#chart').append('svg:svg').attr({width: width, height: height})
      .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    slices = svg.selectAll('.slice').data(pie(data)).enter().append('g').attr('class', 'slice')

    path = slices.append('path').attr({fill: ((d,i)-> color(i)), d: arc}).each(stashArcs)

    labels = slices.filter((d)-> d.endAngle - d.startAngle > .2)
      .append('text').attr({dy: '.35em', 'text-anchor': 'middle'})
      .attr('transform', textTransform).style({fill: 'White', font: 'bold 12px Arial'})
      .text((d)-> d.data.val)

    slices.append('title').text((d)-> d.data.label)

    d3.select('#change-data').on('click', ->
      index = Math.floor(Math.random() * 5)
      data[index].val = Math.floor(Math.random() * 44) + 2

      path.data(pie(data)).transition().duration(1000).attrTween('d', arcTween)
      labels.data(pie(data)).transition().duration(1000)
        .attr('transform', textTransform).each('start', (d)->
          d3.select(this).text(d.data.val)
        )
      
    )
  )

$(document).ready(ready)