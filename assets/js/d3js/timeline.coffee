ready = ( ->
  timeline = ((domElement)->
    margin = {top: 60, right: 20, bottom: 0, left: 20}
    outerWidth = $('#chart').innerWidth()
    outerHeight = 500
    width = outerWidth - margin.left - margin.right
    height = outerHeight - margin.top - margin.bottom

    bandGap = 25
    bandY = 0
    bandNum = 0
    timeline = {}
    data = {}
    components = []
    bands = {}

    svg = d3utils.svg('#chart', outerWidth, outerHeight, margin)
    d3utils.middleTitle(svg, outerWidth, 'Philosophers through History', -20)

    svg.append('clipPath').attr('id', 'chart-area').append('rect')
      .attr('width', width).attr('height', height)

    chart = svg.append('g').attr('class', 'chart').attr('clip-path', 'url(#chart-area)' )

    tooltip = d3.select('#chart').append('div').attr('class', 'tooltip')

    parseDate = ((dateString)->
      format = d3.time.format('%Y-%m-%d')
      date = format.parse(dateString)

      if date isnt null then return date

      if isNaN(dateString) then year = -(dateString.replace(/[^0-9]/g, ''))
      else year = +dateString

      if year < 0 or year > 99 then date = new Date(year, 6, 1)
      else if year == 0 then  date = new Date(-1, 6, 1)
      else
        date = new Date(year, 6, 1)
        date.setUTCFullYear(('0000' + year).slice(-4))
      
      date
    )

    toYear = ((date, bcString)->
      bcString = bcString or ' BC'
      year = date.getUTCFullYear()
      if year > 0 then return year.toString()
      if bcString[0] == '-' then return bcString + (-year)
      
      (-year) + bcString
    )

    timeline.data = ((items)->
      today = new Date()
      tracks = []
      yearMillis = 31622400000
      instantOffset = 100 * yearMillis

      data.items = items

      compareAscending = ((item1, item2)->
        result = item1.start - item2.start

        if result < 0 then return -1
        if result > 0 then return 1

        result = item2.end - item1.end
        if result < 0 then return -1
        if result > 0 then return 1
        
        0
      )

      compareDescending = ((item1, item2)->
        result = item1.start - item2.start

        if result < 0 then return 1
        if result > 0 then return -1

        result = item2.end - item1.end
        if result < 0 then return 1
        if result > 0 then return -1

        0
      )

      calculateTracks = ((items, sortOrder, timeOrder)->
        sortOrder = sortOrder or 'descending'
        timeOrder = timeOrder or 'backward'

        sortBackward = ( ->
          items.forEach((item)->
            track = 0
            for i in [0...tracks.length]
              if item.end < tracks[i] then break
              track++
            item.track = track
            tracks[track] = item.start
          )
        )

        sortForward = ( ->
          items.forEach((item)->
            track = 0
            for i in [0...tracks.length]
              if item.start > tracks[i] then break
              track++
            item.track = track
            tracks[track] = item.end
          )
        )

        if sortOrder is 'ascending' then data.items.sort(compareAscending)
        else data.items.sort(compareDescending)

        if timeOrder is 'forward' then sortForward() else sortBackward()
      )

      data.items.forEach((item)->
        item.start = parseDate(item.start)
        if item.end == ''
          item.end = new Date(item.start.getTime() + instantOffset)
          item.instant = true
        else
          item.end = parseDate(item.end)
          item.instant = false
        
        if item.end > today then item.end = today
      )

      calculateTracks(data.items, 'descending', 'backward')
      data.nTracks = tracks.length
      data.minDate = d3.min(data.items, (d)-> d.start)
      data.maxDate = d3.max(data.items, (d)-> d.end)

      timeline
    )

    timeline.band = ((bandName, sizeFactor)->
      band = {}
      band.id = 'band' + bandNum
      band.x = 0
      band.y = bandY
      band.w = width
      band.h = height * (sizeFactor or 1)
      band.trackOffset = 4
      band.trackHeight = Math.min((band.h - band.trackOffset) / data.nTracks, 20)
      band.itemHeight = band.trackHeight * 0.8
      band.parts = []
      band.instantWidth = 100 # Arbitray value.

      band.xScale = d3.time.scale().domain([data.minDate, data.maxDate]).range([0, band.w])
      band.yScale = (track)-> band.trackOffset + track * band.trackHeight

      band.g = chart.append('g').attr('id', band.id)
        .attr('transform', 'translate(0,' + band.y +  ')')

      band.g.append('rect').attr('class', 'band').attr('width', band.w)
        .attr('height', band.h);

      items = band.g.selectAll('g').data(data.items).enter().append('svg')
        .attr('y', (d)-> band.yScale(d.track)).attr('height', band.itemHeight)
        .attr('class', (d)-> if d.instant then return 'part instant' else return 'part interval')

      intervals = d3.select('#band' + bandNum).selectAll('.interval')
      intervals.append('rect').attr('width', '100%').attr('height', '100%')
      intervals.append('text').attr('class', 'intervalLabel').attr('x', 1).attr('y', 10)
        .text((d)-> d.label)

      instants = d3.select('#band' + bandNum).selectAll('.instant')
      instants.append('circle').attr('cx', band.itemHeight / 2)
        .attr('cy', band.itemHeight / 2).attr('r', 5);
      instants.append('text').attr('class', 'instantLabel').attr('x', 15).attr('y', 10)
        .text((d)-> d.label)

      band.addActions = ((actions)->
        actions.forEach((action)-> items.on(action[0], action[1]) )
      )

      band.redraw = ( ->
        items.attr('x', (d)-> band.xScale(d.start))
          .attr('width', (d)-> band.xScale(d.end) - band.xScale(d.start))
        band.parts.forEach((part)-> part.redraw())
      )

      bands[bandName] = band
      components.push band
      bandY += band.h + bandGap
      bandNum += 1
      
      timeline
    )

    timeline.labels = ((bandName)->
      band = bands[bandName]
      labelWidth = 46
      labelHeight = 20
      labelTop = band.y + band.h - 10
      y = band.y + band.h + 1
      yText = 15

      labelDefs = [
        ['start', 'bandMinMaxLabel', 0, 4,((min, max)-> toYear(min)),
          'Start of the selected interval', band.x + 30, labelTop],
        ['end', 'bandMinMaxLabel', band.w - labelWidth, band.w - 4, ((min, max)-> toYear(max)),
          'End of the selected interval', band.x + band.w - 152, labelTop],
        ['middle', 'bandMidLabel', (band.w - labelWidth) / 2, band.w / 2,
          ((min, max)-> max.getUTCFullYear() - min.getUTCFullYear()),
            'Length of the selected interval', band.x + band.w / 2 - 75, labelTop]
      ]

      bandLabels = chart.append('g').attr('id', bandName + 'Labels')
        .attr('transform', 'translate(0,' + (band.y + band.h + 1) +  ')')
        .selectAll('#' + bandName + 'Labels').data(labelDefs).enter().append('g')
        .on('mouseover', ((d)->
          tooltip.html(d[5]).style('top', d[7] + 'px').style('left', d[6] + 'px')
            .style('visibility', 'visible')
        )).on('mouseout', -> tooltip.style('visibility', 'hidden'))

      bandLabels.append('rect').attr('class', 'bandLabel').attr('x', (d)-> d[2])
        .attr('width', labelWidth).attr('height', labelHeight).style('opacity', 1);

      labels = bandLabels.append('text').attr('class', (d)-> d[1])
        .attr('id', (d)-> d[0]).attr('x', (d)-> d[3]).attr('y', yText)
        .attr('text-anchor', (d)-> d[0])

      labels.redraw = ( ->
        min = band.xScale.domain()[0]
        max = band.xScale.domain()[1]

        labels.text((d)-> d[4](min, max))
      )

      band.parts.push(labels)
      components.push(labels)

      timeline
    )

    timeline.tooltips = ((bandName)->
      band = bands[bandName]

      getHtml = ((element, d)->
        if element.attr('class') == 'interval'
          html = d.label + ': ' + toYear(d.start) + ' - ' + toYear(d.end)
        else
          html = d.label + ': ' + toYear(d.start)
        html
      )

      showTooltip = ((d)->
        x = if event.pageX < band.x + band.w / 2 then event.pageX + 10 else event.pageX - 110
        y = if event.pageY < band.y + band.h / 2 then event.pageY + 30 else event.pageY - 30

        tooltip.html(getHtml(d3.select(this), d)).style('top', y + 'px').style('left', x + 'px')
          .style('visibility', 'visible')
      )

      hideTooltip = -> tooltip.style('visibility', 'hidden')

      band.addActions([['mouseover', showTooltip], ['mouseout', hideTooltip]])

      timeline
    )

    timeline.xAxis = ((bandName, orientation)->
      band = bands[bandName]
      axis = d3.svg.axis().scale(band.xScale).orient(orientation || 'bottom')
        .tickSize(6, 0).tickFormat((d)-> toYear(d))

      xAxis = chart.append('g').attr('class', 'axis')
        .attr('transform', 'translate(0,' + (band.y + band.h)  + ')')

      xAxis.redraw = -> xAxis.call(axis)

      band.parts.push(xAxis)
      components.push(xAxis)

      timeline
    )


    timeline.brush = ((bandName, targetNames)->
      band = bands[bandName]
      brush = d3.svg.brush().x(band.xScale.range([0, band.w]))
        .on('brush', ( ->
          domain = if brush.empty() then band.xScale.domain() else brush.extent()
          targetNames.forEach((d)->
            bands[d].xScale.domain(domain)
            bands[d].redraw()
          )
        ))

      xBrush = band.g.append('svg').attr('class', 'x brush').call(brush)
      xBrush.selectAll('rect').attr('y', 4).attr('height', band.h - 4)

      timeline
    )

    timeline.redraw = ( ->
      components.forEach((component)->  component.redraw() )
    )

    timeline
  )

  d3.csv('/data/d3js/timeline/data.csv',(dataset)->
    timeline()
      .data(dataset).band('mainBand', 0.82).band('naviBand', 0.08).xAxis('mainBand')
      .tooltips('mainBand').xAxis('naviBand').labels('mainBand').labels('naviBand')
      .brush('naviBand', ['mainBand']).redraw()
  )

)

$(document).ready(ready)