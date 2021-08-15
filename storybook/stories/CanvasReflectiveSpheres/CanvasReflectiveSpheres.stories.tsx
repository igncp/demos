import React from "react"

import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Font,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TextGeometry,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fontData from "three/examples/fonts/gentilis_regular.typeface.json"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

type Props = {
  automaticCamera: boolean
  lightPointSpeed: number
}

const ROOT_ID = "example"

const cubeWidth = 400
const numberOfSphersPerSide = 5
const sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5
const stepSize = 1.0 / numberOfSphersPerSide

const render = (simulation: Simulation) => {
  const timer = Date.now() * 0.00025

  const {
    camera,
    particleLight,
    props: { automaticCamera },
    renderer,
    scene,
  } = simulation

  if (automaticCamera) {
    camera.position.x = Math.cos(timer) * 800
    camera.position.z = Math.sin(timer) * 800
  }

  camera.lookAt(scene.position)

  particleLight.position.x = Math.sin(timer * 7) * 300
  particleLight.position.y = Math.cos(timer * 5) * 400
  particleLight.position.z = Math.cos(timer * 3) * 300

  renderer.render(scene, camera)
}

const animate = (opts: { simulation: Simulation; state: State }) => {
  if (opts.state.isStopped) {
    return
  }

  requestAnimationFrame(() => animate(opts))

  render(opts.simulation)
}

const main = (props: Props, prevSimulation: Simulation | null) => {
  const state: State = {
    isStopped: false,
  }

  const createSimulation = (): Simulation => ({
    camera: prevSimulation?.camera ?? camera,
    particleLight: prevSimulation?.particleLight ?? particleLight,
    props,
    renderer: prevSimulation?.renderer ?? renderer,
    scene: prevSimulation?.scene ?? scene,
    stop: () => {
      state.isStopped = true
    },
  })

  if (prevSimulation) {
    prevSimulation.stop()

    const simulation = createSimulation()

    animate({
      simulation,
      state,
    })

    return simulation
  }

  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 600

  container.innerHTML = ""
  container.setAttribute("height", `${height}px`)
  container.setAttribute("width", `${width}px`)
  container.style.border = "1px solid black"

  const camera = new PerspectiveCamera(40, width / height, 1, 2500)

  camera.position.set(0.0, 400, 400 * 3.5)

  const scene = new Scene()

  scene.background = new Color(0xffffff)

  const geometry = new SphereGeometry(sphereRadius, 32, 16)

  for (let alpha = 0; alpha <= 1.0; alpha += stepSize) {
    for (let beta = 0; beta <= 1.0; beta += stepSize) {
      for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {
        const diffuseColor = new Color().setHSL(alpha, 0.5, 0.25)

        const material = new MeshPhysicalMaterial({
          clearcoat: 1.0 - alpha,
          clearcoatRoughness: 1.0 - beta,
          color: diffuseColor,
          envMap: null,
          metalness: 0,
          reflectivity: 1.0 - gamma,
          roughness: 0.5,
        })

        const mesh = new Mesh(geometry, material)

        mesh.position.x = alpha * 400 - 200
        mesh.position.y = beta * 400 - 200
        mesh.position.z = gamma * 400 - 200

        scene.add(mesh)
      }
    }
  }

  const addLabel = (name: string, location: Vector3) => {
    const font = new Font(fontData)
    const textGeo = new TextGeometry(name, {
      curveSegments: 1,
      font,
      height: 1,
      size: 20,
    })

    const textMaterial = new MeshBasicMaterial({ color: 0x000000 })
    const textMesh = new Mesh(textGeo, textMaterial)

    textMesh.position.copy(location)
    scene.add(textMesh)
  }

  addLabel("+clearcoat", new Vector3(-350, 0, 0))
  addLabel("-clearcoat", new Vector3(350, 0, 0))

  addLabel("+clearcoatRoughness", new Vector3(0, -300, 0))
  addLabel("-clearcoatRoughness", new Vector3(0, 300, 0))

  addLabel("+reflectivity", new Vector3(0, 0, -300))
  addLabel("-reflectivity", new Vector3(0, 0, 300))

  const particleLight = new Mesh(
    new SphereGeometry(20, 8, 8),
    new MeshBasicMaterial({ color: 0xffa500 })
  )
  const directionalLight = new DirectionalLight(0xffffff, 1)
  const pointLight = new PointLight(0xffa500, 2, 800)

  directionalLight.position.set(1, 1, 1).normalize()
  particleLight.add(pointLight)

  scene.add(particleLight)
  scene.add(new AmbientLight(0x222222))
  scene.add(directionalLight)

  const renderer = new WebGLRenderer({ antialias: true })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.75
  renderer.setClearColor(0xffffff, 0)

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.minDistance = 200
  controls.maxDistance = 2000

  container.appendChild(renderer.domElement)

  const newSimulation = createSimulation()

  animate({
    simulation: newSimulation,
    state,
  })

  return newSimulation
}

type Simulation = {
  camera: PerspectiveCamera
  particleLight: Mesh<SphereGeometry, MeshBasicMaterial>
  props: Props
  renderer: WebGLRenderer
  scene: Scene
  stop: () => void
}

type State = {
  isStopped: boolean
}

const CanvasLayerWaves = (props: Props) => {
  const [prevSimulation, setPrevSimulation] = React.useState<Simulation | null>(
    null
  )

  React.useEffect(() => {
    const newSimulation = main(props, prevSimulation)

    setPrevSimulation(newSimulation)
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_variations_physical.html"
        storyName="CanvasReflectiveSpheres"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <CanvasLayerWaves {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [lightPointSpeedArg, lightPointSpeedControls] = createRangeControl(
  50,
  1,
  50
)

const args: Props = {
  automaticCamera: false,
  lightPointSpeed: lightPointSpeedArg,
}

Common.args = args

export default {
  argTypes: {
    lightPointSpeed: lightPointSpeedControls,
  },
  component: CanvasLayerWaves,
  title: "Canvas/Reflective Spheres",
}
