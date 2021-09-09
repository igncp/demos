import { select } from "d3"
import React from "react"

import { StoryInfo, TemplateType, canvasDocs } from "../common"

type Props = {
  clearAlpha: number
  count: number
  displayLight: boolean
  displayOrbitals: boolean
  jitterHue: number
  jitterRadius: number
  lightAlpha: number
  orbitalAlpha: number
  scale: number
  speed: number
}

const ROOT_ID = "example"

const random = ({ max, min }: { max: number; min: number }) =>
  Math.random() * (max - min) + min
const innerRadius = 300

const main = ({
  clearAlpha,
  count,
  displayLight,
  displayOrbitals,
  jitterHue,
  jitterRadius,
  lightAlpha,
  orbitalAlpha,
  scale,
  speed,
}: Props) => {
  const { width } = (
    document.getElementById(ROOT_ID) as HTMLElement
  ).getBoundingClientRect()
  const height = 500

  const canvasEl = select(`#${ROOT_ID}`)
    .text("")
    .append("canvas")
    .attr("height", height)
    .attr("width", width)
    .style("background", "#000")
    .node() as HTMLCanvasElement

  const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

  const center = {
    x: width / 2,
    y: height / 2,
  } as const

  let dt = 1
  let t = Date.now()

  class Orb {
    private angle: number
    private lastAngle: number
    private readonly radius: number
    private readonly size: number
    private readonly speed: number
    private x: number
    private y: number

    public constructor({ x, y }: { x: number; y: number }) {
      const dx = x / scale - center.x / scale
      const dy = y / scale - center.y / scale

      this.x = x
      this.y = y

      this.angle = Math.atan2(dy, dx)
      this.lastAngle = this.angle
      this.radius = Math.sqrt(dx * dx + dy * dy)
      this.size = this.radius / innerRadius + 1
      this.speed = (random({ max: 10, min: 1 }) / 300000) * this.radius + 0.015
    }

    public update() {
      this.lastAngle = this.angle
      this.angle += this.speed * (speed / 50) * dt
      this.x = this.radius * Math.cos(this.angle)
      this.y = this.radius * Math.sin(this.angle)
    }

    public render() {
      if (displayOrbitals) {
        let radius =
          jitterRadius === 0
            ? this.radius
            : this.radius + random({ max: jitterRadius, min: -jitterRadius })

        radius = jitterRadius !== 0 && radius < 0 ? 0.001 : radius

        ctx.strokeStyle = `hsla(${[
          (this.angle + 90) / (Math.PI / 180) +
            random({ max: jitterHue, min: -jitterHue }),
          "100%",
          "50%",
          orbitalAlpha / 100,
        ].join(", ")})`
        ctx.lineWidth = this.size
        ctx.beginPath()

        if (speed >= 0) {
          ctx.arc(0, 0, radius, this.lastAngle, this.angle + 0.001, false)
        } else {
          ctx.arc(0, 0, radius, this.angle, this.lastAngle + 0.001, false)
        }

        ctx.stroke()
        ctx.closePath()
      }

      if (displayLight) {
        ctx.lineWidth = 0.5
        ctx.strokeStyle = `hsla(${[
          (this.angle + 90) / (Math.PI / 180) +
            random({ max: jitterHue, min: -jitterHue }),
          "100%",
          "70%",
          lightAlpha / 100,
        ].join(", ")})`
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
      }
    }
  }

  const orbs: Orb[] = []

  const createOrb = (config?: { x: number; y: number }) => {
    const x = config?.x ? config.x : 0
    const y = config?.y ? config.y : 0

    orbs.push(new Orb({ x, y }))
  }

  let isMouseDown = false

  const createMouseOrb = (mouseEvent: MouseEvent) => {
    const rect = canvasEl.getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top

    createOrb({ x, y })
  }

  canvasEl.addEventListener("mouseup", (mouseEvent: MouseEvent) => {
    isMouseDown = false

    mouseEvent.stopPropagation()
    mouseEvent.preventDefault()
  })

  canvasEl.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
    isMouseDown = true

    createMouseOrb(mouseEvent)

    mouseEvent.stopPropagation()
    mouseEvent.preventDefault()
  })

  canvasEl.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
    if (isMouseDown) {
      createMouseOrb(mouseEvent)
    }
  })

  let total = count

  while (total) {
    createOrb({
      x: random({ max: width / 2 + innerRadius, min: width / 2 - innerRadius }),
      y: random({
        max: height / 2 + innerRadius,
        min: height / 2 - innerRadius,
      }),
    })

    total -= 1
  }

  const clear = () => {
    ctx.globalCompositeOperation = "destination-out"
    ctx.fillStyle = `rgba(0,0,0,${clearAlpha / 100})`
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = "lighter"
  }

  const update = () => {
    dt = Date.now() - t

    dt = dt < 0.1 ? 0.1 : dt / 16
    dt = dt > 5 ? 5 : dt
    t = Date.now()

    orbs.forEach((orb) => {
      orb.update()
    })
  }

  const draw = () => {
    ctx.save()
    ctx.translate(center.x, center.y)
    ctx.scale(scale, scale)

    orbs.forEach((orb) => {
      orb.render()
    })

    ctx.restore()
  }

  let isStopped = false

  const loop = () => {
    if (isStopped) {
      return
    }

    update()
    draw()
    clear()

    requestAnimationFrame(loop)
  }

  loop()

  return {
    stop: () => {
      isStopped = true
    },
  }
}

const CanvasOrbitParticles = (props: Props) => {
  React.useEffect(() => {
    const { stop } = main(props)

    return stop
  })

  return (
    <div>
      <StoryInfo
        docs={[canvasDocs.globalCompositeOperation, canvasDocs.arc]}
        source="https://codepen.io/jackrugile/pen/aCzHs"
        storyName="CanvasOrbitParticles"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <CanvasOrbitParticles {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const args: Props = {
  clearAlpha: 10,
  count: 200,
  displayLight: true,
  displayOrbitals: true,
  jitterHue: 0,
  jitterRadius: 0,
  lightAlpha: 4,
  orbitalAlpha: 100,
  scale: 5,
  speed: 65,
}

Common.args = args

export default {
  argTypes: {},
  component: CanvasOrbitParticles,
  title: "Canvas/OrbitParticles",
}
