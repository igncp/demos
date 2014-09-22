ready = ->
  margin = { top: 50, right: 50, bottom: 100, left: 50 }
  width = $('#chart').innerWidth() - margin.left - margin.right
  height = Math.ceil(width * 10 / 24) - margin.top - margin.bottom + 60
  gridSize = Math.floor(width / 24)
  legendElementWidth = gridSize * 2
  buckets = 9
  colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4',
    '#1d91c0','#225ea8','#253494','#081d58']

  days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  times = ['1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am',
    '8 am', '9 am', '10 am', '11 am', '12 am', '1 pm', '2 pm', '3 pm',
    '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm', '12 pm']

  values = ((d)-> {day: +d.day, hour: +d.hour, value: +d.value})

  d3.tsv('/data/d3js/weekly-heatmap/data.tsv', values, (error, data)->
    colorScale = d3.scale.quantile()
      .domain([0, buckets - 1, d3.max(data, (d)-> d.value)]).range(colors)
    
    svg = d3.select('#chart').append('svg')
      .attr({width: width + margin.left + margin.right, \
        height: height + margin.top + margin.bottom}).append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    dayLabels = svg.selectAll('.dayLabel').data(days).enter().append('text').text((d)-> d)
      .attr({x: 0, y: ((d, i)-> i * gridSize), transform: 'translate(-6,' + gridSize / 1.5 + ')', \
        class: ((d, i)-> if i >= 0 and i <= 4 then return 'dayLabel mono axis axis-workweek' else \
        return 'dayLabel mono axis') }).style('text-anchor', 'end')

    timeLabels = svg.selectAll('.timeLabel').data(times).enter().append('text').text((d)-> d)
      .attr({x: ((d, i)-> i * gridSize), y: 0, transform: 'translate(' + gridSize / 2 + ', -6)', \
        class: ((d, i)-> if i >= 7 and i <= 16 then return 'timeLabel mono axis axis-worktime' \
        else  return 'timeLabel mono axis')}).style('text-anchor', 'middle')

    heatMap = svg.selectAll('.hour').data(data).enter().append('rect')
    .attr({x: ((d)-> (d.hour - 1) * gridSize), y: ((d)-> (d.day - 1) * gridSize), rx: 4, ry: 4, \
      class: 'hour bordered', width: gridSize, height: gridSize}).style('fill', colors[0])

    heatMap.transition().duration(6000).style('fill', (d)-> colorScale(d.value))
    
    heatMap.attr('data-title', (d)->
      return 'Value: ' + d.value
    )
    d3utils.tooltip('.hour', {tOpts: {delay: {hide: 0, show: 500}}})

    # Legend:
    legend = svg.selectAll('.legend').data([0]
      .concat(colorScale.quantiles()), (d)-> d).enter().append('g')
      .attr('class', 'legend')

    legend.append('rect').attr('x', (d, i)-> legendElementWidth * i)
      .attr('y', height).attr('width', legendElementWidth)
      .attr('height', gridSize / 2).style({fill: ((d, i)-> colors[i]), stroke: '#CCC'})

    legend.append('text').attr('class', 'mono')
      .text((d)-> '≥ ' + Math.round(d)).attr('x', (d, i)-> legendElementWidth * i)
      .attr('y', height + gridSize)
  )


$(document).ready(ready)