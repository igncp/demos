ready = ( ->
  width = 700
  height = 300
  stroke_width = 3
  paper = Raphael('chart', width, height)

  Raphael.fn.arc = ((startX, startY, endX, endY, radius1, radius2, angle)->
    arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(' ')
    
    @path('M' + startX + ' ' + startY + ' a ' + arcSVG)
  )

  Raphael.fn.circularArc = ((centerX, centerY, radius, startAngle, endAngle)->
    startX = centerX + radius * Math.cos(startAngle * Math.PI / 180)
    startY = centerY + radius * Math.sin(startAngle * Math.PI / 180)
    endX = centerX + radius * Math.cos(endAngle * Math.PI / 180)
    endY = centerY + radius * Math.sin(endAngle * Math.PI / 180)
    
    @arc(startX, startY, endX - startX, endY - startY, radius, radius, 0)
  )

  hoverFn = ((el)->
    width_multiplier = 2.5
    el.hover(( ->
      @attr({'fill-opacity': '.3'})
      @animate({ 'stroke-width': stroke_width * width_multiplier }, 500, 'bounce')
    ),( ->
      @attr({'fill-opacity': '.2'})
      @animate({ 'stroke-width': stroke_width }, 500, 'bounce')
    ))
  )

  arcI = -1 # Arc index
  createArc = ((stroke, fill)->
    arcI++
    center = (width / (4 + arcI)) + (stroke_width - 1)
    
    arc = paper.circularArc(center + 30 + Math.pow(arcI,1.5), height - (100 - arcI * 2), \
      width / (4 + arcI), 180, 0)
    
    arc.attr({
      'stroke': stroke,
      'stroke-width': stroke_width,
      'fill': fill,
      'fill-opacity': '.2'
    })

    hoverFn(arc)
    arc
  )

  for i in [0..30]
    createArc('#558857', '#85D588')
)

$(document).ready(ready)