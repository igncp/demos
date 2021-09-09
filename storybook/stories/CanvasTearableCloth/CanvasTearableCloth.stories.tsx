import { select } from "d3"
import React from "react"

import {
  StoryInfo,
  TemplateType,
  canvasDocs,
  createRangeControl,
} from "../common"

type Props = {
  clothHeight: number
  clothWidth: number
  gravity: number
  mouseCut: number
  mouseInfluence: number
  physicsAccuracy: number
  spacing: number
  startY: number
  tearDistance: number
}

const ROOT_ID = "example"

const pointDelta = 0.016
const pointDeltaSquare = pointDelta * pointDelta

const loopReversed = <ArrayLike extends unknown[]>(
  itemsList: ArrayLike,
  fn: (listItem: ArrayLike[0]) => void
  // eslint-disable-next-line max-params
): void => {
  itemsList.slice().reverse().forEach(fn)
}

type MouseState = {
  button: number
  down: boolean
  px: number
  py: number
  x: number
  y: number
}

type IConstraint = {
  draw: (ctx: CanvasRenderingContext2D) => void
  resolve: (tearDistance: number) => void
}

class Point<PointConstraint extends IConstraint> {
  public x: number
  public y: number
  public px: number
  public py: number

  private pinX: number | null
  private pinY: number | null
  private constraints: PointConstraint[]
  private vx: number
  private vy: number

  public constructor({ x, y }: { x: number; y: number }) {
    this.x = x
    this.y = y
    this.px = x
    this.py = y

    this.pinX = null
    this.pinY = null
    this.constraints = []
    this.vx = 0
    this.vy = 0
  }

  public update({
    gravity,
    mouseCut,
    mouseInfluence,
    mouseState,
  }: {
    gravity: number
    mouseCut: number
    mouseInfluence: number
    mouseState: MouseState
  }) {
    if (mouseState.down) {
      const diffX = this.x - mouseState.x
      const diffY = this.y - mouseState.y
      const dist = Math.sqrt(diffX * diffX + diffY * diffY)

      if (mouseState.button === 1) {
        if (dist < mouseInfluence) {
          this.px = this.x - (mouseState.x - mouseState.px) * 1.8
          this.py = this.y - (mouseState.y - mouseState.py) * 1.8
        }
      } else if (dist < mouseCut) {
        this.constraints = []
      }
    }

    this.addForce({ x: 0, y: gravity })

    const newX =
      this.x + (this.x - this.px) * 0.99 + (this.vx / 2) * pointDeltaSquare
    const newY =
      this.y + (this.y - this.py) * 0.99 + (this.vy / 2) * pointDeltaSquare

    this.px = this.x
    this.py = this.y

    this.x = newX
    this.y = newY

    this.vx = 0
    this.vy = 0
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.constraints.length) {
      return
    }

    loopReversed(this.constraints, (constraint) => {
      constraint.draw(ctx)
    })
  }

  public resolveConstraints({
    boundsX,
    boundsY,
    tearDistance,
  }: {
    boundsX: number
    boundsY: number
    tearDistance: number
  }) {
    if (this.pinX !== null && this.pinY !== null) {
      this.x = this.pinX
      this.y = this.pinY

      return
    }

    loopReversed(this.constraints, (constraint) => {
      constraint.resolve(tearDistance)
    })

    if (this.x > boundsX) {
      this.x = 2 * boundsX - this.x
    } else if (1 > this.x) {
      this.x = 2 - this.x
    }

    if (this.y < 1) {
      this.y = 2 - this.y
    } else if (this.y > boundsY) {
      this.y = 2 * boundsY - this.y
    }
  }

  public attach(constraint: PointConstraint) {
    this.constraints.push(constraint)
  }

  public removeConstraint(constraint: PointConstraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1)
  }

  public addForce({ x, y }: { x: number; y: number }) {
    this.vx += x
    this.vy += y

    const round = 400

    this.vx = Math.floor(this.vx * round) / round
    this.vy = Math.floor(this.vy * round) / round
  }

  public pin({ pinX, pinY }: { pinX: number; pinY: number }) {
    this.pinX = pinX
    this.pinY = pinY
  }
}

class Constraint {
  private readonly point1: Point<Constraint>
  private readonly point2: Point<Constraint>
  private readonly length: number

  public constructor({
    point1,
    point2,
    spacing,
  }: {
    point1: Point<Constraint>
    point2: Point<Constraint>
    spacing: number
  }) {
    this.point1 = point1
    this.point2 = point2
    this.length = spacing
  }

  public resolve(tearDistance: number) {
    const diffX = this.point1.x - this.point2.x
    const diffY = this.point1.y - this.point2.y
    const distance = Math.sqrt(diffX * diffX + diffY * diffY)
    const diff = (this.length - distance) / distance

    if (distance > tearDistance) {
      this.point1.removeConstraint(this)
    }

    const halfDiff = diff / 2
    const px = diffX * halfDiff
    const py = diffY * halfDiff

    this.point1.x += px
    this.point1.y += py
    this.point2.x -= px
    this.point2.y -= py
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.point1.x, this.point1.y)
    ctx.lineTo(this.point2.x, this.point2.y)
  }
}

const main = ({
  clothHeight,
  clothWidth,
  gravity,
  mouseCut,
  mouseInfluence,
  physicsAccuracy,
  spacing,
  startY,
  tearDistance,
}: Props) => {
  const { width } = (
    document.getElementById(ROOT_ID) as HTMLElement
  ).getBoundingClientRect()
  const height = 400

  const canvasEl = select(`#${ROOT_ID}`)
    .text("")
    .append("canvas")
    .attr("height", height)
    .attr("width", width)
    .node() as HTMLCanvasElement

  const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

  ctx.strokeStyle = "#333"

  const boundsX = width - 1
  const boundsY = height - 1

  const state = {
    isStopped: false,
  }

  const mouseState: MouseState = {
    button: 1,
    down: false,
    px: 0,
    py: 0,
    x: 0,
    y: 0,
  }

  class Cloth {
    private readonly points: Array<Point<Constraint>>

    public constructor() {
      this.points = []

      this.generatePoints()
    }

    public update() {
      let physicalRound = physicsAccuracy

      while (physicalRound) {
        loopReversed(this.points, (point) => {
          point.resolveConstraints({
            boundsX,
            boundsY,
            tearDistance,
          })
        })

        physicalRound -= 1
      }

      loopReversed(this.points, (point) => {
        point.update({
          gravity,
          mouseCut,
          mouseInfluence,
          mouseState,
        })
      })
    }

    public draw() {
      ctx.beginPath()

      loopReversed(this.points, (point) => {
        point.draw(ctx)
      })

      ctx.stroke()
    }

    private generatePoints() {
      const startX = width / 2 - (clothWidth * spacing) / 2

      for (let y = 0; y <= clothHeight; y += 1) {
        for (let x = 0; x <= clothWidth; x += 1) {
          const newPoint = new Point<Constraint>({
            x: startX + x * spacing,
            y: startY + y * spacing,
          })

          if (x !== 0) {
            const {
              points: { [this.points.length - 1]: pointLeft },
            } = this

            const constraint = new Constraint({
              point1: newPoint,
              point2: pointLeft,
              spacing,
            })

            newPoint.attach(constraint)
          }

          if (y === 0) {
            newPoint.pin({ pinX: newPoint.x, pinY: newPoint.y })
          } else {
            const {
              points: { [x + (y - 1) * (clothWidth + 1)]: pointAbove },
            } = this

            const constraint = new Constraint({
              point1: newPoint,
              point2: pointAbove,
              spacing,
            })

            newPoint.attach(constraint)
          }

          this.points.push(newPoint)
        }
      }
    }
  }

  const cloth = new Cloth()

  canvasEl.onmousedown = (mouseEvent) => {
    mouseEvent.preventDefault()

    mouseState.button = mouseEvent.which
    mouseState.px = mouseState.x
    mouseState.py = mouseState.y

    const rect = canvasEl.getBoundingClientRect()

    mouseState.x = mouseEvent.clientX - rect.left
    mouseState.y = mouseEvent.clientY - rect.top
    mouseState.down = true
  }

  canvasEl.onmouseup = (mouseEvent) => {
    mouseEvent.preventDefault()
    mouseState.down = false
  }

  canvasEl.onmousemove = (mouseEvent) => {
    mouseEvent.preventDefault()

    mouseState.px = mouseState.x
    mouseState.py = mouseState.y

    const rect = canvasEl.getBoundingClientRect()

    mouseState.x = mouseEvent.clientX - rect.left
    mouseState.y = mouseEvent.clientY - rect.top
  }

  canvasEl.oncontextmenu = (mouseEvent) => {
    mouseEvent.preventDefault()
  }

  const loop = () => {
    if (state.isStopped) {
      return
    }

    ctx.clearRect(0, 0, width, height)

    cloth.update()
    cloth.draw()

    requestAnimationFrame(loop)
  }

  loop()

  return {
    stop: () => {
      state.isStopped = true
    },
  }
}

const CanvasTearableCloth = (props: Props) => {
  React.useEffect(() => {
    const { stop } = main(props)

    return stop
  })

  return (
    <div>
      <StoryInfo
        docs={[
          {
            link: "https://en.wikipedia.org/wiki/Verlet_integration",
            name: "Verlet Integration",
          },
          canvasDocs.clearRect,
        ]}
        source="https://codepen.io/dissimulate/pen/KrAwx"
        storyName="CanvasTearableCloth"
      />
      <p>The left and right mouse buttons have different behaviors</p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <CanvasTearableCloth {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [clothHeightArgs, clothHeightControls] = createRangeControl({
  diffMin: 25,
  initialValue: 30,
  step: 1,
})
const [clothWidthArgs, clothWidthControls] = createRangeControl({
  diffMax: 150,
  diffMin: 49,
  initialValue: 50,
  step: 1,
})

const args: Props = {
  clothHeight: clothHeightArgs,
  clothWidth: clothWidthArgs,
  gravity: 1200,
  mouseCut: 5,
  mouseInfluence: 20,
  physicsAccuracy: 3,
  spacing: 7,
  startY: 20,
  tearDistance: 60,
}

Common.args = args

export default {
  argTypes: {
    clothHeight: clothHeightControls,
    clothWidth: clothWidthControls,
  },
  component: CanvasTearableCloth,
  title: "Canvas/Cloth",
}
