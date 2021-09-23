import { scalePow } from "d3"
import React from "react"
import {
  AdditiveBlending,
  Blending,
  Color,
  Float32BufferAttribute,
  Font,
  Line,
  NoBlending,
  NormalBlending,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  TextGeometry,
  WebGLRenderer,
} from "three"
import FontData from "three/examples/fonts/helvetiker_bold.typeface.json"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import {
  StoryInfo,
  TemplateType,
  createRangeControl,
  createSelectControl,
  threeDocs,
  webAPIDocs,
} from "../common"

import { fragmentShader, vertexShader } from "./shaders"

const speedScale = scalePow().exponent(3).domain([0, 1]).range([0, 1])

enum BlendingType {
  Additive = "additive",
  None = "none",
  Normal = "normal",
}

const blendingMap: { [key in BlendingType]: Blending } = {
  [BlendingType.Additive]: AdditiveBlending,
  [BlendingType.None]: NoBlending,
  [BlendingType.Normal]: NormalBlending,
}

const ROOT_ID = "example"
const FRAGMENT_SHADER_ID = "fragmentshader"
const VERTEX_SHADER_ID = "vertexshader"

/* eslint-disable id-denylist */
type Uniforms = {
  amplitude: { value: number }
  color: { value: Color }
  opacity: { value: number }
}
/* eslint-enable id-denylist */

type SimulationEls = {
  camera: PerspectiveCamera
  line: Line
  renderer: WebGLRenderer
  scene: Scene
  textGeometry: TextGeometry
  uniforms: Uniforms
}

type Props = {
  blending: BlendingType
  speed: number
  text: string
}

type State = {
  isStopped: boolean
  rotationY: number
}

type Simulation = {
  props: Props
  simulationElements: SimulationEls
  state: State
  stop: () => void
}

const font = new Font(FontData)

const createDemo = ({
  prevSimulation,
  props,
}: {
  prevSimulation: Simulation | null
  props: Props
}): Simulation => {
  const { text } = props

  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 600

  const state: State = {
    rotationY: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }

  const simulationElements = ((): SimulationEls => {
    /* eslint-disable id-denylist */
    const uniforms: Uniforms = {
      amplitude: { value: 5.0 },
      color: { value: new Color(0xffffff) },
      opacity: { value: 0.3 },
    }
    /* eslint-enable id-denylist */

    const shaderMaterial = new ShaderMaterial({
      blending: blendingMap[props.blending],
      depthTest: false,
      fragmentShader: document.getElementById(FRAGMENT_SHADER_ID)!.textContent!,
      transparent: true,
      uniforms,
      vertexShader: document.getElementById(VERTEX_SHADER_ID)!.textContent!,
    })

    const textGeometry = new TextGeometry(text, {
      bevelEnabled: true,
      bevelSegments: 10,
      bevelSize: 1.5,
      bevelThickness: 5,
      curveSegments: 10,
      font,
      height: 15,
      size: 50,
    })

    const line = new Line(textGeometry, shaderMaterial)

    line.rotation.x = 0.2

    const alwaysNewEls = {
      line,
      textGeometry,
      uniforms,
    }

    if (prevSimulation) {
      prevSimulation.simulationElements.scene.clear()
      prevSimulation.simulationElements.scene.add(line)

      return {
        ...prevSimulation.simulationElements,
        ...alwaysNewEls,
      }
    }

    return {
      camera: new PerspectiveCamera(30, width / height, 1, 10000),
      renderer: new WebGLRenderer({ antialias: true }),
      scene: new Scene(),
      ...alwaysNewEls,
    }
  })()

  const createSimulation = () => ({
    props,
    simulationElements,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const { camera, line, renderer, scene, textGeometry, uniforms } =
    simulationElements

  const setupNewSimulation = () => {
    camera.position.z = 400

    scene.background = new Color(0x050505)

    scene.add(line)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""

    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.set(0, 0, 0)
    controls.update()
  }

  const setupSimulation = () => {
    const {
      attributes: {
        position: { count },
      },
    } = textGeometry

    const customColor = new Float32BufferAttribute(count * 3, 3)
    const color = new Color(0x000000)

    const { count: customColorCount } = customColor

    Array.from({ length: customColorCount }).forEach((...[, colorIndex]) => {
      color.setHSL(colorIndex / customColorCount, 0.5, 0.5)
      color.toArray(customColor.array, colorIndex * customColor.itemSize)
    })

    textGeometry.setAttribute("customColor", customColor)

    const displacement = new Float32BufferAttribute(count * 3, 3)

    textGeometry.setAttribute("displacement", displacement)

    textGeometry.center()
  }

  const render = () => {
    const speedValue = speedScale(props.speed)

    state.rotationY += speedValue

    line.rotation.y = state.rotationY

    uniforms.amplitude.value = Math.sin(0.5 * state.rotationY) // eslint-disable-line id-denylist
    uniforms.color.value.offsetHSL(0.0005, 0, 0)

    const {
      geometry: { attributes: lineAttributes },
    } = line
    const displacementArr = lineAttributes.displacement.array as number[]

    for (
      let displacementIndex = 0;
      displacementIndex < displacementArr.length;
      displacementIndex += 3
    ) {
      displacementArr[displacementIndex] += 0.3 * (0.5 - Math.random())
      displacementArr[displacementIndex + 1] += 0.3 * (0.5 - Math.random())
      displacementArr[displacementIndex + 2] += 0.3 * (0.5 - Math.random())
    }

    lineAttributes.displacement.needsUpdate = true

    renderer.render(scene, camera)
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    render()
  }

  setupSimulation()

  if (prevSimulation) {
    animate()

    return createSimulation()
  }

  setupNewSimulation()
  animate()

  return createSimulation()
}

const ThreeJSTextShaders = (props: Props) => {
  const [prevSimulation, setPrevSimulation] = React.useState<Simulation | null>(
    null
  )

  React.useEffect(() => {
    const newSimulation = createDemo({ prevSimulation, props })

    setPrevSimulation(newSimulation)

    return () => {
      newSimulation.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[
          threeDocs.materialsConstants,
          threeDocs.shaderMaterial,
          webAPIDocs.GLSLShaders,
        ]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_custom_attributes_lines.html"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSTextShaders"
      />
      <div id={ROOT_ID} />
      <script
        dangerouslySetInnerHTML={{ __html: vertexShader }}
        id={VERTEX_SHADER_ID}
        type="x-shader/x-vertex"
      />
      <script
        dangerouslySetInnerHTML={{ __html: fragmentShader }}
        id={FRAGMENT_SHADER_ID}
        type="x-shader/x-fragment"
      />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSTextShaders {...props} />
)) as TemplateType<Props>

const [blendingArgs, blendingControls] = createSelectControl(
  Object.values(BlendingType)
)
const [speedArgs, speedControls] = createRangeControl({
  diffMax: 0.8,
  diffMin: 0.2,
  initialValue: 0.2,
  step: 0.01,
})

const Common = Template.bind({})

const args: Props = {
  blending: blendingArgs,
  speed: speedArgs,
  text: "Demos\nExample",
}

Common.args = args

export default {
  argTypes: {
    blending: blendingControls,
    speed: speedControls,
  },
  component: ThreeJSTextShaders,
  title: "ThreeJS/Text Shaders",
}

export { Common }
