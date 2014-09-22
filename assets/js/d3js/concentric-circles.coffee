ready = ->
  d3.csv('/data/d3js/concentric-circles/data.csv', (data)->
    colours = ['#7C7CC9','#52D552','#337233','#323247']

    c = d3.scale.linear().domain(d3.extent(data, (d)->+d.count)).range([0,1])
    heatmapColour = d3.scale.linear().domain(d3.range(0, 1, 1.0 / (colours.length))).range(colours)
    colorize = (d)-> heatmapColour(c(d.count))

    margin = {top: 20, right: 20, bottom: 20, left: 20}
    width = $('#chart').innerWidth() - margin.left - margin.right
    height = d3.max(data, (d)-> +d.count) * 2.5
    strokeWidth = '2px'
    dataMax = d3.max(data, (d)-> +d.count)

    svg = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.left + margin.right).append('g')

    defs = svg.append('defs')
    filter = defs.append('filter').attr('id', 'drop-shadow')
    filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 9)
    filter.append('feOffset').attr('dx', 5).attr('dy', 5)
    filter.append('feComponentTransfer').append('feFuncA').attr({type: 'linear', slope: '.3'})
    feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    circleGroup = svg.selectAll('g').data(data,(d)-> d.name).enter().append('g')

    circles = circleGroup.append('svg:circle')

    rScale = d3.scale.pow().exponent(.9).range([5,300]).domain(d3.extent(data, (d)-> +d.count))

    circles.attr('cx', width / 2).attr('cy', height / 2).attr('r', (d)-> rScale(d.count))
      .attr('class', 'name-circle').attr('data-title', (d)-> d.name + ': ' + d.count)
      .style('fill','#FFF').style('stroke',(d)-> colorize(d)).style('stroke-width', strokeWidth)
      .style('filter', (d)-> if d.count > dataMax / 3 then \
        return 'url(#drop-shadow)' else return '')
      .on('mouseover', ->
        d3.select(this).style('stroke', '#D88021').style('stroke-width', '10px')
      )
      .on('mouseleave', ->
        d3.select(this).style('stroke', (d)-> colorize(d)).style('stroke-width', strokeWidth)
      )

    d3utils.tooltip('.name-circle', {followMouse: true})

    svg.append('text')
      .text('Circles radius are proportional to the count of times the name appears')
      .attr('transform', 'translate(' + width / 2 + ',' + (height - 10) + ')')
      .attr('width', '20px')
  )

$(document).ready(ready)