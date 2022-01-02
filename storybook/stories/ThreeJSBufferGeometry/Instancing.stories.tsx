import React from "react"
import {
  Color,
  DoubleSide,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  Vector4,
  WebGLRenderer,
} from "three"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

import { ROOT_ID } from "./constants"

type Props = {
  colorAnimation: boolean
  expansionAnimation: boolean
  instancesCount: number
  speed: number
}

const FRAGMENT_SHADER_COLOR_SIN_ID = "fragmentshadercolorsin"
const FRAGMENT_SHADER_COLOR_PLAIN = "fragmentshadercolorplain"
const VERTEX_SHADER_ID = "vertexshader"

const vertexShaderCode = `
precision highp float;

uniform float sineTime;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec4 color;
attribute vec4 orientationStart;
attribute vec4 orientationEnd;

varying vec3 vPosition;
varying vec4 vColor;

void main(){
  vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
  vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
  vec3 vcV = cross( orientation.xyz, vPosition );
  vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

  vColor = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
}
`

const createFragmentShader = ({
  withColorAnimation,
}: {
  withColorAnimation: boolean
}) => `
  precision highp float;

  uniform float time;

  varying vec3 vPosition;
  varying vec4 vColor;

  void main() {
    vec4 color = vec4(vColor);
    ${
      withColorAnimation
        ? "color.r += sin( vPosition.x * 10.0 + time ) * 0.5;"
        : ""
    }

    gl_FragColor = color;
  }
`

const fragmentShaderColorSinCode = createFragmentShader({
  withColorAnimation: true,
})
const fragmentShaderColorPlainCode = createFragmentShader({
  withColorAnimation: false,
})

type State = {
  expansionTime: number
  isStopped: boolean
  rotationTime: number
}

type SimulationElements = {
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  scene: Scene
  trianglesGeometry: InstancedBufferGeometry
  trianglesMesh: Mesh
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
    expansionTime: 0,
    rotationTime: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const getShaders = () => {
    const fragmentShaderColorSinText = (
      document.getElementById(FRAGMENT_SHADER_COLOR_SIN_ID) as HTMLElement
    ).textContent!
    const fragmentShaderColorPlainText = (
      document.getElementById(FRAGMENT_SHADER_COLOR_PLAIN) as HTMLElement
    ).textContent!
    const vertexShaderText = (
      document.getElementById(VERTEX_SHADER_ID) as HTMLElement
    ).textContent!

    return {
      fragmentShader: props.colorAnimation
        ? fragmentShaderColorSinText
        : fragmentShaderColorPlainText,
      vertexShader: vertexShaderText,
    }
  }

  const elements = ((): SimulationElements => {
    if (prevSimulation) {
      return prevSimulation.elements
    }

    const camera = new PerspectiveCamera(50, width / height, 1, 10)
    const renderer = new WebGLRenderer()
    const scene = new Scene()

    scene.background = new Color(0xffffff)

    const { fragmentShader, vertexShader } = getShaders()

    const trianglesMaterial = new RawShaderMaterial({
      fragmentShader,
      side: DoubleSide,
      transparent: true,
      uniforms: {
        /* eslint-disable id-denylist */
        sineTime: { value: 1.0 },
        time: { value: 1.0 },
        /* eslint-enable id-denylist */
      },
      vertexShader,
    })

    const trianglesGeometry = new InstancedBufferGeometry()
    const trianglesMesh = new Mesh(trianglesGeometry, trianglesMaterial)

    scene.add(trianglesMesh)

    return {
      camera,
      renderer,
      scene,
      trianglesGeometry,
      trianglesMesh,
    }
  })()

  const { camera, renderer, scene, trianglesGeometry, trianglesMesh } = elements

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    camera.position.z = 2

    const vector = new Vector4()

    const positions = []
    const offsets: number[] = []
    const colors: number[] = []
    const orientationsStart: number[] = []
    const orientationsEnd: number[] = []

    const positionBase = 0.025

    positions.push(positionBase, -positionBase, 0)
    positions.push(-positionBase, positionBase, 0)
    positions.push(0, 0, positionBase)

    Array.from({ length: props.instancesCount }).forEach(() => {
      offsets.push(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )

      colors.push(Math.random(), Math.random(), Math.random(), Math.random())

      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
      vector.normalize()

      orientationsStart.push(vector.x, vector.y, vector.z, vector.w)

      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
      vector.normalize()

      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w)
    })

    trianglesGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    )

    trianglesGeometry.setAttribute(
      "offset",
      new InstancedBufferAttribute(new Float32Array(offsets), 3)
    )
    trianglesGeometry.setAttribute(
      "color",
      new InstancedBufferAttribute(new Float32Array(colors), 4)
    )
    trianglesGeometry.setAttribute(
      "orientationStart",
      new InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
    )
    trianglesGeometry.setAttribute(
      "orientationEnd",
      new InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
    )

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.appendChild(renderer.domElement)
  }

  const render = () => {
    state.rotationTime += props.speed * 0.1
    trianglesMesh.rotation.y = state.rotationTime * 0.0005

    if (props.expansionAnimation) {
      const trianglesMaterial = trianglesMesh.material as RawShaderMaterial

      state.expansionTime += props.speed * 0.1
      /* eslint-disable id-denylist */
      trianglesMaterial.uniforms["time"].value = state.expansionTime * 0.005
      trianglesMaterial.uniforms["sineTime"].value = Math.sin(
        trianglesMaterial.uniforms["time"].value * 0.05
      )
      /* eslint-enable id-denylist */
    }

    trianglesGeometry.instanceCount = props.instancesCount

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
    const trianglesMaterial = trianglesMesh.material as RawShaderMaterial

    trianglesMaterial.fragmentShader = fragmentShader

    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const Instancing = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    simulationRef.current = demo({
      prevSimulation: simulationRef.current,
      props,
    })

    return () => {
      simulationRef.current!.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/webgl_buffergeometry_instancing.html"
        sourceText="Source (official example, ported to TS)"
        storyName={["ThreeJSBufferGeometry", "Instancing"]}
      />
      <div id={ROOT_ID} />
      <script
        dangerouslySetInnerHTML={{ __html: vertexShaderCode }}
        id={VERTEX_SHADER_ID}
        type="x-shader/x-vertex"
      />
      <script
        dangerouslySetInnerHTML={{ __html: fragmentShaderColorSinCode }}
        id={FRAGMENT_SHADER_COLOR_SIN_ID}
        type="x-shader/x-fragment"
      />
      <script
        dangerouslySetInnerHTML={{ __html: fragmentShaderColorPlainCode }}
        id={FRAGMENT_SHADER_COLOR_PLAIN}
        type="x-shader/x-fragment"
      />
    </div>
  )
}

const Template = ((props: Props) => (
  <Instancing {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [speedArg, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const [instancesArg, instancesControls] = createRangeControl({
  diffMin: 50_000,
  initialValue: 50_000,
  step: 1000,
})

const args: Props = {
  colorAnimation: true,
  expansionAnimation: true,
  instancesCount: instancesArg,
  speed: speedArg,
}

Common.args = args

export default {
  argTypes: {
    instancesCount: instancesControls,
    speed: speedControls,
  },
  component: Instancing,
  title: "ThreeJS/BufferGeometry/Instancing",
}

export { Common }
