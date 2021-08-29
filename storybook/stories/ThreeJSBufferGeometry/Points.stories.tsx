import React from "react"
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  PointsMaterial,
  Points as PointsThree,
  Scene,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

const ROOT_ID = "example"

type Props = {
  particles: number
  rotationSpeed: number
  size: number
}

type State = {
  isStopped: boolean
  time: number
}

type SimulationElements = {
  camera: PerspectiveCamera
  points: PointsThree
  renderer: WebGLRenderer
  scene: Scene
}

type Simulation = {
  elements: SimulationElements
  props: Props
  state: State
  stop: () => void
}

const demo = ({
  prevSimulation,
  props,
}: {
  prevSimulation: Simulation | null
  props: Props
}): Simulation => {
  const state: State = {
    time: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const elements = ((): SimulationElements => {
    if (prevSimulation) {
      return prevSimulation.elements
    }

    const camera = new PerspectiveCamera(27, width / height, 5, 3500)

    const scene = new Scene()
    const pointsGeometry = new BufferGeometry()

    const positions: number[] = []
    const colors: number[] = []
    const color = new Color()

    const { size } = props
    const sizeHalf = size / 2

    Array.from({ length: props.particles }, () => {
      const x = Math.random() * size - sizeHalf
      const y = Math.random() * size - sizeHalf
      const z = Math.random() * size - sizeHalf

      positions.push(x, y, z)

      const vx = x / size + 0.5
      const vy = y / size + 0.5
      const vz = z / size + 0.5

      color.setRGB(vx, vy, vz)

      colors.push(color.r, color.g, color.b)
    })

    pointsGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    )
    pointsGeometry.setAttribute("color", new Float32BufferAttribute(colors, 3))

    pointsGeometry.computeBoundingSphere()

    const pointsMaterial = new PointsMaterial({ size: 15, vertexColors: true })

    const points = new PointsThree(pointsGeometry, pointsMaterial)
    const renderer = new WebGLRenderer()

    scene.add(points)

    return {
      camera,
      points,
      renderer,
      scene,
    }
  })()

  const { camera, points, renderer, scene } = elements

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    scene.background = new Color(0xffffff)

    camera.position.z = 2750
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const render = () => {
    state.time += props.rotationSpeed * 0.0001

    points.rotation.x = state.time * 0.25
    points.rotation.y = state.time * 0.5

    renderer.render(scene, camera)
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    render()
  }

  if (prevSimulation) {
    prevSimulation.stop()

    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const restartProps: Array<keyof Props> = ["particles", "size"]

const Points = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    const shouldRestart = restartProps.some(
      (restartProp) =>
        simulationRef.current?.props[restartProp] !== props[restartProp]
    )

    if (shouldRestart) {
      simulationRef.current?.stop()
      simulationRef.current = null
    }

    simulationRef.current = demo({
      prevSimulation: simulationRef.current,
      props,
    })
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_points.html"
        storyName={["ThreeJSBufferGeometry", "Points"]}
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <Points {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [speedArg, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const [particlesArg, particlesControls] = createRangeControl({
  diffMax: 100_000,
  diffMin: 499_499,
  initialValue: 500_000,
  step: 1,
})

const [sizeArg, sizeControls] = createRangeControl({
  diffMax: 200,
  diffMin: 799,
  initialValue: 800,
  step: 1,
})

const args: Props = {
  particles: particlesArg,
  rotationSpeed: speedArg,
  size: sizeArg,
}

Common.args = args

export default {
  argTypes: {
    particles: particlesControls,
    rotationSpeed: speedControls,
    size: sizeControls,
  },
  component: Points,
  title: "ThreeJS/BufferGeometry/Points",
}
