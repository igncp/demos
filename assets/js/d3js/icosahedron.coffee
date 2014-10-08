window.Charts = window.Charts || {}
window.Charts.d3js = window.Charts.d3js || {}
window.Charts.d3js.icosahedron = window.Charts.d3js.icosahedron || {}

chart = window.Charts.d3js.icosahedron

chart.icosahedronFaces = ->
  faces = []
  y = Math.atan2(1, 2) * 180 / Math.PI

  for x in [0...360] by 72
    faces.push(
      [[x +  0, -90], [x +  0,  -y], [x + 72,  -y]],
      [[x + 36,   y], [x + 72,  -y], [x +  0,  -y]],
      [[x + 36,   y], [x +  0,  -y], [x - 36,   y]],
      [[x + 36,   y], [x - 36,   y], [x - 36,  90]]
    )

  faces

chart.ready =  ->
  width = $('#chart').innerWidth()
  height = 500
 
  defaultVelocity = [1, .4, .07]
  zeroVelocity = [0,0,0]
  velocity = defaultVelocity
  t0 = Date.now()
  color = d3.scale.category20()
   
  projection = d3.geo.orthographic().scale(height / 2 - 10)
   
  svg = d3.select('#chart').append('svg')
    .attr('width', width).attr('height', height)
   
  face = svg.selectAll('path').data(@icosahedronFaces).enter().append('path').each((d)->
    d.polygon = d3.geom.polygon(d.map(projection))
  ).style({fill: (d, index)-> color(index) })
   
  d3.timer( ->
    time = Date.now() - t0
    originalPos = projection.rotate()
    projection.rotate([
      velocity[0] * Math.abs(Math.sin(time / 1000) * 4) + originalPos[0],
      velocity[1] + originalPos[1],
      originalPos[2] + velocity[2]
    ])
   
    face.each((d)-> d.forEach((p, i)-> d.polygon[i] = projection(p); return null))
    .style('display', (d)-> if d.polygon.area() > 0 then return null else return 'none')
    .attr('d', (d)-> 'M' + d.polygon.join('L') + 'Z')
    .on('click', -> if String(velocity) == String(zeroVelocity) then \
      velocity = defaultVelocity else velocity = zeroVelocity)
    
    null
  )