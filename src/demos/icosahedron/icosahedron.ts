import {
  GeoProjection,
  Selection,
  geoOrthographic,
  polygonArea,
  polygonHull,
  scaleOrdinal,
  schemePastel2,
  select,
  timer,
} from "d3"

import * as styles from "./icosahedron.module.css"

const CONTAINER_ID = "chart"

type IcosahedronOpts = {
  rootElId: string
}

type Position = [number, number, number]
type Point2D = [number, number]

type Hull = Point2D[]
type Face = Hull
type FaceWithPolygon = Face & {
  faceIndex: number
  polygon?: Hull
}

class Icosahedron {
  private readonly rootElId: string

  private readonly config: Readonly<{
    defaultVelocity: number[]
    height: number
    rotationFactor1: number
    rotationFactor2: number
    t0: number
    zeroVelocity: number[]
  }>

  private dom!: {
    faces: Selection<SVGPathElement, FaceWithPolygon, SVGGElement, unknown>
    gSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
    projection: GeoProjection
    svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  }

  private vars!: {
    selectedIndex: number | null
    velocity: number[] | null
  }

  public constructor(opts: IcosahedronOpts) {
    this.rootElId = opts.rootElId

    this.config = {
      defaultVelocity: [1, 0.4, 0.07],
      height: 500,
      rotationFactor1: 1 / 1000,
      rotationFactor2: 4,
      t0: Date.now(),
      zeroVelocity: [0, 0, 0],
    }

    this.setVars()
    this.setDom()
    this.setDimensions()

    window.addEventListener("resize", this.handleResize)
  }

  private static getIcosahedronFaces(): FaceWithPolygon[] {
    const faces: Face[] = []
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

    return faces.map((...[face, faceIndex]) =>
      Object.assign(face, {
        faceIndex,
      })
    )
  }

  public start() {
    timer(() => this.timer())
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  private setDom() {
    const rootEl = document.getElementById(this.rootElId) as HTMLElement

    rootEl.classList.add(styles.icosahedronChart)

    const projection = geoOrthographic().scale(this.config.height / 2 - 10)
    const svg = select(`#${this.rootElId}`)
      .append("svg")
      .attr("height", this.config.height)

    const gSel = svg.append("g")

    const color = scaleOrdinal<number, string>(schemePastel2)
    const highlightColor = "orange"
    const { vars } = this

    const setColor = (faceData: FaceWithPolygon) => {
      if (vars.selectedIndex === faceData.faceIndex) {
        return highlightColor
      }

      return color(faceData.faceIndex)
    }

    const faces = gSel
      .selectAll("path")
      .data<FaceWithPolygon>(Icosahedron.getIcosahedronFaces())
      .enter()
      .append("path")
      .each((face) => {
        face.polygon = polygonHull(face.map(projection) as Face)!
      })
      .style("fill", setColor)
      .on("mouseenter", function handleMouseEnter() {
        select(this).style("fill", highlightColor)
      })
      .on("mouseleave", function handleMouseLeave() {
        select<SVGPathElement, FaceWithPolygon>(this).style("fill", setColor)
      })
      .on("click", (...[, face]) => {
        if (this.vars.selectedIndex === face.faceIndex) {
          this.vars.velocity = this.config.defaultVelocity
          this.vars.selectedIndex = null
        } else {
          this.vars.velocity = this.config.zeroVelocity
          this.vars.selectedIndex = face.faceIndex
        }

        faces.style("fill", setColor)
      })

    this.dom = {
      faces,
      gSel,
      projection,
      svg,
    }
  }

  private setDimensions() {
    const polygonSize = 475
    const { width } = (
      document.getElementById(this.rootElId) as HTMLElement
    ).getBoundingClientRect()

    this.dom.svg.attr("width", width)

    const scale = width < polygonSize ? 0.5 : 1
    const verticalTranslate = scale !== 1 ? (polygonSize * scale) / 2 : 0

    this.dom.gSel.attr(
      "transform",
      `translate(${
        width / 2 - polygonSize * scale
      }, ${verticalTranslate}) scale(${scale})`
    )
  }

  private setVars() {
    this.vars = {
      selectedIndex: null,
      velocity: this.config.defaultVelocity,
    }
  }

  private calcNewPosition({
    position,
    time,
  }: {
    position: Position
    time: number
  }): Position {
    const {
      vars: { velocity },
    } = this

    return [
      velocity![0] *
        Math.abs(
          Math.sin(time * this.config.rotationFactor1) *
            this.config.rotationFactor2
        ) +
        position[0],
      velocity![1] + position[1],
      position[2] + velocity![2],
    ]
  }

  private timer() {
    const time = Date.now() - this.config.t0
    const originalPos = this.dom.projection.rotate()

    this.dom.projection.rotate(
      this.calcNewPosition({ position: originalPos, time })
    )

    this.dom.faces
      .each((face) => {
        face.forEach((...[point, pointIndex]: [Point2D, number]) => {
          face.polygon![pointIndex] = this.dom.projection(point) as Point2D

          return null
        })
      })
      .style("display", (face) => {
        const area = polygonArea(face.polygon!)

        if (area > 0) {
          return null
        }

        return "none"
      })
      .attr("d", (face) => `M${face.polygon!.join("L")}Z`)

    return null
  }

  private readonly handleResize = () => {
    this.setDimensions()
  }
}

const main = () => {
  const chart = new Icosahedron({
    rootElId: CONTAINER_ID,
  })

  chart.start()

  return Promise.resolve()
}

export { CONTAINER_ID }

export default main
