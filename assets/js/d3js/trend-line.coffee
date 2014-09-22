ready =  ->
  animationTime = 2000

  linearRegression = ((data)->
    lr = {}
    n = data.length
    sum_x = 0; sum_y = 0; sum_xy = 0; sum_xx = 0; sum_yy = 0
   
    data.forEach((d)->
      sum_x += d.occurred.getTime()
      sum_y += d.value
      
      sum_xx += (d.occurred.getTime() * d.occurred.getTime())
      sum_yy += (d.value * d.value)
      
      sum_xy += (d.occurred.getTime() * d.value)
    )
    
    lr.slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)
    lr.intercept = (sum_y - lr.slope * sum_x) / n
    lr.r2 = Math.pow((n * sum_xy - sum_x * sum_y) / \
      Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2)
    
    lr
  )

  getInterpolation = ((data, line)->
    interpolate = d3.scale.quantile().domain([0,1]).range(d3.range(1, data.length + 1))

    return ((t)->
      interpolatedLine = data.slice(0, interpolate(t))
      line(interpolatedLine)
    )
  )

  d3.tsv('/data/d3js/trend-line/data.tsv', (error, data)->
    margin = {top: 50, right: 50, bottom: 50, left: 50}
    width = $('#chart').innerWidth() - margin.left - margin.right
    height = 500 - margin.top - margin.bottom
    time_format = d3.time.format('%Y-%m-%d').parse
    data.forEach((d)->
      d.occurred = time_format(d.occurred)
      d.value = +d.value
    )
    
    renderGraph = ( ->
      zoomed = d3.select('input[value="zoom"]')[0][0].checked
      svg = d3.select('#chart').text('').append('svg').attr({width: width + margin.left + \
        margin.right, height: height + margin.top + margin.bottom}).append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')

      x = d3.time.scale().range([0, width])
      y = d3.scale.linear().range([height, 0])

      xAxis = d3.svg.axis().scale(x).orient('bottom')
      yAxis = d3.svg.axis().scale(y).orient('left')

      line = d3.svg.line().x((d)-> x(d.occurred)).y((d)-> y(d.value))

      x.domain(d3.extent(data, (d)-> d.occurred))
      y.domain([
        ( -> if zoomed then return d3.min(data, (d)-> d.value) else return 0)()
        d3.max(data, (d)-> d.value)
      ])

      svg.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')').call(xAxis)
      svg.append('g').attr('class', 'y axis').call(yAxis)
      
      svg.append('path').datum(data).transition()
        .duration(animationTime).attrTween('d', -> getInterpolation(data, line))
        .attr('class', 'line')

      lr = linearRegression(data)

      regression_line = d3.svg.line().x((d)-> x(d.occurred)).y((d)->
        tmp = lr.intercept + (lr.slope * d.occurred)
        y(tmp)
      )

      svg.append('path').datum(data).transition().delay(animationTime).duration(animationTime)
        .attrTween('d', -> getInterpolation(data, regression_line)).attr('class', 'rline')
      
      svg.append('text').attr('transform', 'translate(' + width * .7 + ',' + height * .7 + ')')
        .style('opacity', 0).transition(1000).delay(animationTime * 2)
        .text('Slope: ' + lr.slope.toExponential(3)).style('opacity', 1)
    )
  
    renderGraph()

    d3.selectAll('input[name="mode"]').on('change', renderGraph)
  )

$(document).ready(ready)