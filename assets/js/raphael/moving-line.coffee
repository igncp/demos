ready = ( ->
  $.ajax('/data/raphael/moving-line/data.json').done((graphData)->
    initLineGraph = ( ->
      width = $('#chart').width()
      height = 300
      
      paper = Raphael('chart', width, height)
      
      graphData.paper = paper
      path = createPathString(graphData)
      line = paper.path(path)
      graphData.line = line

      drawPoints(graphData)
      
      setInterval(advanceGraph, 4000)
    )

    advanceGraph = ( ->
      if graphData.current < graphData.charts.length - 1 then graphData.current++
      else graphData.current = 1
      
      animateChart(graphData, graphData.charts[graphData.current])
    )

    drawPoints = ((data)->
      radius = 6
      points = data.charts[0].points
      
      i = 0
      length = points.length

      while i < length
        xPos = data.xOffset + (i * data.xDelta)
        yPos = data.yOffset
        
        circle = data.paper.circle(xPos, yPos, radius)
        circle.node.className.baseVal = 'point'
        circle.attr({title: 'Value: ' + 0})

        points[i].point = circle
        i++
    )

    animateChart = ((data, newData)->
      newPath = ''
      upperLimit = parseInt(newData.upper) or 1
      lowerLimit = parseInt(newData.lower) or 0
      scaleFactor = data.yOffset / (upperLimit - lowerLimit)
      points = data.charts[0].points
      
      i = 0
      length = points.length

      while i < length
        if i is 0
          newPath += 'M '
          newPath += data.xOffset + ' '
          newPath += data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor) + ' '
        else
          newPath += 'L '
          newPath += data.xOffset + (i * data.xDelta) + ' '
          newPath += data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor)
        
        points[i].point.animate({
          cy: data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor)
        }, 800, 'ease-in-out')
        
        points[i].point.node.childNodes[0].remove() # Clear circle content
        points[i].point.attr('title', 'Value: ' + newData.points[i].value)
        i++
      
      data.line.animate({path : newPath}, 800, 'ease-in-out')
    )

    createPathString = ((data)->
      points = data.charts[data.current].points
      path = 'M ' + data.xOffset + ' ' + (data.yOffset - points[0].value)
      prevY = data.yOffset - points[0].value

      i = 0
      length = points.length

      while i < length
        path += ' L '
        path += data.xOffset + (i * data.xDelta) + ' '
        path += (data.yOffset - points[i].value)

        prevY = data.yOffset - points[i].value
        i++
      path
    )
    
    initLineGraph()
  )
)

$(document).ready(ready)