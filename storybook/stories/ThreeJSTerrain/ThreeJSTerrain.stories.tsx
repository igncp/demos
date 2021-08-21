import React from "react"
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  ConeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"

import {
  StoryInfo,
  TemplateType,
  canvasDocs,
  createRangeControl,
  threeDocs,
} from "../common"

const canvasHeight = 400
const scaleFactor = 4
const planeSize = 7500

const surfaceConeRadius = 20
const surfaceConeHeight = 100
const surfaceConeRadialSegments = 10

type Props = {
  lightLevel: number
  mountainHeight: number
  worldDepth: number
  worldWidth: number
}

const ROOT_ID = "example"

const generateHeight = (
  width: number,
  height: number,
  mountainHeight: number
) => {
  const size = width * height
  const heightData = new Uint8Array(size)
  const perlin = new ImprovedNoise()
  const z = Math.random() * 100

  let quality = 1

  Array.from({ length: 4 }).forEach(() => {
    Array.from({ length: size }).forEach((_, arrIdx) => {
      const x = arrIdx % width
      const y = Math.floor(arrIdx / width)

      const noiseResult = perlin.noise(x / quality, y / quality, z)

      heightData[arrIdx] += Math.abs(noiseResult * quality * mountainHeight)
    })

    quality *= 5
  })

  return heightData
}

const generateTexture = (
  heightData: Uint8Array,
  width: number,
  height: number,
  lightLevel: number
) => {
  const shadeVector = new Vector3(0, 0, 0)

  const sun = new Vector3(1, 1, 1)

  sun.normalize()

  const canvas = document.createElement("canvas")

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d") as CanvasRenderingContext2D

  context.fillStyle = "#000"
  context.fillRect(0, 0, width, height)

  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  const { data: imageData } = image

  for (
    let rgbIdx = 0, heightIndex = 0, { length: imageLength } = imageData;
    rgbIdx < imageLength;
    rgbIdx += 4, heightIndex += 1
  ) {
    shadeVector.x = heightData[heightIndex - 2] - heightData[heightIndex + 2]
    shadeVector.y = 2
    shadeVector.z =
      heightData[heightIndex - width * 2] - heightData[heightIndex + width * 2]
    shadeVector.normalize()

    const shade = (shadeVector.dot(sun) * lightLevel) / 100

    const red = 255 * shade
    const green = 255 * shade
    const blue = 255 * shade

    imageData[rgbIdx] = red
    imageData[rgbIdx + 1] = green
    imageData[rgbIdx + 2] = blue
  }

  context.putImageData(image, 0, 0)

  const canvasScaled = document.createElement("canvas")

  canvasScaled.width = width * scaleFactor
  canvasScaled.height = height * scaleFactor

  const contextScaled = canvasScaled.getContext(
    "2d"
  ) as CanvasRenderingContext2D

  contextScaled.scale(scaleFactor, scaleFactor)
  contextScaled.drawImage(canvas, 0, 0)

  const imageScaled = contextScaled.getImageData(
    0,
    0,
    canvasScaled.width,
    canvasScaled.height
  )

  const { data: imageDataScaled } = imageScaled

  Array.from({ length: imageDataScaled.length / scaleFactor }).forEach(
    (_, imageIndexBase: number) => {
      const imageAddition = Math.floor(Math.random() * 5)
      const imageIndex = imageIndexBase * scaleFactor

      imageDataScaled[imageIndex] += imageAddition
      imageDataScaled[imageIndex + 1] += imageAddition
      imageDataScaled[imageIndex + 2] += imageAddition
    }
  )

  contextScaled.putImageData(imageScaled, 0, 0)

  return canvasScaled
}

type Simulation = {
  heightData: Uint8Array
  material: MeshBasicMaterial
  props: Props
  stop: () => void
}

const main = (
  props: Props,
  previousSimulation: Simulation | null
): Simulation => {
  const { lightLevel, mountainHeight, worldDepth, worldWidth } = props

  const createTexture = (heightData: Simulation["heightData"]) => {
    const texture = new CanvasTexture(
      generateTexture(heightData, worldWidth, worldDepth, lightLevel)
    )

    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

    return texture
  }

  if (previousSimulation) {
    const canReuseSimulation = ([
      "mountainHeight",
      "worldWidth",
      "worldDepth",
    ] as const).every((k) => previousSimulation.props[k] === props[k])

    if (canReuseSimulation) {
      previousSimulation.material.map = createTexture(
        previousSimulation.heightData
      )

      return previousSimulation
    }

    previousSimulation.stop()
  }

  const worldHalfWidth = worldWidth / 2
  const worldHalfDepth = worldDepth / 2

  const state = {
    isStopped: false,
  }

  const raycaster = new Raycaster()

  const container = document.getElementById(ROOT_ID) as HTMLElement

  container.innerHTML = ""

  const containerRect = container.getBoundingClientRect()
  const pointer = new Vector2()

  const { width } = containerRect
  const renderer = new WebGLRenderer({ antialias: true })

  const camera = new PerspectiveCamera(
    60,
    width / window.innerHeight,
    10,
    20000
  )

  const newHeightData = generateHeight(worldWidth, worldDepth, mountainHeight)

  const createMaterial = () =>
    new MeshBasicMaterial({
      map: createTexture(newHeightData),
      opacity: 0.8,
      transparent: true,
    })

  const material = createMaterial()

  const geometry = new PlaneGeometry(
    planeSize,
    planeSize,
    worldWidth - 1,
    worldDepth - 1
  )
  const mesh = new Mesh(geometry, material)

  const geometryHelper = new ConeGeometry(
    surfaceConeRadius,
    surfaceConeHeight,
    surfaceConeRadialSegments
  )

  geometryHelper.translate(0, 50, 0)
  geometryHelper.rotateX(Math.PI / 2)

  const surfaceCone = new Mesh(geometryHelper, new MeshNormalMaterial())

  const onPointerMove = (pointerEvent: PointerEvent) => {
    pointer.x =
      ((pointerEvent.clientX - containerRect.left) /
        renderer.domElement.clientWidth) *
        2 -
      1
    pointer.y =
      -(
        (pointerEvent.clientY - containerRect.top) /
        renderer.domElement.clientHeight
      ) *
        2 +
      1
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObject(mesh)

    if (intersects.length > 0) {
      surfaceCone.position.set(0, 0, 0)
      surfaceCone.lookAt(intersects[0].face!.normal)

      surfaceCone.position.copy(intersects[0].point)
    }
  }

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, canvasHeight)
  container.appendChild(renderer.domElement)

  const scene = new Scene()

  scene.background = new Color(0xffffff)

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.minDistance = 1000
  controls.maxDistance = 10000
  controls.maxPolarAngle = Math.PI / 2

  controls.target.y =
    newHeightData[worldHalfWidth + worldHalfDepth * worldWidth] + 500
  camera.position.y = controls.target.y + 2000
  camera.position.x = 2000
  controls.update()

  geometry.rotateX(-Math.PI / 2)

  const vertices = geometry.attributes.position.array as number[]

  for (
    let heightArrIdx = 0, vertexIdx = 0, { length: verticesLength } = vertices;
    heightArrIdx < verticesLength;
    heightArrIdx += 1, vertexIdx += 3
  ) {
    const heightVertexIdx = vertexIdx + 1

    vertices[heightVertexIdx] = newHeightData[heightArrIdx] * 10
  }

  // this has been deprecated in favor of Face:
  // https://threejs.org/docs/#examples/en/math/convexhull/Face
  // @ts-ignore
  geometry.computeFaceNormals()

  scene.add(mesh)

  scene.add(surfaceCone)

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  container.addEventListener("pointermove", onPointerMove)

  animate()

  return {
    heightData: newHeightData,
    material,
    props,
    stop: () => {
      container.removeEventListener("pointermove", onPointerMove)
      state.isStopped = true
    },
  }
}

const ThreeJSTerrain = (props: Props) => {
  const [previousSimulation, setSimulation] = React.useState<Simulation | null>(
    null
  )

  React.useEffect(() => {
    const newSimulation = main(props, previousSimulation)

    setSimulation(newSimulation)
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[
          canvasDocs.getImageData,
          threeDocs.canvasTexture,
          threeDocs.color,
          threeDocs.improveNoiseExample,
          threeDocs.vector3,
          threeDocs.webGLRenderer,
        ]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_geometry_terrain_raycast.html"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSTerrain"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSTerrain {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [lightLevelArg, lightLevelControl] = createRangeControl(50, 1, 50)
const [mountainHeightArg, mountainHeightControl] = createRangeControl(
  1.75,
  0.05,
  1.75,
  1.25
)
const [worldWidthArg, worldWidthControl] = createRangeControl(250, 1, 100)
const [worldDepthArg, worldDepthControl] = createRangeControl(250, 1, 100)

const args: Props = {
  lightLevel: lightLevelArg,
  mountainHeight: mountainHeightArg,
  worldDepth: worldDepthArg,
  worldWidth: worldWidthArg,
}

Common.args = args

export default {
  argTypes: {
    lightLevel: lightLevelControl,
    mountainHeight: mountainHeightControl,
    worldDepth: worldDepthControl,
    worldWidth: worldWidthControl,
  },
  component: ThreeJSTerrain,
  title: "ThreeJS/Terrain",
}
