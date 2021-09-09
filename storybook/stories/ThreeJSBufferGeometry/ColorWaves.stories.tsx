import React from "react"
import {
  CircleGeometry,
  Color,
  IUniform,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

import circleImg from "./circle.png"

const ROOT_ID = "example"

const FRAGMENT_SHADER_ID = "fragmentshader"
const VERTEX_SHADER_ID = "vertexshader"

const vertexShaderCode = `
precision highp float;

// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float wavesTime;
attribute vec3 translate;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vColorScale;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(translate, 1.0);
  vec3 translateTime = vec3(translate.x + wavesTime, translate.y + wavesTime, translate.z + wavesTime);
  float timeScale = sin(translateTime.x * 2.1) + sin(translateTime.y * 3.2) + sin(translateTime.z * 4.3);

  vColorScale = timeScale;
  timeScale = timeScale * 10.0 + 10.0;

  mvPosition.xyz += position * timeScale;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
`

const getFragmentShaderCode = ({
  colorScaleDivisor,
  rgbFactor,
  saturationFactor,
}: {
  colorScaleDivisor: number
  rgbFactor: number
  saturationFactor: number
}) => `
precision highp float;

uniform sampler2D texture;

varying vec2 vUv;
varying float vColorScale;

vec3 HUEtoRGB(float Hue) {
  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mod.xhtml
  Hue = mod(Hue,1.0);

  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/abs.xhtml
  float R = abs(Hue * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(Hue * 6.0 - 2.0);
  float B = 2.0 - abs(Hue * 6.0 - 4.0);

  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/clamp.xhtml
  return clamp(vec3(R, G, B), 0.0, 1.0);
}

vec3 HSLtoRGB(vec3 HSL) {
  vec3 RGB = HUEtoRGB(HSL.x) * ${rgbFactor.toFixed(1)};

  float Saturation = HSL.y * ${saturationFactor.toFixed(1)};
  float Lightness = HSL.z;
  float C = (1.0 - abs(2.0 * Lightness - 1.0)) * Saturation;

  return (RGB - 0.5) * C + Lightness;
}

void main() {
  vec4 diffuseColor = texture2D(texture, vUv);

  gl_FragColor = vec4(
    diffuseColor.xyz *
      HSLtoRGB(
        vec3(vColorScale/${colorScaleDivisor.toFixed(1)}, 1.0, 0.5)
      ),
    diffuseColor.w
  );

  // https://gamedev.stackexchange.com/a/100571
  if (diffuseColor.w < 0.5) discard;
}
`

type Props = {
  colorScaleDivisor: number
  cubeSize: number
  particleCount: number
  rgbFactor: number
  rotationSpeed: number
  saturationFactor: number
  wavesSpeed: number
}

type State = {
  isStopped: boolean
  rotationTime: number
  wavesTime: number
}

type SimulationElements = {
  camera: PerspectiveCamera
  cubeMaterial: RawShaderMaterial
  cubeMesh: Mesh
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
    rotationTime: 0,
    wavesTime: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const getShaders = () => {
    const fragmentShader = (
      document.getElementById(FRAGMENT_SHADER_ID) as HTMLElement
    ).textContent!
    const vertexShader = (
      document.getElementById(VERTEX_SHADER_ID) as HTMLElement
    ).textContent!

    return {
      fragmentShader,
      vertexShader,
    }
  }

  const elements = ((): SimulationElements => {
    if (prevSimulation) {
      return prevSimulation.elements
    }

    const renderer = new WebGLRenderer()
    const camera = new PerspectiveCamera(50, width / height, 1, 5000)
    const scene = new Scene()

    scene.background = new Color(0xffffff)

    const circleGeometry = new CircleGeometry(1, 6)

    const cubeGeometry = new InstancedBufferGeometry()

    cubeGeometry.index = circleGeometry.index // eslint-disable-line id-denylist
    cubeGeometry.attributes = circleGeometry.attributes

    const { particleCount } = props

    const translateArray = new Float32Array(particleCount * 3)

    const particleCountTriple = particleCount * 3

    for (
      let particleIndexTriple = 0;
      particleIndexTriple < particleCountTriple;
      particleIndexTriple += 3
    ) {
      for (let coordinateIndex = 0; coordinateIndex < 3; coordinateIndex += 1) {
        translateArray[particleIndexTriple + coordinateIndex] =
          Math.random() * 2 - 1
      }
    }

    // https://threejs.org/docs/#api/en/core/InstancedBufferAttribute
    cubeGeometry.setAttribute(
      "translate",
      new InstancedBufferAttribute(translateArray, 3)
    )

    const { fragmentShader, vertexShader } = getShaders()

    const cubeMaterial = new RawShaderMaterial({
      depthTest: true,
      depthWrite: true,
      fragmentShader,
      uniforms: {
        texture: {
          value: new TextureLoader().load(circleImg), // eslint-disable-line id-denylist
        },
        wavesTime: { value: 0.0 }, // eslint-disable-line id-denylist
      },
      vertexShader,
    })

    const cubeMesh = new Mesh(cubeGeometry, cubeMaterial)
    const { cubeSize } = props

    cubeMesh.scale.set(cubeSize, cubeSize, cubeSize)
    scene.add(cubeMesh)

    return {
      camera,
      cubeMaterial,
      cubeMesh,
      renderer,
      scene,
    }
  })()

  const { camera, cubeMaterial, cubeMesh, renderer, scene } = elements

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    camera.position.z = 1400

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const render = () => {
    state.rotationTime += props.rotationSpeed * 0.0001
    state.wavesTime += props.wavesSpeed * 0.0001
    ;(cubeMaterial.uniforms["wavesTime"] as IUniform<number>).value = // eslint-disable-line id-denylist
      state.wavesTime

    cubeMesh.rotation.x = state.rotationTime * 0.2
    cubeMesh.rotation.y = state.rotationTime * 0.4

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
    const { fragmentShader } = getShaders()

    cubeMaterial.fragmentShader = fragmentShader
    cubeMaterial.needsUpdate = true

    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const reRenderProps: Array<keyof Props> = ["cubeSize", "particleCount"]

const ColorWaves = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    const { current: prevSimulation } = simulationRef

    if (
      prevSimulation &&
      reRenderProps.some(
        (reRenderProp) =>
          props[reRenderProp] !== prevSimulation.props[reRenderProp]
      )
    ) {
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
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_instancing_billboards.html"
        storyName={["ThreeJSBufferGeometry", "ColorWaves"]}
      />
      <div id={ROOT_ID} />
      <script
        dangerouslySetInnerHTML={{ __html: vertexShaderCode }}
        id={VERTEX_SHADER_ID}
        type="x-shader/x-vertex"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: getFragmentShaderCode({
            colorScaleDivisor: props.colorScaleDivisor,
            rgbFactor: props.rgbFactor,
            saturationFactor: props.saturationFactor,
          }),
        }}
        id={FRAGMENT_SHADER_ID}
        type="x-shader/x-fragment"
      />
    </div>
  )
}

const Template = ((props: Props) => (
  <ColorWaves {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})

const [cubeSizeArg, cubeSizeControls] = createRangeControl({
  diffMin: 500,
  initialValue: 500,
  step: 1,
})

const [particleCountArg, particleCountControls] = createRangeControl({
  diffMin: 75_000 - 1,
  initialValue: 75_000,
  step: 1,
})

const [rotationSpeedArg, rotationSpeedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const [wavesSpeedArg, wavesSpeedControls] = createRangeControl({
  diffMax: 150,
  diffMin: 50,
  initialValue: 50,
  step: 1,
})

const [colorScaleDivisorArg, colorScaleDivisorControls] = createRangeControl({
  diffMin: 4,
  initialValue: 5,
  step: 1,
})

const [saturationFactorArg, saturationFactorControls] = createRangeControl({
  diffMax: 10,
  diffMin: 0.5,
  initialValue: 1,
  step: 0.5,
})

const [rgbFactorArg, rgbFactorControls] = createRangeControl({
  diffMax: 0,
  diffMin: 1,
  initialValue: 1,
  step: 0.1,
})

const args: Props = {
  colorScaleDivisor: colorScaleDivisorArg,
  cubeSize: cubeSizeArg,
  particleCount: particleCountArg,
  rgbFactor: rgbFactorArg,
  rotationSpeed: rotationSpeedArg,
  saturationFactor: saturationFactorArg,
  wavesSpeed: wavesSpeedArg,
}

Common.args = args

export default {
  argTypes: {
    colorScaleDivisor: colorScaleDivisorControls,
    cubeSize: cubeSizeControls,
    particleCount: particleCountControls,
    rgbFactor: rgbFactorControls,
    rotationSpeed: rotationSpeedControls,
    saturationFactor: saturationFactorControls,
    wavesSpeed: wavesSpeedControls,
  },
  component: ColorWaves,
  title: "ThreeJS/BufferGeometry/ColorWaves",
}
