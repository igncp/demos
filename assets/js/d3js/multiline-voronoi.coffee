ready = ->
  months = ''
  monthFormat = d3.time.format('%Y-%m')

  clickToggle = false
  monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
   'September', 'October', 'November', 'December' ]

  margin = {top: 60, right: 70, bottom: 70, left: 80}
  width = $('#chart').innerWidth() - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  
  x = d3.time.scale().range([0, width])
  y = d3.scale.linear().range([height, 0])

  color = d3.scale.category20()

  svg = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  type = ((d, i)->
    if not i then months = Object.keys(d).map(monthFormat.parse).filter(Number)
    city = {
      name: d.name.replace(/(msa|necta div|met necta|met div)$/i, ''),
      values: null
    }
    city.values = months.map((m)->
      return {
        city: city,
        date: m,
        value: d[monthFormat(m)] / 100
      }
    )
    city
  )

  d3.tsv('/data/d3js/multiline-voronoi/data.tsv', type, (error, cities)->
    x.domain(d3.extent(months))
    y.domain([0, d3.max(cities, (c)-> d3.max(c.values, (d)-> d.value))]).nice()

    svg.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')')
    .call( d3.svg.axis().scale(x).orient('bottom') )

    svg.append('g').attr('class', 'axis axis--y')
    .call( d3.svg.axis().scale(y).orient('left').ticks(10, '%') )
    .append('text').attr('x', 20).attr('dy', '.32em').style('font-weight', 'bold')
    .text('US Unemployment Rate')

    defs = svg.append('defs')
    filter = defs.append('filter').attr('id', 'drop-shadow')
    filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 1)
    filter.append('feOffset').attr('dx', 1).attr('dy', 1)
    filter.append('feComponentTransfer').append('feFuncA').attr({type: 'linear', slope: '1'})
    feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    line = d3.svg.line().x((d)-> x(d.date)).y((d)-> y(d.value))

    generateLines = ((data)->
      svg.append('g').attr('class', 'cities').selectAll('path').data(data).enter()
      .append('path').attr('d', (d)-> d.line = this; return line(d.values))
      .style('stroke', (d,i)->color(i)).style('filter', (d)-> 'url(#drop-shadow)')

      generateVoronoi(data)
    )
    
    generateVoronoi = ((data)->
      mouseover = ((d)->
        d3.select(d.city.line).classed('city--hover', true)
        d.city.line.parentNode.appendChild(d.city.line)
        focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')')
        focus.select('.text1').text(d.city.name.trim() + ': ')
        date = (monthNames[d.date.getMonth()]) + ' of ' + d.date.getFullYear()
        focus.select('.text2').text(' ' + String((d.value * 100).toFixed(2)) + '% - ' + date )
      )

      mouseout = ((d)->
        d3.select(d.city.line).classed('city--hover', false)
        focus.attr('transform', 'translate(-100,-100)')
      )

      clicked = ((d)->
        clickToggle = !clickToggle

        d3.selectAll('.cities').remove()
        d3.selectAll('.voronoi').remove()
        
        if clickToggle
          generateLines([d.city])
        else
          generateLines(cities)
      )

      focus = svg.append('g').attr('transform', 'translate(-100,-100)').attr('class', 'focus')
      focus.append('circle').attr('r', 3.5)
      focus.append('text').attr('class', 'text1').attr('y', -30)
      focus.append('text').attr('class', 'text2').attr('y', -10)
      voronoiGroup = svg.append('g').attr('class', 'voronoi')

      voronoi = d3.geom.voronoi().x((d)-> x(d.date)).y((d)-> y(d.value))
        .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])

      voronoiGroup.selectAll('path')
        .data(voronoi(d3.nest().key((d)-> x(d.date) + ',' + y(d.value))
          .rollup((v)-> v[0]).entries(d3.merge(data.map((d)-> d.values))).map((d)-> d.values)))
        .enter().append('path').attr('d', (d)-> 'M' + d.join('L') + 'Z')
        .datum((d)-> d.point).on('mouseover', mouseover)
        .on('mouseout', mouseout).on('click', clicked)
      
      d3.select('#show-voronoi').property('disabled', false)
        .on('change', -> voronoiGroup.classed('voronoi--show', this.checked))
    )

    generateLines(cities)


  )

$(document).ready(ready)