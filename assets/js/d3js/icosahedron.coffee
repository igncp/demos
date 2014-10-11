window.Charts = window.Charts || {}
window.Charts.d3js = window.Charts.d3js || {}
window.Charts.d3js.icosahedron = window.Charts.d3js.icosahedron || {}

ch = window.Charts.d3js.icosahedron

ch.setCg = -> ch.cg =
  width: $('#chart').innerWidth()
  height: 500
  defaultVelocity: [1, .4, .07]
  zeroVelocity: [0,0,0]
  t0: Date.now()
  color: d3.scale.category20()
  rotationFactor1: 1 / 1000
  rotationFactor2: 4

ch.setDom = -> ch.dom =
  projection: d3.geo.orthographic().scale(ch.cg.height / 2 - 10)
  svg: d3.select('#chart').append('svg')
    .attr('width', ch.cg.width).attr('height', ch.cg.height)
  faces: ''

ch.setVars = -> ch.vars =
  velocity: ''

ch.icosahedronFaces = ->
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

# Calculates a 3D rotation (sinusoidal in x)
ch.calcNewPosition = (velocity, time, position)->
  [
    velocity[0] * Math.abs(Math.sin(time * ch.cg.rotationFactor1) * ch.cg.rotationFactor2) + \
      position[0],
    velocity[1] + position[1],
    position[2] + velocity[2]
  ]

ch.timer = ->
  time = Date.now() - ch.cg.t0
  originalPos = ch.dom.projection.rotate()
  
  ch.dom.projection.rotate(ch.calcNewPosition(ch.vars.velocity, time, originalPos))
  
  ch.dom.faces.each((d)-> d.forEach((p, i)-> d.polygon[i] = ch.dom.projection(p); null))
    .style('display', (d)-> if d.polygon.area() > 0 then return null else return 'none')
    .attr('d', (d)-> 'M' + d.polygon.join('L') + 'Z')
    .on('click', ->
      if String(ch.vars.velocity) == String(ch.cg.zeroVelocity)
        ch.vars.velocity = ch.cg.defaultVelocity
      else ch.vars.velocity = ch.cg.zeroVelocity
    )

  null

ch.ready =  ->
  ch.setCg()
  ch.setDom()
  ch.setVars()
   
  ch.dom.faces = ch.dom.svg.selectAll('path').data(ch.icosahedronFaces).enter()
    .append('path').each((d)->
      d.polygon = d3.geom.polygon(d.map(ch.dom.projection))
    ).style({fill: (d, index)-> ch.cg.color(index) })
  
  ch.vars.velocity = ch.cg.defaultVelocity
  d3.timer(ch.timer)

# Necessary for testing
window.Charts.d3js.icosahedron.refreshAlias = ->
  ch = window.Charts.d3js.icosahedron