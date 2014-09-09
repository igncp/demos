ready = ( ->
  d3.csv('/data/d3js/area/data.csv', (error, data)->
    margin = {top: 50, right: 50, bottom: 50, left: 50}
    width = $('#chart').innerWidth() - margin.left - margin.right
    height = 400 - margin.top - margin.bottom

    svg = d3.select('#chart').append('svg')
      .attr({width: width + margin.left + margin.right, \
        height: height + margin.top + margin.bottom})
      .append('g').attr({transform: 'translate(0,' + margin.top + ')'})

    xMax = d3.max(data, (d)-> d.year )
    xMin = d3.min(data, (d)-> d.year )
    yMax = d3.max(data, (d)-> d.percent / 100 )
    yExtent = d3.extent(data, (d)-> d.percent)

    xScale = d3.scale.linear().range([0, width ]).domain([xMin, xMax])
    yScale = d3.scale.linear().range([0, height]).domain([yMax, 0.25])
    
    xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.format('.'))
      .innerTickSize(-height)
    
    yAxis = d3.svg.axis().scale(yScale).tickFormat(d3.format('%'))
      .innerTickSize(-width).orient('left')
    
    svg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(' + margin.left + ',' + \
        String(height) + ')')
      .call(xAxis)
    
    svg.append('g').attr('class', 'y axis')
      .attr('transform', 'translate(' + margin.left + ',' + '0)').call(yAxis)
     
    area = d3.svg.area().interpolate('monotone').x((d)-> xScale(d.year) + margin.left)
      .y0(height).y1((d)-> yScale(d.percent / 100))

    line = d3.svg.line()
      .x((d)-> xScale(d.year) + margin.left)
      .y((d)-> yScale(d.percent / 100))

    svg.append('path').datum(data).attr('class', 'line')
      .attr('clip-path', 'url(#clip)').attr('d', line)

    svg.append('clipPath').attr('id', 'clip').append('rect')
      .attr('width', width + margin.left).attr('height', height)

    svg.append('path').datum(data).attr('class', 'area').attr('clip-path', 'url(#clip)')
      .attr('d', area)
  )

)


$(document).ready(ready)





