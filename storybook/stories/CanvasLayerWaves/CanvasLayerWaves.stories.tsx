import { select } from "d3"
import React from "react"

import {
  StoryInfo,
  TemplateType,
  canvasDocs,
  createRangeControl,
} from "../common"

import { noise, noiseFactor } from "./noise"

type Props = {
  cols: number
  fov: number
  rows: number
  waveHeight: number
  zoom: number
}

type Point = {
  x: number
  y: number
  z: number
}

type Triangle = [Point, Point, Point]
type Mesh = Triangle[]

const ROOT_ID = "example"

const main = ({ cols, fov, rows, waveHeight, zoom }: Props) => {
  const { width } = (document.getElementById(
    ROOT_ID
  ) as HTMLElement).getBoundingClientRect()
  const height = 500
  const state = {
    isStopped: false,
    offsetX: 0,
    offsetY: 0,
  }

  const canvasEl = select(`#${ROOT_ID}`)
    .text("")
    .append("canvas")
    .attr("height", height)
    .attr("width", width)
    .node() as HTMLCanvasElement

  const ctx = canvasEl.getContext("2d")!

  const increaseOffset = 0.01

  const mesh: Mesh = []

  const generateMesh = () => {
    mesh.length = 0

    const gridWidth = width / cols
    const gridHeight = height / rows
    const gridDepth = fov / rows

    Array.from({ length: cols }).forEach((_: unknown, col: number) => {
      Array.from({ length: rows }).forEach((__: unknown, row: number) => {
        mesh.push([
          {
            x: col * gridWidth,
            y: row * gridHeight + gridHeight,
            z: fov - (row * gridDepth + gridDepth),
          },
          {
            x: col * gridWidth,
            y: row * gridHeight,
            z: fov - row * gridDepth,
          },
          {
            x: col * gridWidth + gridWidth,
            y: row * gridHeight,
            z: fov - row * gridDepth,
          },
        ])

        mesh.push([
          {
            x: col * gridWidth + gridWidth,
            y: row * gridHeight,
            z: fov - row * gridDepth,
          },
          {
            x: col * gridWidth + gridWidth,
            y: row * gridHeight + gridHeight,
            z: fov - (row * gridDepth + gridDepth),
          },
          {
            x: col * gridWidth,
            y: row * gridHeight + gridHeight,
            z: fov - (row * gridDepth + gridDepth),
          },
        ])
      })
    })
  }

  const drawMesh = () => {
    projectMesh()

    ctx.clearRect(0, 0, width, height)

    ctx.globalCompositeOperation = "lighter"
    ctx.strokeStyle = "black"

    mesh.forEach((triangle) => {
      const firstPoint = triangle[0]

      ctx.beginPath()
      ctx.moveTo(firstPoint.x, firstPoint.y)

      triangle.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })

      ctx.closePath()
      ctx.stroke()
    })
  }

  const addNoise = () => {
    mesh.forEach((triangle) => {
      triangle.forEach((point) => {
        point.y +=
          waveHeight *
          noise(
            point.x * noiseFactor + state.offsetX,
            point.y * noiseFactor + state.offsetY
          )
      })
    })
  }

  const clip = (fragment: number, total: number) => fragment - total / 2

  const projectMesh = () => {
    mesh.forEach((triangle) => {
      triangle.forEach((point) => {
        const projectionScale = (zoom * fov) / (fov + point.z)

        point.x = clip(point.x, width) * projectionScale + width / 2
        point.y = clip(point.y, height) * projectionScale + height / 3
      })
    })
  }

  const updateSimulation = () => {
    state.offsetX += increaseOffset
    state.offsetY -= increaseOffset

    generateMesh()
    addNoise()
  }

  const draw = () => {
    updateSimulation()
    drawMesh()
  }

  const loop = () => {
    draw()

    if (!state.isStopped) {
      requestAnimationFrame(loop)
    }
  }

  loop()

  return {
    stop: () => {
      state.isStopped = true
    },
  }
}

const CanvasLayerWaves = (props: Props) => {
  React.useEffect(() => {
    const { stop } = main(props)

    return stop
  })

  return (
    <div>
      <StoryInfo
        docs={[
          canvasDocs.beginPath,
          canvasDocs.clearRect,
          canvasDocs.globalCompositeOperation,
          canvasDocs.strokeStyle,
        ]}
        source="https://codepen.io/MadeByMike/pen/zBrpBL"
        storyName="CanvasLayerWaves"
      />
      <p>The approach of this simulation is to generate the mesh every time</p>
      <p>
        It is interesting how it projects the mesh into the 2D. There are no
        interactions.
      </p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <CanvasLayerWaves {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [rowsArgs, rowsControls] = createRangeControl(40, 1, 20)
const [colsArgs, colsControls] = createRangeControl(40, 1, 20)
const [zoomArgs, zoomControls] = createRangeControl(1, 0.5, 0.5, 5)
const [waveHeightArgs, waveHeightControls] = createRangeControl(15, 1, 15, 35)

const args: Props = {
  cols: colsArgs,
  fov: 200,
  rows: rowsArgs,
  waveHeight: waveHeightArgs,
  zoom: zoomArgs,
}

Common.args = args

export default {
  argTypes: {
    cols: colsControls,
    rows: rowsControls,
    waveHeight: waveHeightControls,
    zoom: zoomControls,
  },
  component: CanvasLayerWaves,
  title: "Canvas/LayerWaves",
}
