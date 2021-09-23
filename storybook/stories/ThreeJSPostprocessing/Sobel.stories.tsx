import React from "react"
import {
  AmbientLight,
  Color,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  TorusKnotGeometry,
  Vector2,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js"

import { StoryInfo, TemplateType } from "../common"

enum SobelColor {
  Inverse = "inverse",
  Same = "Same",
}

// three/examples/jsm/shaders/SobelOperatorShader.js

const createSobelShader = (color: SobelColor) => ({
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
      vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

      // kernel definition (in glsl matrices are filled in column-major order)
      const mat3 Gx = mat3(
        -1, -2, -1,
        0, 0, 0,
        1, 2, ${color === SobelColor.Same ? -1 : 1}
      ); // x direction kernel
      const mat3 Gy = mat3(
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
      ); // y direction kernel

      // fetch the 3x3 neighbourhood of a fragment

      // first column
      float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
      float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
      float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;

      // second column
      float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
      float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
      float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;

      // third column
      float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
      float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
      float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;

      // gradient value in x direction
      float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
        Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
        Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

      // gradient value in y direction
      float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
        Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
        Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

      // magnitute of the total gradient
      float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );

      gl_FragColor = vec4( vec3( G ), 1.0 );
    }`,

  uniforms: {
    resolution: { value: new Vector2() }, // eslint-disable-line id-denylist
    tDiffuse: { value: null }, // eslint-disable-line id-denylist
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
})

const ROOT_ID = "example"

type State = {
  rafId: number | null
}

type SimulationElements = {
  camera: PerspectiveCamera
  composer: EffectComposer
  controls: OrbitControls
  renderer: WebGLRenderer
  scene: Scene
}

type Props = {
  enable: boolean
  inverseColor: boolean
}

const getContainer = () => {
  const container = document.getElementById(ROOT_ID) as HTMLElement

  return container
}

class Simulation {
  private readonly state: State
  private readonly elements: Readonly<SimulationElements>
  private readonly dimensions: Readonly<{
    height: number
    width: number
  }>

  private props: Props

  public constructor(props: Props) {
    this.state = {
      rafId: null,
    }

    const container = getContainer()
    const { width } = container.getBoundingClientRect()
    const height = 500

    this.dimensions = {
      height,
      width,
    }

    this.props = props

    const scene = new Scene()

    scene.background = new Color(0xffffff)

    const camera = new PerspectiveCamera(70, width / height, 0.1, 200)

    const renderer = new WebGLRenderer()

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    const composer = new EffectComposer(renderer)
    const controls = new OrbitControls(camera, renderer.domElement)

    this.elements = {
      camera,
      composer,
      controls,
      renderer,
      scene,
    }

    this.init()
    this.animate()
  }

  public stop() {
    this.clearRafId()
  }

  public restart(props: Props) {
    this.clearRafId()
    this.props = props

    const {
      elements: { composer },
    } = this
    const {
      passes: { [composer.passes.length - 1]: currentSobelEffect },
    } = composer

    composer.removePass(currentSobelEffect)

    this.addSobelEffect()
    this.animate()
  }

  private clearRafId() {
    const {
      state: { rafId },
    } = this

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      this.state.rafId = null
    }
  }

  private animate() {
    this.state.rafId = requestAnimationFrame(() => {
      this.animate()
    })

    const {
      elements: { camera, composer, renderer, scene },
    } = this

    if (this.props.enable) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  private init() {
    const {
      elements: { camera, composer, controls, renderer, scene },
    } = this

    camera.position.set(0, 10, 25)
    camera.lookAt(scene.position)

    const torusGeometry = new TorusKnotGeometry(8, 3, 256, 32, 2, 3)
    const phongMaterial = new MeshPhongMaterial({ color: 0xffffff })

    const torusMesh = new Mesh(torusGeometry, phongMaterial)

    scene.add(torusMesh)

    const ambientLight = new AmbientLight(0xcccccc, 0.4)
    const pointLight = new PointLight(0xffffff, 0.8)

    camera.add(pointLight)
    scene.add(ambientLight)

    scene.add(camera)

    const container = getContainer()

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const renderPass = new RenderPass(scene, camera)

    composer.addPass(renderPass)

    const effectGrayScale = new ShaderPass(LuminosityShader)

    composer.addPass(effectGrayScale)

    this.addSobelEffect()

    controls.minDistance = 10
    controls.maxDistance = 100
  }

  private addSobelEffect() {
    const {
      dimensions: { height, width },
      elements: { composer },
    } = this

    const SobelOperatorShader = createSobelShader(
      this.props.inverseColor ? SobelColor.Inverse : SobelColor.Same
    )
    const effectSobel = new ShaderPass(SobelOperatorShader)

    effectSobel.uniforms["resolution"].value.x = width * window.devicePixelRatio
    effectSobel.uniforms["resolution"].value.y =
      height * window.devicePixelRatio

    composer.addPass(effectSobel)
  }
}

const Sobel = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.restart(props)
    } else {
      simulationRef.current = new Simulation(props)
    }

    return () => {
      simulationRef.current!.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source={[
          "https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_sobel.html",
          "https://threejs.org/examples/#webgl_postprocessing_sobel",
        ]}
        storyName={["ThreeJSPostprocessing", "Sobel"]}
      />
      <p>Added the same color case by updating the fragment shader matrix</p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => <Sobel {...props} />) as TemplateType<Props>

const Common = Template.bind({})

const args: Props = {
  enable: false,
  inverseColor: true,
}

Common.args = args

export default {
  argTypes: {},
  component: Sobel,
  title: "ThreeJS/Postprocessing/Sobel",
}

export { Common }
