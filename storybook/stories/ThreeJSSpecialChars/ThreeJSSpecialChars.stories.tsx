import React from "react"
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"

import { StoryInfo } from "../common"

const ROOT_ID = "example"
const LOADING_ID = "loading!"

type Props = {
  text: string
}

type SimulationState = {
  currentTime: number
  font: Font | null
  isStopped: boolean
  textMeshId: string
}

class Simulation {
  private props: Readonly<Props>
  private readonly elements: Readonly<{
    camera: PerspectiveCamera
    controls: OrbitControls
    particleLightBlue: Mesh
    particleLightGreen: Mesh
    renderer: WebGLRenderer
    scene: Scene
  }>

  private readonly state: SimulationState = {
    currentTime: 0,
    font: null,
    isStopped: false,
    textMeshId: "",
  }

  public constructor(props: Props) {
    this.props = props

    const container = document.getElementById(ROOT_ID) as HTMLElement
    const { width } = container.getBoundingClientRect()
    const height = 500

    const fontLoader = new FontLoader()

    const scene = new Scene()

    scene.background = new Color(0xffffff)

    const camera = new PerspectiveCamera(30, width / height, 1, 3000)

    camera.position.set(100, 100, 1500)

    const renderer = new WebGLRenderer({ antialias: true })

    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    const pointLightGreen = new PointLight(0x00ff00, 3)
    const pointLightBlue = new PointLight(0x0000ff, 3)

    pointLightGreen.position.set(10, 10, 9)
    pointLightBlue.position.set(10, 10, 9)

    const sphereGeometry = new SphereGeometry(10, 8, 8)

    const particleLightGreen = new Mesh(
      sphereGeometry,
      new MeshBasicMaterial({ color: 0x00ff00 })
    )
    const particleLightBlue = new Mesh(
      sphereGeometry,
      new MeshBasicMaterial({ color: 0x0000ff })
    )

    particleLightGreen.add(pointLightGreen)
    particleLightBlue.add(pointLightBlue)

    scene.add(particleLightGreen)
    scene.add(particleLightBlue)

    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    this.elements = {
      camera,
      controls,
      particleLightBlue,
      particleLightGreen,
      renderer,
      scene,
    }

    fontLoader.load("fonts/yahei.json", (font) => {
      this.state.font = font
      this.renderText()
    })

    this.animate()
  }

  public refresh(newProps: Props) {
    this.props = newProps
    this.renderText()
  }

  public stop() {
    this.state.isStopped = true
  }

  private renderText() {
    const {
      elements: { scene },
      state: { font, textMeshId },
    } = this

    if (!font) {
      return
    }

    const loadingEl = document.getElementById(LOADING_ID)

    loadingEl?.remove()

    const textGeo = new TextGeometry(this.props.text, {
      font,
      height: 5,
      size: 80,
    })

    if (textMeshId) {
      const object = scene.getObjectByProperty("uuid", textMeshId) as Mesh

      object.geometry.dispose()
      ;(object.material as MeshPhongMaterial).dispose()
      scene.remove(object)
    }

    const color = new Color(0x777777)

    const textMaterial = new MeshPhongMaterial({ color })
    const text = new Mesh(textGeo, textMaterial)

    text.position.x = -400
    text.position.y = 200
    this.state.textMeshId = text.uuid

    scene.add(text)
  }

  private animate() {
    if (this.state.isStopped) {
      return
    }

    requestAnimationFrame(() => {
      this.animate()
    })

    const {
      elements: {
        camera,
        controls,
        particleLightBlue,
        particleLightGreen,
        renderer,
        scene,
      },
    } = this

    this.state.currentTime += 0.005

    const {
      state: { currentTime },
    } = this

    particleLightGreen.position.x = Math.sin(currentTime * 7) * 200
    particleLightGreen.position.y = Math.cos(currentTime * 5) * 200
    particleLightGreen.position.z = Math.cos(currentTime * 3) * 200

    particleLightBlue.position.x = Math.cos(currentTime * 9) * 200
    particleLightBlue.position.y = Math.sin(currentTime * 7) * 200
    particleLightBlue.position.z = Math.sin(currentTime * 5) * 200

    renderer.clear()
    renderer.render(scene, camera)
    controls.update()
  }
}

const ThreeJSSpecialChars = (props: Props) => {
  const simulation = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    simulation.current = new Simulation(props)
  }, [props])

  React.useEffect(() => () => {
    simulation.current?.stop()
  })

  return (
    <div>
      <StoryInfo
        docs={[]}
        source={[
          "https://blog.andrewray.me/creating-a-3d-font-in-three-js/",
          "https://gero3.github.io/facetype.js/",
        ]}
        storyName="ThreeJSSpecialChars"
      />
      <p id={LOADING_ID}>Loading ...</p>
      <p>
        This story shows how to display special fonts by using facetype to
        support multiple unicode characters
      </p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Common = (props: Props) => <ThreeJSSpecialChars {...props} />

const args = {
  text: "你好，世界\nこんにちわ\n還有粵語",
}

Common.args = args

export default {
  argTypes: {},
  component: ThreeJSSpecialChars,
  title: "ThreeJS/SpecialChars",
}

export { Common }
