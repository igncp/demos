ready = ->
  d3.json('/data/d3js/bars/data.json', (error, data)->
    data = data
    
    colours = ['#323247','#7C7CC9','#72B66C','#429742']
    c = d3.scale.linear().domain(d3.extent(data)).range([0,1])
    heatmapColour = d3.scale.linear()
      .domain(d3.range(0, 1, 1.0 / (colours.length))).range(colours)
    color = (d)-> heatmapColour(c(d))

    height = 500
    width = $('#chart').innerWidth()
    margin = {left: 160, top: 100}
    floor = height - margin.top * 2
    
    barWidth = 30
    barHeight = 7


    barYFn = ((d)-> floor - barHeight * d)
    barHeightFn = ((d)-> d * barHeight)


    chart = d3.select('#chart').append('svg')
      .attr({width: width, height: height})
      .append('g').attr({transform: 'translate(' + margin.left + ',' + \
        margin.top + ')'})
       
    x = d3.scale.linear().domain([0.5,data.length + .5]).range([1,barWidth * data.length])
    y = d3.scale.linear().domain([0, d3.max(data)]).rangeRound([0, -1 * barHeight * d3.max(data)])
    xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(data.length)
    yAxis = d3.svg.axis().scale(y).orient('left').ticks(5)

    chart.append('g').attr({'transform': 'translate(0,' + floor + ')', class: 'x-axis axis'})
      .call(xAxis)
      .append('text').attr('transform', 'translate(' + barWidth * data.length / 2 + ' ,0)')
      .attr('class', 'x-axis-label')
      .attr('y', 40).attr('font-size', '1.3em').style({'text-anchor': 'end'}).text('Number')

    chart.append('g').attr({'transform': 'translate(0,' + floor + ')', class: 'x-axis axis'})
      .call(yAxis)
      .append('text').attr('transform', 'translate(-30,' + String((-1) * (height - 60) / 2) + ')')
      .attr('y', 40).attr('font-size', '1.3em').style({'text-anchor': 'end'})
      .text('Value')

    intervalFn = ( ->
      data.unshift(data.pop())
      redraw()
    )

    interval = setInterval(intervalFn,1000)

    drawRectangles = ( ->
      chart.selectAll('rect').data(data).enter().append('rect').attr('x', (d, i)-> barWidth * i)
      .attr('y', barYFn).attr('width', barWidth).attr('height', barHeightFn )
      .attr('fill', (d)-> color(d))
      .on('mouseover', (d)->
        for i in [1..interval]
          clearInterval(i)
      )
      .on('mouseleave', -> interval = setInterval(intervalFn,1000))
      .append('title').text((d)-> d)
    )

    drawRectangles()

    redraw = ( ->
      x = d3.scale.linear().domain([0.5,data.length + .5]).range([1,barWidth * data.length])
      xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(data.length)
      chart.select('.x-axis').transition().duration(500).call(xAxis)
      chart.select('.x-axis-label').transition().duration(500)
        .attr('transform', 'translate(' + barWidth * data.length / 2 + ' ,0)')
      chart.selectAll('rect').data(data).transition().duration(500)
        .attr('y', barYFn).attr('height', barHeightFn).attr('fill',color )
        .select('title').text((d)->d)
    )

    $('#add-item').on('click', ->
      if data.length < 20
        data.push(Math.floor(Math.random() * (d3.max(data))) + 1)
        drawRectangles()
      else
        $('#add-item').attr('disabled', 'disabled')
    )
  )


$(document).ready(ready)