import {
  GeoProjection,
  ScaleOrdinal,
  Selection,
  geoOrthographic,
  polygonArea,
  polygonHull,
  scaleOrdinal,
  schemePastel2,
  select,
  timer,
} from "d3"

import "./icosahedron.styl"

type IcosahedronOpts = {
  rootElId: string
}

type Position = [number, number, number]
type Point2D = [number, number]

type Hull = Point2D[]
type Face = Hull
type Faces = Face[]
type FaceWithPolygon = Face & {
  polygon: Hull
}

type SvgSelection = Selection<
  SVGSVGElement,
  FaceWithPolygon,
  HTMLElement,
  unknown
>

class Icosahedron {
  private rootElId: string

  private config!: {
    color: ScaleOrdinal<string, string, never>
    defaultVelocity: number[]
    height: number
    rotationFactor1: number
    rotationFactor2: number
    t0: number
    width: number
    zeroVelocity: number[]
  }

  private dom!: {
    faces: null | Selection<
      SVGPathElement,
      FaceWithPolygon,
      SVGSVGElement,
      unknown
    >
    projection: GeoProjection
    svg: SvgSelection
  }

  private vars!: {
    velocity: number[] | null
  }

  private static getIcosahedronFaces(): Faces {
    const faces: Faces = []
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

  public constructor(opts: IcosahedronOpts) {
    this.rootElId = opts.rootElId
    this.setConfig()
    this.setDom()
    this.setVars()

    const faces = this.dom.svg
      .selectAll("path")
      .data(Icosahedron.getIcosahedronFaces() as FaceWithPolygon[])
      .enter()
      .append("path")
      .each((d) => {
        d.polygon = polygonHull(d.map(this.dom.projection) as Faces[0]) as Hull
      })
      .style("fill", (_d: unknown, index: number) => {
        const color = this.config.color(`${index}`)

        return color
      })

    this.dom.faces = faces
    this.vars.velocity = this.config.defaultVelocity
  }

  public start() {
    timer(() => this.timer())
  }

  private setConfig() {
    const color = scaleOrdinal(schemePastel2)

    this.config = {
      color,
      defaultVelocity: [1, 0.4, 0.07],
      height: 500,
      rotationFactor1: 1 / 1000,
      rotationFactor2: 4,
      t0: Date.now(),
      width: (document.getElementById(
        this.rootElId
      ) as HTMLElement).getBoundingClientRect().width,
      zeroVelocity: [0, 0, 0],
    }
  }

  private setDom() {
    const rootEl = document.getElementById(this.rootElId) as HTMLElement

    rootEl.classList.add("icosahedron-chart")

    const projection = geoOrthographic().scale(this.config.height / 2 - 10)
    const svg = select(`#${this.rootElId}`)
      .append("svg")
      .attr("width", this.config.width)
      .attr("height", this.config.height) as SvgSelection

    this.dom = {
      faces: null,
      projection,
      svg,
    }
  }

  private setVars() {
    this.vars = {
      velocity: null,
    }
  }

  private calcNewPosition(time: number, position: Position): Position {
    const { velocity } = this.vars

    return [
      velocity![0] *
        Math.abs(
          Math.sin(time * this.config.rotationFactor1) *
            this.config.rotationFactor2
        ) +
        position[0],
      velocity![1] + position[1],
      position![2] + velocity![2],
    ]
  }

  private timer() {
    const time = Date.now() - this.config.t0
    const originalPos = this.dom.projection.rotate()

    this.dom.projection.rotate(this.calcNewPosition(time, originalPos))
    this.dom
      .faces!.each((d) =>
        d.forEach((p: [number, number], i: number) => {
          d.polygon[i] = this.dom.projection(p) as Point2D

          return null
        })
      )
      .style("display", (d) => {
        const area = polygonArea(d.polygon)

        if (area > 0) {
          return null
        }

        return "none"
      })
      .attr("d", (d) => `M${d.polygon.join("L")}Z`)
      .on("click", () => {
        if (
          this.vars.velocity?.toString() === this.config.zeroVelocity.toString()
        ) {
          this.vars.velocity = this.config.defaultVelocity

          return
        }

        this.vars.velocity = this.config.zeroVelocity
      })

    return null
  }
}

export default () => {
  const chart = new Icosahedron({
    rootElId: "chart",
  })

  chart.start()
}
