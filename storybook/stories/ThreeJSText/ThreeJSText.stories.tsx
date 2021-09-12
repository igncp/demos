import React from "react"
import {
  Color,
  DirectionalLight,
  Fog,
  Font,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextGeometry,
  Vector3,
  WebGLRenderer,
} from "three"

import {
  StoryInfo,
  TemplateType,
  createRangeControl,
  createSelectControl,
  webAPIDocs,
} from "../common"

enum FontWeight {
  Bold = "bold",
  Regular = "regular",
}

enum FontName {
  DroidSans = "droid_sans",
  DroidSerif = "droid_serif",
  Gentilis = "gentilis",
  Helvetiker = "helvetiker",
  Optimer = "optimer",
}

type Props = {
  bevelEnabled: boolean
  fontName: FontName
  fontWeight: FontWeight
  size: number
  text: string
}

const ROOT_ID = "example"

const fontsMap: { [key in FontName]: { [key2 in FontWeight]: unknown } } = {
  [FontName.DroidSans]: {
    [FontWeight.Regular]: require("three/examples/fonts/droid/droid_sans_regular.typeface.json"),
    [FontWeight.Bold]: require("three/examples/fonts/droid/droid_sans_bold.typeface.json"),
  },
  [FontName.DroidSerif]: {
    [FontWeight.Regular]: require("three/examples/fonts/droid/droid_serif_regular.typeface.json"),
    [FontWeight.Bold]: require("three/examples/fonts/droid/droid_serif_bold.typeface.json"),
  },
  [FontName.Gentilis]: {
    [FontWeight.Regular]: require("three/examples/fonts/gentilis_regular.typeface.json"),
    [FontWeight.Bold]: require("three/examples/fonts/gentilis_bold.typeface.json"),
  },
  [FontName.Helvetiker]: {
    [FontWeight.Regular]: require("three/examples/fonts/helvetiker_regular.typeface.json"),
    [FontWeight.Bold]: require("three/examples/fonts/helvetiker_bold.typeface.json"),
  },
  [FontName.Optimer]: {
    [FontWeight.Regular]: require("three/examples/fonts/optimer_regular.typeface.json"),
    [FontWeight.Bold]: require("three/examples/fonts/optimer_bold.typeface.json"),
  },
} as const

type State = {
  firstLetter: boolean
  isStopped: boolean
  pointerX: number
  pointerXOnPointerDown: number
  targetRotation: number
  targetRotationOnPointerDown: number
}

type MeshItems = Array<Mesh<TextGeometry, MeshPhongMaterial[]>>

type Simulation = {
  camera: PerspectiveCamera
  cameraTarget: Vector3
  dirLight: DirectionalLight
  group: Group
  meshItems: MeshItems
  plane: Mesh
  pointLight: PointLight
  props: Props
  renderer: WebGLRenderer
  scene: Scene
  state: State
  stop: () => void
}

const bevelSize = 1.5
const bevelThickness = 2
const curveSegments = 4
const height = 400
const hover = 30
const textHeight = 20

const materials = [
  new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
  new MeshPhongMaterial({ color: 0xffffff }), // side
]

type CreateDemo = (config: {
  previousSimulation: Simulation | null
  props: Props
}) => Simulation

const createDemo: CreateDemo = ({ previousSimulation, props }) => {
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const halfWidth = width / 2

  const camera =
    previousSimulation?.camera ??
    new PerspectiveCamera(30, width / height, 1, 1500)
  const renderer =
    previousSimulation?.renderer ?? new WebGLRenderer({ antialias: true })
  const scene = previousSimulation?.scene ?? new Scene()
  const group = previousSimulation?.group ?? new Group()
  const cameraTarget =
    previousSimulation?.cameraTarget ?? new Vector3(0, 150, 0)
  const plane =
    previousSimulation?.plane ??
    new Mesh(
      new PlaneGeometry(10000, 10000),
      new MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
      })
    )
  const dirLight =
    previousSimulation?.dirLight ?? new DirectionalLight(0xffffff, 0.125)
  const pointLight =
    previousSimulation?.pointLight ?? new PointLight(0xffffff, 1.5)
  const meshItems: MeshItems = previousSimulation?.meshItems ?? []

  const { bevelEnabled, fontName, fontWeight, size, text } = props

  const state: State = {
    firstLetter: true,
    pointerX: 0,
    pointerXOnPointerDown: 0,
    targetRotation: 0,
    targetRotationOnPointerDown: 0,

    ...(previousSimulation?.state ?? {}),
    isStopped: false,
  }

  const onPointerMove = (pointerEvent: PointerEvent) => {
    if (!pointerEvent.isPrimary) {
      return
    }

    state.pointerX = pointerEvent.clientX - halfWidth

    state.targetRotation =
      state.targetRotationOnPointerDown +
      (state.pointerX - state.pointerXOnPointerDown) * 0.02
  }

  const onPointerUp = (pointerEvent: PointerEvent) => {
    if (!pointerEvent.isPrimary) {
      return
    }

    document.removeEventListener("pointermove", onPointerMove)
    document.removeEventListener("pointerup", onPointerUp)
  }

  const onPointerDown = (pointerEvent: PointerEvent) => {
    if (!pointerEvent.isPrimary) {
      return
    }

    state.pointerXOnPointerDown = pointerEvent.clientX - halfWidth
    state.targetRotationOnPointerDown = state.targetRotation

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("pointerup", onPointerUp)
  }

  const createSimulation = () => ({
    camera,
    cameraTarget,
    dirLight,
    group,
    meshItems,
    plane,
    pointLight,
    props,
    renderer,
    scene,
    state,
    stop: () => {
      container.removeEventListener("pointerdown", onPointerDown)
      state.isStopped = true
    },
  })

  const addListeners = () => {
    container.addEventListener("pointerdown", onPointerDown)
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    group.rotation.y += (state.targetRotation - group.rotation.y) * 0.05

    camera.lookAt(cameraTarget)

    renderer.clear()
    renderer.render(scene, camera)
  }

  const getFont = () => {
    const {
      [fontName]: { [fontWeight]: fontsData },
    } = fontsMap

    return new Font(fontsData)
  }

  const createText = () => {
    const textGeo = new TextGeometry(text, {
      bevelEnabled,
      bevelSize,
      bevelThickness,
      curveSegments,
      font: getFont(),
      height: textHeight,
      size,
    })

    textGeo.computeBoundingBox()

    const centerOffset =
      -0.5 * (textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x)

    const textMesh1 = new Mesh(textGeo, materials)

    textMesh1.position.x = centerOffset
    textMesh1.position.y = hover
    textMesh1.position.z = 0

    textMesh1.rotation.x = 0
    textMesh1.rotation.y = Math.PI * 2

    group.add(textMesh1)

    meshItems.push(textMesh1)

    const textMesh2 = new Mesh(textGeo, materials)

    textMesh2.position.x = centerOffset
    textMesh2.position.y = -hover
    textMesh2.position.z = textHeight

    textMesh2.rotation.x = Math.PI
    textMesh2.rotation.y = Math.PI * 2

    group.add(textMesh2)

    meshItems.push(textMesh2)
  }

  const refreshText = () => {
    meshItems.forEach((meshItem) => {
      group.remove(meshItem)
    })
    meshItems.length = 0

    if (!text) {
      return
    }

    createText()
  }

  if (previousSimulation) {
    addListeners()
    animate()
    refreshText()

    return createSimulation()
  }

  addListeners()

  dirLight.position.set(0, 0, 1).normalize()
  scene.add(dirLight)
  camera.position.set(0, 400, 700)
  pointLight.position.set(0, 100, 90)
  scene.add(pointLight)

  scene.background = new Color(0xffffff)
  scene.fog = new Fog(0xcccccc, 250, 1400)

  pointLight.color.setHSL(Math.random(), 1, 0.5)

  group.position.y = 100

  scene.add(group)

  refreshText()

  plane.position.y = 100
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  container.innerHTML = ""
  container.appendChild(renderer.domElement)

  container.style.touchAction = "none"

  animate()

  return createSimulation()
}

const ThreeJSText = (props: Props) => {
  const [previousSimulation, setPreviousSimulation] =
    React.useState<Simulation | null>(null)

  React.useEffect(() => {
    const newSimulation = createDemo({ previousSimulation, props })

    setPreviousSimulation(newSimulation)

    return () => {
      newSimulation.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[webAPIDocs.pointerEvent]}
        source="https://threejs.org/examples/webgl_geometry_text.html#FF00CB010#three.js"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSText"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSText {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [fontNameArg, fontNameControl] = createSelectControl(
  Object.values(FontName)
)
const [fontWeightArg, fontWeightControl] = createSelectControl(
  Object.values(FontWeight)
)
const [sizeArg, sizeControls] = createRangeControl({
  diffMax: 100,
  diffMin: 20,
  initialValue: 70,
  step: 1,
})

const args: Props = {
  bevelEnabled: true,
  fontName: fontNameArg,
  fontWeight: fontWeightArg,
  size: sizeArg,
  text: "Demos",
}

Common.args = args

export default {
  argTypes: {
    fontName: fontNameControl,
    fontWeight: fontWeightControl,
    size: sizeControls,
  },
  component: ThreeJSText,
  title: "ThreeJS/Text",
}
