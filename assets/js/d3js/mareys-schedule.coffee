ready = ->
  stations = []
  margin = {top: 80, right: 50, bottom: 50, left: 120}
  width =  $('#chart').innerWidth() - margin.left - margin.right
  height = 600 - margin.top - margin.bottom

  formatTime = d3.time.format('%I:%M%p')

  parseTime = ((s)->
    t = formatTime.parse(s)
    if t isnt null and t.getHours() < 3 then t.setDate(t.getDate() + 1)
    return t
  )

  type = ((d, i)->
    if not i
      for k of d
        if /^stop\|/.test(k)
          p = k.split('|')
          stations.push({ key: k, name: p[1], distance: +p[2], zone: +p[3] })

    return {
      number: d.number,
      type: d.type,
      direction: d.direction,
      stops: stations.map((s)-> {station: s, time: parseTime(d[s.key])})
        .filter((s)-> s.time != null)
    }
  )

  d3.tsv('/data/d3js/mareys-schedule/data.tsv', type, (error, trains)->
    _.each(trains, (train, index)-> train.index = index )

    x = d3.time.scale().domain([parseTime('5:30AM'), parseTime('11:30AM')]).range([0, width])
    y = d3.scale.linear().range([0, height])
    xAxis = d3.svg.axis().scale(x).ticks(8).tickFormat(formatTime)

    svg = d3utils.svg('#chart', width, height, margin)
    d3utils.middleTitle(svg, width, 'E.J. Marey’s graphical train schedule', -40)
    d3utils.filterBlackOpacity('trains', svg, 2, .2)

    svg.append('defs').append('clipPath').attr('id', 'clip')
      .append('rect').attr('y', -margin.top).attr('width', width)
      .attr('height', height + margin.top + margin.bottom)

    y.domain(d3.extent(stations, (d)-> d.distance))
    station = svg.append('g').attr('class', 'station').selectAll('g')
      .data(stations).enter().append('g')
      .attr('transform', (d)-> 'translate(0,' + y(d.distance) + ')')

    station.append('text').attr('x', -6).attr('dy', '.35em').text((d)-> d.name)
    station.append('line').attr('x2', width)
    
    svg.append('g').attr('class', 'x top axis').call(xAxis.orient('top'))

    svg.append('g').attr('class', 'x bottom axis')
      .attr('transform', 'translate(0,' + height + ')').call(xAxis.orient('bottom'))

    mouseover = ((d)->
      d3.select('.train-' + d.index).select('path').style({'stroke-width': '5px'})
    )
    mouseleave = ((d)->
      d3.select('.train-' + d.index).select('path').style({'stroke-width': '2.5px'})
    )

    train = svg.append('g').attr('class', 'train').attr('clip-path', 'url(#clip)')
      .selectAll('g').data(trains.filter((d)-> /[NLB]/.test(d.type)))
      .enter().append('g').attr('class', (d,i)-> d.type + ' train-' + d.index)
      .on('mouseover', mouseover).on('mouseleave', mouseleave)
    
    line = d3.svg.line().x((d)-> x(d.time)).y((d)-> y(d.station.distance))
    
    train.append('path').attr('d', (d)-> line(d.stops))
      .style({filter: 'url(#drop-shadow-trains)'})
      .append('title').text((d)-> d.stops[0].station.name + ' - ' + _.last(d.stops).station.name)

    train.selectAll('circle').data((d)-> d.stops).enter().append('circle')
      .attr('transform', (d)-> 'translate(' + x(d.time) + ',' + y(d.station.distance) + ')')
      .attr('r', '5px').append('title').text((d)-> d.station.name)
  )

$(document).ready(ready)