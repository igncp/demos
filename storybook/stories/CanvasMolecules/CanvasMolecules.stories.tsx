import { select } from "d3"
import React from "react"

import { StoryInfo, TemplateType, canvasDocs } from "../common"

type Props = {
  count: number
  interactionDistance: number
  interactionLineWidth: number
  radiusBase: number
  speedBase: number
}

const ROOT_ID = "example"

const colors = ["#f35d4f", "#f36849", "#c0d988", "#6ddaf1", "#f1e85b"]

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

type CanvasBoundaries = {
  height: number
  width: number
}

type ParticleOpts = CanvasBoundaries & {
  id: number
  radiusBase: number
  speedBase: number
  x?: number
  y?: number
}

class Particle {
  public x: number
  public y: number
  public radius: number
  public color: string
  public vx: number
  public vy: number

  private readonly id: number

  public constructor({
    height,
    id,
    radiusBase,
    speedBase,
    width,
    x,
    y,
  }: ParticleOpts) {
    this.id = id
    this.x = x ?? Math.round(Math.random() * width)
    this.y = y ?? Math.round(Math.random() * height)
    this.radius = Math.random() * radiusBase + 1
    this.color = colors[getRandomInt(0, colors.length)]
    this.vx = Math.random() * speedBase - speedBase / 2
    this.vy = Math.random() * speedBase - speedBase / 2
  }

  public updatePosition({ height, width }: CanvasBoundaries) {
    this.x += this.vx
    this.y += this.vy

    if (this.x > width) {
      this.x = 0
    } else if (this.x < 0) {
      this.x = width
    }

    if (this.y > height) {
      this.y = 0
    } else if (this.y < 0) {
      this.y = height
    }
  }

  public shouldInteractWithParticle(
    otherParticle: Particle,
    interactionDistance: number
  ): boolean {
    return (
      this.id !== otherParticle.id &&
      this.color === otherParticle.color &&
      this.findDistance(otherParticle) < interactionDistance
    )
  }

  private findDistance(otherParticle: Particle): number {
    return Math.sqrt(
      Math.pow(otherParticle.x - this.x, 2) +
        Math.pow(otherParticle.y - this.y, 2)
    )
  }
}

const main = ({
  count,
  interactionDistance,
  interactionLineWidth,
  radiusBase,
  speedBase,
}: Props) => {
  const { width } = (document.getElementById(
    ROOT_ID
  ) as HTMLElement).getBoundingClientRect()
  const height = 500

  const particleArgs = {
    height,
    radiusBase,
    speedBase,
    width,
  }

  const canvasEl = select(`#${ROOT_ID}`)
    .text("")
    .append("canvas")
    .attr("height", height)
    .attr("width", width)
    .style("background", "#000")
    .node() as HTMLCanvasElement

  const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

  const particles: Particle[] = Array.from({ length: count }).map(
    (_, idx) =>
      new Particle({
        ...particleArgs,
        id: idx,
      })
  )

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = "lighter"

    particles.forEach((particleA) => {
      let radiusFactor = 1

      ctx.fillStyle = particleA.color
      ctx.strokeStyle = particleA.color

      particles.forEach((particleB) => {
        if (
          particleA.shouldInteractWithParticle(particleB, interactionDistance)
        ) {
          ctx.beginPath()
          ctx.lineWidth = interactionLineWidth
          ctx.moveTo(particleA.x, particleA.y)
          ctx.lineTo(particleB.x, particleB.y)
          ctx.stroke()

          radiusFactor += 1
        }
      })

      ctx.beginPath()
      ctx.arc(
        particleA.x,
        particleA.y,
        particleA.radius * radiusFactor,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(
        particleA.x,
        particleA.y,
        (particleA.radius + 5) * radiusFactor,
        0,
        Math.PI * 2
      )
      ctx.stroke()
      ctx.closePath()

      particleA.updatePosition({ height, width })
    })
  }

  canvasEl.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()

    const rect = canvasEl.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    particles.push(
      new Particle({
        ...particleArgs,
        id: particles.length,
        x,
        y,
      })
    )
  })

  let isStopped = false

  const loop = () => {
    if (isStopped) {
      return
    }

    draw()
    requestAnimationFrame(loop)
  }

  loop()

  return {
    stop: () => {
      isStopped = true
    },
  }
}

const CanvasMolecules = (props: Props) => {
  React.useEffect(() => {
    const { stop } = main(props)

    return stop
  })

  return (
    <div>
      <StoryInfo
        docs={[
          canvasDocs.arc,
          canvasDocs.clearRect,
          canvasDocs.globalCompositeOperation,
        ]}
        source="https://codepen.io/eltonkamami/pen/ECrKd"
        storyName="CanvasMolecules"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <CanvasMolecules {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const args: Props = {
  count: 500,
  interactionDistance: 50,
  interactionLineWidth: 0.5,
  radiusBase: 1,
  speedBase: 3,
}

Common.args = args

export default {
  argTypes: {},
  component: CanvasMolecules,
  title: "Canvas/Molecules",
}
