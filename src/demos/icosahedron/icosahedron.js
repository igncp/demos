const ch = {}

ch.setCg = function () {
  ch.cg = {
    color: d3.scale.category20(),
    defaultVelocity: [1, 0.4, 0.07],
    height: 500,
    rotationFactor1: 1 / 1000,
    rotationFactor2: 4,
    t0: Date.now(),
    width: $("#chart").innerWidth(),
    zeroVelocity: [0, 0, 0],
  }
}

ch.setDom = function () {
  ch.dom = {
    faces: "",
    projection: d3.geo.orthographic().scale(ch.cg.height / 2 - 10),
    svg: d3
      .select("#chart")
      .append("svg")
      .attr("width", ch.cg.width)
      .attr("height", ch.cg.height),
  }
}

ch.setVars = function () {
  ch.vars = {
    velocity: "",
  }
}

ch.icosahedronFaces = function () {
  const faces = []
  const y = (Math.atan2(1, 2) * 180) / Math.PI

  for (let x = 0; x < 360; x += 72) {
    faces.push(
      [
        [x + 0, -90],
        [x + 0, -y],
        [x + 72, -y],
      ],
      [
        [x + 36, y],
        [x + 72, -y],
        [x + 0, -y],
      ],
      [
        [x + 36, y],
        [x + 0, -y],
        [x - 36, y],
      ],
      [
        [x + 36, y],
        [x - 36, y],
        [x - 36, 90],
      ]
    )
  }

  return faces
}

ch.calcNewPosition = function (velocity, time, position) {
  return [
    velocity[0] *
      Math.abs(Math.sin(time * ch.cg.rotationFactor1) * ch.cg.rotationFactor2) +
      position[0],
    velocity[1] + position[1],
    position[2] + velocity[2],
  ]
}

ch.timer = function () {
  const time = Date.now() - ch.cg.t0
  const originalPos = ch.dom.projection.rotate()

  ch.dom.projection.rotate(
    ch.calcNewPosition(ch.vars.velocity, time, originalPos)
  )
  ch.dom.faces
    .each((d) =>
      d.forEach((p, i) => {
        d.polygon[i] = ch.dom.projection(p)

        return null
      })
    )
    .style("display", (d) => {
      if (d.polygon.area() > 0) {
        return null
      }

      return "none"
    })
    .attr("d", (d) => `M${d.polygon.join("L")}Z`)
    .on("click", () => {
      if (String(ch.vars.velocity) === String(ch.cg.zeroVelocity)) {
        ch.vars.velocity = ch.cg.defaultVelocity
      }

      ch.vars.velocity = ch.cg.zeroVelocity
    })

  return null
}

ch.ready = function () {
  ch.setCg()
  ch.setDom()
  ch.setVars()
  ch.dom.faces = ch.dom.svg
    .selectAll("path")
    .data(ch.icosahedronFaces)
    .enter()
    .append("path")
    .each((d) => {
      d.polygon = d3.geom.polygon(d.map(ch.dom.projection))
    })
    .style({
      fill(_d, index) {
        return ch.cg.color(index)
      },
    })
  ch.vars.velocity = ch.cg.defaultVelocity

  return d3.timer(ch.timer)
}

export default () => {
  ch.ready()
}
