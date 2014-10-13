window.Charts = window.Charts || {}
window.Charts.d3js = window.Charts.d3js || {}
window.Charts.d3js['fish-eye'] = window.Charts.d3js['fish-eye'] || {}

ch = window.Charts.d3js['fish-eye']

ch.ready =  ->
  ch.setCg()
  ch.setDom()
  ch.setVars()
  ch.getData(ch.render)

ch.render = ->
  ch.setBackground()
  ch.setFilter()
  ch.setAxis()
  ch.setLabels()
  ch.setDots()
  ch.bindListeners()

ch.setCg = ->
  ch.cg =
    margin: {top: 50, right: 50, bottom: 50, left: 50}
  ch.cg.height = 500 - ch.cg.margin.top - ch.cg.margin.bottom
  ch.cg.width = $('#chart').innerWidth() - ch.cg.margin.left - ch.cg.margin.right

ch.setDom = -> ch.dom =
  svg: d3.select('#chart').append('svg')\
    .attr('width', ch.cg.width + ch.cg.margin.left + ch.cg.margin.right)\
    .attr('height', ch.cg.height + ch.cg.margin.top + ch.cg.margin.bottom)\
    .append('g')\
    .attr('transform', 'translate(' + ch.cg.margin.left + ',' + ch.cg.margin.top + ')')

ch.getData = (cb)->
  d3.json('/data/d3js/fish-eye/data.json', (nations)->
    ch.data = nations
    cb()
  )

ch.setVars = -> ch.vars =
  xScale: d3.fisheye.scale(d3.scale.log).domain([300, 1e5]).range([0, ch.cg.width])
  yScale: d3.fisheye.scale(d3.scale.linear).domain([20, 90]).range([ch.cg.height, 0])
  radiusScale: d3.scale.sqrt().domain([0, 5e8]).range([0, 40])
  colorScale: d3.scale.category10().domain(['Sub-Saharan Africa', 'South Asia', \
    'Middle East & North Africa', 'America', 'Europe & Central Asia', 'East Asia & Pacific'])
  
ch.setAxis = ->
  ch.dom.xAxis = d3.svg.axis().orient('bottom').scale(ch.vars.xScale)
    .tickFormat(d3.format(',d')).tickSize(-ch.cg.height)
  ch.dom.yAxis = d3.svg.axis().scale(ch.vars.yScale).orient('left').tickSize(-ch.cg.width)
  ch.dom.svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,' + ch.cg.height + ')').call(ch.dom.xAxis)
  ch.dom.svg.append('g').attr('class', 'y axis').call(ch.dom.yAxis)
  
ch.setBackground = ->
  ch.dom.svg.append('rect').attr('class', 'background').attr('width', ch.cg.width)
    .attr('height', ch.cg.height)

ch.setLabels = ->
  ch.dom.svg.append('text').attr('class', 'x label').attr('text-anchor', 'end')
    .attr('x', ch.cg.width - 6).attr('y', ch.cg.height - 6)
    .text('income per capita, inflation-adjusted (dollars)')
  ch.dom.svg.append('text').attr('class', 'y label').attr('text-anchor', 'end')
    .attr('x', -6).attr('y', 6).attr('dy', '.75em').attr('transform', 'rotate(-90)')
    .text('life expectancy (years)');

ch.setFilter = ->
  d3utils.filterColor('circles', ch.dom.svg, 1.5, .6)

ch.position = (dot)->
  dot.attr('cx', (d)-> ch.vars.xScale(d.income))
    .attr('cy', (d)-> ch.vars.yScale(d.lifeExpectancy))
    .attr('r', (d)-> ch.vars.radiusScale(d.population))

ch.setDots = ->
  ch.dom.dot = ch.dom.svg.append('g').attr('class', 'dots').selectAll('.dot')
    .data(ch.data).enter().append('circle').attr('class', 'dot')
    .style('fill', (d)-> ch.vars.colorScale(d.region))
    .style('filter', 'url(#drop-shadow-circles)')
    .call(ch.position).sort((a, b)-> b.population - a.population)

  ch.dom.dot.append('title').text((d)-> d.name)

ch.bindListeners = ->
  ch.dom.svg.on('mousemove', ->
    mouse = d3.mouse(this)
    ch.vars.xScale.distortion(2.5).focus(mouse[0])
    ch.vars.yScale.distortion(2.5).focus(mouse[1])
    ch.dom.dot.call(ch.position)
    ch.dom.svg.select('.x.axis').call(ch.dom.xAxis)
    ch.dom.svg.select('.y.axis').call(ch.dom.yAxis)
  )