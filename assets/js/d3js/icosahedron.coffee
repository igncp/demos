ready = ()->

  icosahedronFaces = (()->
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
  )

  width = $('#chart').innerWidth()
  height = 500
 
  velocity = [.010, .005]
  t0 = Date.now()
   
  projection = d3.geo.orthographic().scale(height / 2 - 10)
   
  svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
   
  face = svg.selectAll("path").data(icosahedronFaces).enter().append("path").each((d)-> d.polygon = d3.geom.polygon(d.map(projection)))
   
  d3.timer(()->
    time = Date.now() - t0
    projection.rotate([time * velocity[0], time * velocity[1]])
   
    face.each((d)-> d.forEach((p, i)-> d.polygon[i] = projection(p); return null)).style("display", (d)-> if d.polygon.area() > 0 then return null else return "none")
    .attr("d", (d)-> "M" + d.polygon.join("L") + "Z")
    return null
  )

$(document).ready(ready)