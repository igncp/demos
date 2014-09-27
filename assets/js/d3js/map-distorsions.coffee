ready = ->
  margin = {top: 30, right: 40, bottom: 20, left: 200}
  width = $('#chart').innerWidth() - margin.left - margin.right
  height = 500 - margin.top - margin.bottom

  dimensions = [{
      name: 'name', scale: d3.scale.ordinal().rangePoints([0, height]), type: String
    },
    {
      name: 'Acc. 40º 150%', scale: d3.scale.linear().range([0, height]), type: Number
    },
    {
      name: 'Scale', scale: d3.scale.linear().range([height, 0]), type: Number
    },
    {
      name: 'Areal', scale: d3.scale.sqrt().range([height, 0]), type: Number
    },
    {
      name: 'Angular', scale: d3.scale.linear().range([height, 0]), type: Number
    }
  ]

  
  svg = d3utils.svg('#chart', width, height, margin)

  x = d3.scale.ordinal().domain(dimensions.map((d)-> d.name )).rangePoints([0, width])
  line = d3.svg.line().defined((d)-> !isNaN(d[1]))
  yAxis = d3.svg.axis().orient('left')

  dimension = svg.selectAll('.dimension').data(dimensions).enter().append('g')
    .attr('class', 'dimension').attr('transform', (d)-> 'translate(' + x(d.name) + ')')


  d3.tsv('/data/d3js/map-distorsions/data.tsv', (data)->
    d3utils.filterColor('lines', svg, 2, .4)

    dimensions.forEach((dimension)->
      dimension.scale.domain(
        if dimension.type is Number
          d3.extent(data, (d)-> +d[dimension.name])
        else
          data.map((d)-> d[dimension.name]).sort()
      )
    )

    draw = ((d)->
      line(dimensions.map((dimension)->
        [x(dimension.name), dimension.scale(d[dimension.name])]
      ))
    )

    svg.append('g').attr('class', 'background').selectAll('path').data(data)
      .enter().append('path').attr('d', draw)

    svg.append('g').attr('class', 'foreground').selectAll('path').data(data)
      .enter().append('path').attr('d', draw);

    dimension.append('g').attr('class', 'axis')
      .each((d)-> d3.select(this).call(yAxis.scale(d.scale))).append('text')
      .attr('class', 'title').attr('text-anchor', 'middle').attr('y', -9)
      .text((d)-> d.name )

    svg.select('.axis').selectAll('text:not(.title)').attr('class', 'label')
      .data(data, (d)-> d.name or d)

    moveToFront = ( ->
      @parentNode.appendChild(this)
    )

    mouseover = ((d)->
      svg.classed('active', true)
      projection.classed('inactive', (p)-> p isnt d)
      projection.filter((p)-> p is d).each(moveToFront)
    )

    mouseout = ((d)->
      svg.classed('active', false)
      projection.classed('inactive', false)
    )

    projection = svg.selectAll('.axis text,.background path,.foreground path')
      .on('mouseover', mouseover).on('mouseout', mouseout)
  )


$(document).ready(ready)