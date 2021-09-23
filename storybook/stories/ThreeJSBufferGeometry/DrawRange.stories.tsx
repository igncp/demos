import React from "react"
import {
  BoxGeometry,
  BoxHelper,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

const ROOT_ID = "example"

const initialParticleCount = 500
const maxParticleCount = 1000

const cubeSize = 800
const cubeSizeHalf = cubeSize / 2

const isOutOfBounds = ({
  arbitraryValue,
  bounds,
}: {
  arbitraryValue: number
  bounds: readonly [number, number]
}) => arbitraryValue < bounds[0] || arbitraryValue > bounds[1]

type Props = {
  maxConnections: number
  minConnectionDistance: number
  particleCount: number
  showDots: boolean
  showLines: boolean
}

type State = {
  isStopped: boolean
}

type ParticleData = {
  numConnections: number
  velocity: Vector3
}

type SimulationElements = {
  camera: PerspectiveCamera
  controls: OrbitControls
  linesColors: Float32Array
  linesMesh: LineSegments
  linesPositions: Float32Array
  particles: BufferGeometry
  particlesData: ParticleData[]
  particlesPositions: Float32Array
  pointCloud: Points
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
  const { maxConnections, minConnectionDistance, particleCount } = props
  const state: State = {
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

    const camera = new PerspectiveCamera(45, width / height, 1, 4000)

    const scene = new Scene()

    scene.background = new Color(0xffffff)

    const group = new Group()

    scene.add(group)

    const helper = new BoxHelper(
      new Mesh(new BoxGeometry(cubeSize, cubeSize, cubeSize))
    )
    const helperMaterial = helper.material as PointsMaterial

    helperMaterial.color.setHex(0x000000)
    helperMaterial.transparent = true

    group.add(helper)

    const segments = maxParticleCount * maxParticleCount

    const linesPositions = new Float32Array(segments * 3)
    const linesColors = new Float32Array(segments * 3)

    const pointsMaterial = new PointsMaterial({
      color: 0x000000,
      size: 3,
      sizeAttenuation: false,
      transparent: true,
    })

    const particlesData: ParticleData[] = []
    const particles = new BufferGeometry()
    const particlesPositions = new Float32Array(maxParticleCount * 3)

    Array.from({ length: maxParticleCount }).forEach((...[, particleIndex]) => {
      const x = Math.random() * cubeSize - cubeSizeHalf
      const y = Math.random() * cubeSize - cubeSizeHalf
      const z = Math.random() * cubeSize - cubeSizeHalf

      particlesPositions[particleIndex * 3] = x
      particlesPositions[particleIndex * 3 + 1] = y
      particlesPositions[particleIndex * 3 + 2] = z

      particlesData.push({
        numConnections: 0,
        velocity: new Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        ),
      })
    })

    particles.setDrawRange(0, particleCount)
    particles.setAttribute(
      "position",
      new BufferAttribute(particlesPositions, 3).setUsage(DynamicDrawUsage)
    )

    const pointCloud = new Points(particles, pointsMaterial)

    group.add(pointCloud)

    const lineGeometry = new BufferGeometry()

    lineGeometry.setAttribute(
      "position",
      new BufferAttribute(linesPositions, 3).setUsage(DynamicDrawUsage)
    )
    lineGeometry.setAttribute(
      "color",
      new BufferAttribute(linesColors, 3).setUsage(DynamicDrawUsage)
    )

    lineGeometry.computeBoundingSphere()

    lineGeometry.setDrawRange(0, 0)

    const lineMaterial = new LineBasicMaterial({
      transparent: true,
      vertexColors: true,
    })

    const linesMesh = new LineSegments(lineGeometry, lineMaterial)

    group.add(linesMesh)

    const renderer = new WebGLRenderer({ antialias: true })
    const controls = new OrbitControls(camera, renderer.domElement)

    return {
      camera,
      controls,
      linesColors,
      linesMesh,
      linesPositions,
      particles,
      particlesData,
      particlesPositions,
      pointCloud,
      renderer,
      scene,
    }
  })()

  const {
    camera,
    controls,
    linesColors,
    linesMesh,
    linesPositions,
    particles,
    particlesData,
    particlesPositions,
    pointCloud,
    renderer,
    scene,
  } = elements

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    camera.position.z = 1750
    controls.minDistance = 1000
    controls.maxDistance = 3000

    renderer.outputEncoding = sRGBEncoding

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const render = () => {
    let vertexpos = 0
    let colorpos = 0
    let numConnected = 0

    particlesData.forEach((particleData) => {
      particleData.numConnections = 0
    })

    const bounds = [-cubeSizeHalf, cubeSizeHalf] as const
    const isOutOfBoundsParam = {
      arbitraryValue: 0,
      bounds,
    }

    Array.from({ length: particleCount }).forEach((...[, particleIndex]) => {
      const { [particleIndex]: particleData } = particlesData

      particlesPositions[particleIndex * 3] += particleData.velocity.x
      particlesPositions[particleIndex * 3 + 1] += particleData.velocity.y
      particlesPositions[particleIndex * 3 + 2] += particleData.velocity.z

      isOutOfBoundsParam.arbitraryValue = particlesPositions[particleIndex * 3]

      if (isOutOfBounds(isOutOfBoundsParam)) {
        particleData.velocity.x = -particleData.velocity.x
      }

      isOutOfBoundsParam.arbitraryValue =
        particlesPositions[particleIndex * 3 + 1]

      if (isOutOfBounds(isOutOfBoundsParam)) {
        particleData.velocity.y = -particleData.velocity.y
      }

      isOutOfBoundsParam.arbitraryValue =
        particlesPositions[particleIndex * 3 + 2]

      if (isOutOfBounds(isOutOfBoundsParam)) {
        particleData.velocity.z = -particleData.velocity.z
      }

      if (
        maxConnections > -1 &&
        particleData.numConnections >= maxConnections
      ) {
        return
      }

      for (
        let particleBIndex = particleIndex + 1;
        particleBIndex < particleCount;
        particleBIndex += 1
      ) {
        const { [particleBIndex]: particleDataB } = particlesData

        if (
          maxConnections > -1 &&
          particleDataB.numConnections >= maxConnections
        ) {
          return
        }

        const dx =
          particlesPositions[particleIndex * 3] -
          particlesPositions[particleBIndex * 3]
        const dy =
          particlesPositions[particleIndex * 3 + 1] -
          particlesPositions[particleBIndex * 3 + 1]
        const dz =
          particlesPositions[particleIndex * 3 + 2] -
          particlesPositions[particleBIndex * 3 + 2]

        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance > minConnectionDistance) {
          return
        }

        particleData.numConnections += 1
        particleDataB.numConnections += 1

        const alpha = 1.0 - distance / minConnectionDistance

        /* eslint-disable no-plusplus */
        linesPositions[vertexpos++] = particlesPositions[particleIndex * 3]
        linesPositions[vertexpos++] = particlesPositions[particleIndex * 3 + 1]
        linesPositions[vertexpos++] = particlesPositions[particleIndex * 3 + 2]

        linesPositions[vertexpos++] = particlesPositions[particleBIndex * 3]
        linesPositions[vertexpos++] = particlesPositions[particleBIndex * 3 + 1]
        linesPositions[vertexpos++] = particlesPositions[particleBIndex * 3 + 2]

        Array.from({ length: 6 }).forEach(() => {
          linesColors[colorpos++] = alpha
        })
        /* eslint-enable no-plusplus */

        numConnected += 1
      }
    })

    linesMesh.geometry.setDrawRange(0, numConnected * 2)
    linesMesh.geometry.attributes.position.needsUpdate = true
    linesMesh.geometry.attributes.color.needsUpdate = true

    pointCloud.geometry.attributes.position.needsUpdate = true

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
    pointCloud.visible = props.showDots
    linesMesh.visible = props.showLines

    particles.setDrawRange(0, particleCount)

    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const DrawRange = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    simulationRef.current = demo({
      prevSimulation: simulationRef.current,
      props,
    })

    return () => {
      simulationRef.current!.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawrange.html"
        storyName={["ThreeJSBufferGeometry", "DrawRange"]}
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <DrawRange {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [particleCountArg, particleCountControls] = createRangeControl({
  diffMax: maxParticleCount - initialParticleCount,
  diffMin: 499,
  initialValue: initialParticleCount,
  step: 1,
})

const [minConnectionDistanceArg, minConnectionDistanceControls] =
  createRangeControl({
    diffMin: 149,
    initialValue: 150,
    step: 1,
  })

const [maxConnectionsArg, maxConnectionsControls] = createRangeControl({
  diffMax: 100,
  diffMin: 0,
  initialValue: -1,
  step: 1,
})

const args: Props = {
  maxConnections: maxConnectionsArg,
  minConnectionDistance: minConnectionDistanceArg,
  particleCount: particleCountArg,
  showDots: true,
  showLines: true,
}

Common.args = args

export default {
  argTypes: {
    maxConnections: maxConnectionsControls,
    minConnectionDistance: minConnectionDistanceControls,
    particleCount: particleCountControls,
  },
  component: DrawRange,
  title: "ThreeJS/BufferGeometry/DrawRange",
}

export { Common }
