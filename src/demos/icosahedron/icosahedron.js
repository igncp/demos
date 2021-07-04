import * as d3 from "d3"

class Icosahedron {
  static icosahedronFaces() {
    const faces = []
    const y = (Math.atan2(1, 2) * 180) / Math.PI

    for (let x = 0; x < 360; x += 360 / 5) {
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

  constructor() {
    this.setConfig()
    this.setDom()
    this.setVars()
    this.dom.faces = this.dom.svg
      .selectAll("path")
      .data(Icosahedron.icosahedronFaces())
      .enter()
      .append("path")
      .each((d) => {
        d.polygon = d3.polygonHull(d.map(this.dom.projection))
      })
      .style("fill", (_d, index) => {
        const color = this.config.color(index)

        return color
      })
    this.vars.velocity = this.config.defaultVelocity
  }

  setConfig() {
    this.config = {
      color: d3.scaleOrdinal(d3.schemePastel2),
      defaultVelocity: [1, 0.4, 0.07],
      height: 500,
      rotationFactor1: 1 / 1000,
      rotationFactor2: 4,
      t0: Date.now(),
      width: $("#chart").innerWidth(),
      zeroVelocity: [0, 0, 0],
    }
  }

  setDom() {
    this.dom = {
      faces: "",
      projection: d3.geoOrthographic().scale(this.config.height / 2 - 10),
      svg: d3
        .select("#chart")
        .append("svg")
        .attr("width", this.config.width)
        .attr("height", this.config.height),
    }
  }

  setVars() {
    this.vars = {
      velocity: "",
    }
  }

  calcNewPosition(velocity, time, position) {
    return [
      velocity[0] *
        Math.abs(
          Math.sin(time * this.config.rotationFactor1) *
            this.config.rotationFactor2
        ) +
        position[0],
      velocity[1] + position[1],
      position[2] + velocity[2],
    ]
  }

  timer() {
    const time = Date.now() - this.config.t0
    const originalPos = this.dom.projection.rotate()

    this.dom.projection.rotate(
      this.calcNewPosition(this.vars.velocity, time, originalPos)
    )
    this.dom.faces
      .each((d) =>
        d.forEach((p, i) => {
          d.polygon[i] = this.dom.projection(p)

          return null
        })
      )
      .style("display", (d) => {
        const area = d3.polygonArea(d.polygon)

        if (area > 0) {
          return null
        }

        return "none"
      })
      .attr("d", (d) => `M${d.polygon.join("L")}Z`)
      .on("click", () => {
        if (String(this.vars.velocity) === String(this.config.zeroVelocity)) {
          this.vars.velocity = this.config.defaultVelocity

          return
        }

        this.vars.velocity = this.config.zeroVelocity
      })

    return null
  }

  start() {
    d3.timer(() => this.timer())
  }
}

export default () => {
  const chart = new Icosahedron()

  chart.start()
}
