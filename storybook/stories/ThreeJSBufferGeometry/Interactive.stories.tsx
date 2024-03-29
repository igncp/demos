import React from "react"
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

import { ROOT_ID } from "./constants"

type Props = {
  speed: number
  trianglesCount: number
}

type State = {
  isStopped: boolean
  time: number
}

type SimulationElements = {
  camera: PerspectiveCamera
  cubeMesh: Mesh
  line: Line
  pointer: Vector2
  raycaster: Raycaster
  renderer: WebGLRenderer
  scene: Scene
}

type Simulation = {
  elements: SimulationElements
  props: Props
  state: State
  stop: () => void
}

const cubeSize = 800
const cubeSizeHalf = cubeSize / 2

const triangleSize = 120
const triangleSizeHalf = triangleSize / 2

const demo = ({
  prevSimulation,
  props,
}: {
  prevSimulation: Simulation | null
  props: Props
}): Simulation => {
  const { speed } = props
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

    const camera = new PerspectiveCamera(27, width / height, 1, 3500)

    const renderer = new WebGLRenderer()

    const scene = new Scene()
    const pointer = new Vector2()

    const { trianglesCount } = props

    const positions = new Float32Array(trianglesCount * 3 * 3)
    const normals = new Float32Array(trianglesCount * 3 * 3)
    const colors = new Float32Array(trianglesCount * 3 * 3)

    const color = new Color()

    const pointA = new Vector3()
    const pointB = new Vector3()
    const pointC = new Vector3()

    const cb = new Vector3()
    const ab = new Vector3()

    for (
      let triangleIndex = 0;
      triangleIndex < positions.length;
      triangleIndex += 9
    ) {
      const x = Math.random() * cubeSize - cubeSizeHalf
      const y = Math.random() * cubeSize - cubeSizeHalf
      const z = Math.random() * cubeSize - cubeSizeHalf

      const ax = x + Math.random() * triangleSize - triangleSizeHalf
      const ay = y + Math.random() * triangleSize - triangleSizeHalf
      const az = z + Math.random() * triangleSize - triangleSizeHalf

      const bx = x + Math.random() * triangleSize - triangleSizeHalf
      const by = y + Math.random() * triangleSize - triangleSizeHalf
      const bz = z + Math.random() * triangleSize - triangleSizeHalf

      const cx = x + Math.random() * triangleSize - triangleSizeHalf
      const cy = y + Math.random() * triangleSize - triangleSizeHalf
      const cz = z + Math.random() * triangleSize - triangleSizeHalf

      positions[triangleIndex] = ax
      positions[triangleIndex + 1] = ay
      positions[triangleIndex + 2] = az

      positions[triangleIndex + 3] = bx
      positions[triangleIndex + 4] = by
      positions[triangleIndex + 5] = bz

      positions[triangleIndex + 6] = cx
      positions[triangleIndex + 7] = cy
      positions[triangleIndex + 8] = cz

      pointA.set(ax, ay, az)
      pointB.set(bx, by, bz)
      pointC.set(cx, cy, cz)

      cb.subVectors(pointC, pointB)
      ab.subVectors(pointA, pointB)
      cb.cross(ab)

      cb.normalize()

      const { x: normalX, y: normalY, z: normalZ } = cb

      normals[triangleIndex] = normalX
      normals[triangleIndex + 1] = normalY
      normals[triangleIndex + 2] = normalZ

      normals[triangleIndex + 3] = normalX
      normals[triangleIndex + 4] = normalY
      normals[triangleIndex + 5] = normalZ

      normals[triangleIndex + 6] = normalX
      normals[triangleIndex + 7] = normalY
      normals[triangleIndex + 8] = normalZ

      const vx = x / cubeSize + 0.5
      const vy = y / cubeSize + 0.5
      const vz = z / cubeSize + 0.5

      color.setRGB(vx, vy, vz)

      colors[triangleIndex] = color.r
      colors[triangleIndex + 1] = color.g
      colors[triangleIndex + 2] = color.b

      colors[triangleIndex + 3] = color.r
      colors[triangleIndex + 4] = color.g
      colors[triangleIndex + 5] = color.b

      colors[triangleIndex + 6] = color.r
      colors[triangleIndex + 7] = color.g
      colors[triangleIndex + 8] = color.b
    }

    const cubeGeometry = new BufferGeometry()

    cubeGeometry.setAttribute("position", new BufferAttribute(positions, 3))
    cubeGeometry.setAttribute("normal", new BufferAttribute(normals, 3))
    cubeGeometry.setAttribute("color", new BufferAttribute(colors, 3))
    cubeGeometry.computeBoundingSphere()

    const cubeMaterial = new MeshPhongMaterial({
      color: 0xaaaaaa,
      shininess: 250,
      side: DoubleSide,
      specular: 0xffffff,
      vertexColors: true,
    })

    const cubeMesh = new Mesh(cubeGeometry, cubeMaterial)

    scene.add(cubeMesh)

    const raycaster = new Raycaster()

    const lineGeometry = new BufferGeometry()

    lineGeometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(4 * 3), 3)
    )

    const lineMaterial = new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
    })

    const line = new Line(lineGeometry, lineMaterial)

    scene.add(line)

    return {
      camera,
      cubeMesh,
      line,
      pointer,
      raycaster,
      renderer,
      scene,
    }
  })()

  const { camera, cubeMesh, line, pointer, raycaster, renderer, scene } =
    elements

  const onClick = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()
    clickEvent.stopPropagation()

    const intersects = raycaster.intersectObject(cubeMesh)

    if (intersects.length > 0) {
      const face = intersects[0].face!
      const positionAttribute = cubeMesh.geometry.attributes.position
        .array as Float32Array
      const { a: faceIndex } = face

      const positionIndex = faceIndex * 3

      Array.from({ length: 9 }).forEach((...[, positionOffset]) => {
        positionAttribute[positionIndex + positionOffset] = 0
      })

      cubeMesh.geometry.attributes.position.needsUpdate = true
    }
  }

  const onPointerMove = (pointerEvent: PointerEvent) => {
    const { left, top } = container.getBoundingClientRect()

    pointer.x = ((pointerEvent.clientX - left) / width) * 2 - 1
    pointer.y = -((pointerEvent.clientY - top) / height) * 2 + 1
  }

  document.addEventListener("pointermove", onPointerMove)
  document.addEventListener("click", onClick)

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("click", onClick)
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    camera.position.z = 2750

    scene.background = new Color(0xffffff)

    scene.add(new AmbientLight(0xffffff))

    const light1 = new DirectionalLight(0x00ffff, 0.5)

    light1.position.set(1, 1, 1)
    scene.add(light1)

    const light2 = new DirectionalLight(0xff00ff, 1.5)

    light2.position.set(0, -1, 0)
    scene.add(light2)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const render = () => {
    state.time += speed * 0.0002

    cubeMesh.rotation.x = state.time * 0.15
    cubeMesh.rotation.y = state.time * 0.25

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObject(cubeMesh)

    if (intersects.length > 0) {
      const intersect = intersects[0]
      const face = intersect.face!

      const linePosition = line.geometry.attributes.position as BufferAttribute
      const meshPosition = cubeMesh.geometry.attributes
        .position as BufferAttribute

      linePosition.copyAt(0, meshPosition, face.a)
      linePosition.copyAt(1, meshPosition, face.b)
      linePosition.copyAt(2, meshPosition, face.c)
      linePosition.copyAt(3, meshPosition, face.a)

      cubeMesh.updateMatrix()

      line.geometry.applyMatrix4(cubeMesh.matrix)

      line.visible = true
    } else {
      line.visible = false
    }

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
    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const Interactive = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    if (
      simulationRef.current &&
      simulationRef.current.props.trianglesCount !== props.trianglesCount
    ) {
      simulationRef.current.stop()

      simulationRef.current = demo({
        prevSimulation: null,
        props,
      })
    } else {
      simulationRef.current = demo({
        prevSimulation: simulationRef.current,
        props,
      })
    }

    return () => {
      simulationRef.current!.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_buffergeometry.html"
        storyName={["ThreeJSBufferGeometry", "Interactive"]}
      />
      <p>
        <b>New feature</b>: You can click a triangle to remove it from the
        buffer geometry
      </p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <Interactive {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [speedArg, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const initialTrianglesCount = 5000

const [trianglesCountArg, trianglesCountControls] = createRangeControl({
  diffMax: initialTrianglesCount * 2,
  diffMin: initialTrianglesCount - 1,
  initialValue: initialTrianglesCount,
  step: 1,
})

const args: Props = {
  speed: speedArg,
  trianglesCount: trianglesCountArg,
}

Common.args = args

export default {
  argTypes: {
    speed: speedControls,
    trianglesCount: trianglesCountControls,
  },
  component: Interactive,
  title: "ThreeJS/BufferGeometry/Interactive",
}

export { Common }
