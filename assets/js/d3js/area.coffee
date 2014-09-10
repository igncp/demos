ready = ( ->
  d3.csv('/data/d3js/area/data.csv', (error, data)->
    margin = {top: 50, right: 50, bottom: 50, left: 50}
    width = $('#chart').innerWidth() - margin.left - margin.right
    height = 400 - margin.top - margin.bottom

    svg = d3utils.svg('#chart', width, height, margin)
    d3utils.middleTitle(svg, width, 'Share of top decile [aka top 10%] in national income')
    d3utils.filterBlackOpacity('points', svg, 2, .5)

    xMax = d3.max(data, (d)-> d.year )
    xMin = d3.min(data, (d)-> d.year )
    yMax = d3.max(data, (d)-> d.percent / 100 )
    yMin = d3.min(data, (d)-> d.percent / 100 )
    yExtent = d3.extent(data, (d)-> d.percent)

    xScale = d3.scale.linear().range([0, width ]).domain([xMin, xMax])
    yScale = d3.scale.linear().range([0, height]).domain([yMax + .05, yMin - 0.05])
    
    xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.format('.')).innerTickSize(-height)
    
    yAxis = d3.svg.axis().scale(yScale).tickFormat(d3.format('%'))
      .innerTickSize(-width).orient('left')
    
    svg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(' + margin.left + ',' + \
        String(height) + ')')
      .call(xAxis).selectAll('text').attr({dy: '1.25em'})
    
    svg.append('g').attr('class', 'y axis')
      .attr('transform', 'translate(' + margin.left + ',' + '0)').call(yAxis)
      .selectAll('text').attr({dx: '-.25em'})
     
    area = d3.svg.area().interpolate('monotone').x((d)-> xScale(d.year) + margin.left)
      .y0(height).y1((d)-> yScale(d.percent / 100))

    line = d3.svg.line()
      .x((d)-> xScale(d.year) + margin.left)
      .y((d)-> yScale(d.percent / 100))

    svg.append('path').datum(data).attr({class: 'line', 'clip-path': 'url(#clip)', \
      d: line })

    svg.append('clipPath').attr({id: 'clip'}).append('rect')
      .attr({width: width + margin.left, height: height})

    svg.append('path').datum(data).attr({class: 'area', 'clip-path': 'url(#clip)', d: area})

    voronoiData = _.map(data, (point)->
      [point.year, ]
    )

    voronoi = d3.geom.voronoi().x((point)-> xScale(point.year) + margin.left)
      .y((point)-> yScale(point.percent / 100) )
      .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])

    mouseover = ((d)->
      d3.select('.point-' + d.index).style('display', 'block')
    )

    mouseleave = ((d)->
      d3.select('.point-' + d.index).style('display', 'none')
    )

    svg.selectAll('circle').data(data).enter().append('circle')
      .attr('transform', (d)-> 'translate(' + String(xScale(d.year) + margin.left) + \
        ',' + yScale(d.percent / 100) + ')')
      .attr('r', '5px').attr('class', (d,i)->'point point-' + i)
      .style({filter: 'url(#drop-shadow-points)'})

    voronoiGroup = svg.append('g').attr('class', 'voronoi')
    voronoiGroup.selectAll('path').data(voronoi(data))
      .enter().append('path').attr('d', (d,i)-> d.index = i; 'M' + d.join('L') + 'Z')
      .on('mouseover', mouseover).on('mouseleave', mouseleave)
      .append('title').text((d)-> 'Year: ' + d.point.year + '\n' + \
        'Percent: ' + d.point.percent + '%')
  )
)


$(document).ready(ready)