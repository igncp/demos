import React from "react"
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { Water } from "three/examples/jsm/objects/Water.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

import { ROOT_ID } from "./constants"
import waterTexture from "./waternormals.jpg"

type Props = {
  speed: number
}

const planeSize = 10_000
const textureSize = 512
const boxSize = 30
const sunColor = 0xffffff
const waterColor = 0x001e0f

const createControls = ({
  camera,
  renderer,
}: {
  camera: PerspectiveCamera
  renderer: WebGLRenderer
}) => {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.maxPolarAngle = Math.PI * 0.495
  controls.target.set(0, 10, 0)
  controls.minDistance = 40.0
  controls.maxDistance = 200.0
  controls.update()
}

type State = {
  isStopped: boolean
  timePassed: number
}

type SimulationElements = {
  boxMesh: Mesh
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  scene: Scene
  sky: Sky
  sun: Vector3
  water: Water
}

type Simulation = {
  elements: SimulationElements
  props: Props
  state: State
  stop: () => void
}

const createDemo = ({
  prevSimulation,
  props,
}: {
  prevSimulation: Simulation | null
  props: Props
}): Simulation => {
  const state: State = {
    timePassed: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }

  const container = document.getElementById(ROOT_ID) as HTMLElement

  const height = 500
  const { width } = container.getBoundingClientRect()

  const elements = ((): SimulationElements => {
    if (prevSimulation) {
      return prevSimulation.elements
    }

    const scene = new Scene()
    const waterGeometry = new PlaneGeometry(planeSize, planeSize)
    const water = new Water(waterGeometry, {
      distortionScale: 3.7,
      sunColor,
      sunDirection: new Vector3(),
      textureHeight: textureSize,
      textureWidth: textureSize,
      waterColor,
      waterNormals: new TextureLoader().load(waterTexture, (texture) => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
      }),
    })
    const sun = new Vector3()

    scene.add(water)

    const sky = new Sky()

    sky.scale.setScalar(planeSize)
    scene.add(sky)

    const boxGeometry = new BoxGeometry(boxSize, boxSize, boxSize)
    const boxMaterial = new MeshStandardMaterial({ roughness: 0 })

    const boxMesh = new Mesh(boxGeometry, boxMaterial)

    scene.add(boxMesh)

    const camera = new PerspectiveCamera(55, width / height, 1, 20000)
    const renderer = new WebGLRenderer()

    return {
      boxMesh,
      camera,
      renderer,
      scene,
      sky,
      sun,
      water,
    }
  })()

  const { boxMesh, camera, renderer, scene, sky, sun, water } = elements

  const onWindowResize = () => {
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  window.addEventListener("resize", onWindowResize)

  const createSimulation = () => ({
    elements,
    props,
    state,
    stop: () => {
      window.removeEventListener("resize", onWindowResize)
      state.isStopped = true
    },
  })

  const render = () => {
    state.timePassed += props.speed / 10000

    boxMesh.position.y = Math.sin(state.timePassed) * 25 + 5
    boxMesh.rotation.x = state.timePassed * 0.5
    boxMesh.rotation.z = state.timePassed * 0.51

    const { material: waterMaterial } = water

    waterMaterial.uniforms["time"].value += 1.0 / 60.0 // eslint-disable-line id-denylist

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

  const setupNewSimulation = () => {
    container.innerHTML = ""

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.toneMapping = ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    camera.position.set(30, 30, 100)

    water.rotation.x = -Math.PI / 2

    const {
      material: { uniforms: skyUniforms },
    } = sky

    /* eslint-disable id-denylist */
    skyUniforms["turbidity"].value = 10
    skyUniforms["rayleigh"].value = 2
    skyUniforms["mieCoefficient"].value = 0.005
    skyUniforms["mieDirectionalG"].value = 0.8
    /* eslint-enable id-denylist */

    const pmremGenerator = new PMREMGenerator(renderer)

    const updateSun = () => {
      const parameters = {
        azimuth: 180,
        elevation: 2,
      }
      const phi = MathUtils.degToRad(90 - parameters.elevation)
      const theta = MathUtils.degToRad(parameters.azimuth)

      sun.setFromSphericalCoords(1, phi, theta)

      sky.material.uniforms["sunPosition"].value.copy(sun)
      water.material.uniforms["sunDirection"].value.copy(sun).normalize()

      scene.environment = pmremGenerator.fromScene(sky as any).texture // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    updateSun()

    createControls({ camera, renderer })
  }

  setupNewSimulation()

  animate()

  return createSimulation()
}

const ThreeJSCubeWater = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)
  const [isReadyToRender, setIsReadyToRender] = React.useState(false)

  React.useEffect(() => {
    const onFinish = () => {
      setIsReadyToRender(true)
    }

    const img = document.createElement("img")

    img.src = waterTexture
    img.onload = onFinish
    img.onerror = onFinish
  }, [])

  React.useEffect(() => {
    if (!isReadyToRender) {
      return () => {}
    }

    simulationRef.current = createDemo({
      prevSimulation: simulationRef.current,
      props,
    })

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [props, isReadyToRender])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_shaders_ocean.html"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSCubeWater"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSCubeWater {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [speedArgs, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const args: Props = {
  speed: speedArgs,
}

Common.args = args

export default {
  argTypes: {
    speed: speedControls,
  },
  component: ThreeJSCubeWater,
  title: "ThreeJS/Cube Water",
}

export { Common }
