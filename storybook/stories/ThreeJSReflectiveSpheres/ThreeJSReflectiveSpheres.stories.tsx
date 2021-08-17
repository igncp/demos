import { scalePow } from "d3"
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
  Raycaster,
  Scene,
  SphereGeometry,
  TextGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from "three"
import fontData from "three/examples/fonts/gentilis_regular.typeface.json"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import {
  StoryInfo,
  TemplateType,
  createRangeControl,
  threeDocs,
} from "../common"

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
  const {
    camera,
    particleLight,
    props: { automaticCamera },
    renderer,
    scene,
  } = simulation

  if (automaticCamera) {
    const timer = Date.now() * 0.00025

    camera.position.x = Math.cos(timer) * 800
    camera.position.z = Math.sin(timer) * 800
    camera.lookAt(scene.position)
  }

  const {
    state: { currentTime },
  } = simulation

  particleLight.position.x = Math.sin(currentTime * 7) * 300
  particleLight.position.y = Math.cos(currentTime * 5) * 400
  particleLight.position.z = Math.cos(currentTime * 3) * 300

  renderer.render(scene, camera)
}

const speedScale = scalePow().exponent(3).domain([0, 100]).range([0, 20_000])

const animate = (simulation: Simulation) => {
  if (simulation.state.isStopped) {
    return
  }

  requestAnimationFrame(() => animate(simulation))

  simulation.state.currentTime +=
    speedScale(simulation.props.lightPointSpeed) / 1_000_000

  render(simulation)
}

const main = (props: Props, prevSimulation: Simulation | null) => {
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const containerRect = container.getBoundingClientRect()
  const { width } = containerRect
  const height = 600

  const renderer =
    prevSimulation?.renderer ?? new WebGLRenderer({ antialias: true })
  const camera =
    prevSimulation?.camera ?? new PerspectiveCamera(40, width / height, 1, 2500)
  const scene = prevSimulation?.scene ?? new Scene()
  const spheresList: Sphere[] = prevSimulation?.spheresList ?? []
  const mouse = new Vector2()

  const onClick = (event: MouseEvent) => {
    event.preventDefault()

    mouse.x =
      ((event.clientX - containerRect.left) / renderer.domElement.clientWidth) *
        2 -
      1
    mouse.y =
      -(
        (event.clientY - containerRect.top) /
        renderer.domElement.clientHeight
      ) *
        2 +
      1

    const raycaster = new Raycaster()

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (!intersects.length) {
      return
    }

    const clickedSphere = spheresList.find(
      (s) => s.uuid === intersects[0].object.uuid
    )

    if (!clickedSphere) {
      return
    }

    if (clickedSphere.uuid === state.selectedSphereUuid) {
      spheresList.forEach((sphere) => {
        if (sphere.uuid === clickedSphere.uuid) {
          return
        }

        scene.add(sphere)
      })
      state.selectedSphereUuid = ""
    } else {
      spheresList.forEach((sphere) => {
        if (sphere.uuid === clickedSphere.uuid) {
          return
        }

        scene.remove(sphere)
      })
      state.selectedSphereUuid = clickedSphere.uuid
    }
  }

  container.addEventListener("click", onClick)

  const state: State = {
    currentTime: prevSimulation?.state.currentTime ?? 0,
    isStopped: false,
    selectedSphereUuid: prevSimulation?.state.selectedSphereUuid ?? "",
  }

  const createSimulation = (): Simulation => ({
    camera,
    particleLight: prevSimulation?.particleLight ?? particleLight,
    props,
    renderer,
    scene,
    spheresList,
    state,
    stop: () => {
      container.removeEventListener("click", onClick)
      state.isStopped = true
    },
  })

  if (prevSimulation) {
    prevSimulation.stop()

    const simulation = createSimulation()

    animate(simulation)

    return simulation
  }

  container.innerHTML = ""
  container.setAttribute("height", `${height}px`)
  container.setAttribute("width", `${width}px`)
  container.style.border = "1px solid black"

  camera.position.set(0.0, 400, 400 * 3.5)

  scene.background = new Color(0xffffff)

  const geometry = new SphereGeometry(sphereRadius, 32, 16)

  for (let alpha = 0; alpha <= 1.0; alpha += stepSize) {
    for (let beta = 0; beta <= 1.0; beta += stepSize) {
      for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {
        const diffuseColor = new Color().setRGB(alpha, beta, gamma)

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

        spheresList.push(mesh)
      }
    }
  }

  const addLabel = (name: string, location: Vector3) => {
    const font = new Font(fontData)
    const textGeo = new TextGeometry(name, {
      curveSegments: 1,
      font,
      height: 1,
      size: 40,
    })

    const textMaterial = new MeshBasicMaterial({
      color: 0x000000,
    })
    const textMesh = new Mesh(textGeo, textMaterial)

    textMesh.position.copy(location)
    scene.add(textMesh)
  }

  addLabel("+clearcoat", new Vector3(-550, 0, 0))
  addLabel("-clearcoat", new Vector3(350, 0, 0))

  addLabel("+clearcoatRoughness", new Vector3(-200, -300, 0))
  addLabel("-clearcoatRoughness", new Vector3(-200, 300, 0))

  addLabel("+reflectivity", new Vector3(-150, 0, -300))
  addLabel("-reflectivity", new Vector3(-150, 0, 300))

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

  animate(newSimulation)

  return newSimulation
}

type Sphere = Mesh<SphereGeometry, MeshPhysicalMaterial>

type Simulation = {
  camera: PerspectiveCamera
  particleLight: Mesh<SphereGeometry, MeshBasicMaterial>
  props: Props
  renderer: WebGLRenderer
  scene: Scene
  spheresList: Sphere[]
  state: State
  stop: () => void
}

type State = {
  currentTime: number
  isStopped: boolean
  selectedSphereUuid: string
}

const ThreeJSReflectiveSpheres = (props: Props) => {
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
        docs={[threeDocs.meshPhysicalMaterial]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_variations_physical.html"
        storyName="ThreeJSReflectiveSpheres"
      />
      <p>
        You can click on a sphere to select it and hide the rest. This
        functionality is new and not present in the example.
      </p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSReflectiveSpheres {...props} />
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
  component: ThreeJSReflectiveSpheres,
  title: "ThreeJS/Reflective Spheres",
}
